"""
sync.py — Baixa questões da enem.dev e salva em enem.db
Uso:
    python sync.py               # Sincroniza o ano mais recente disponível
    python sync.py --year 2023   # Ano específico
    python sync.py --all         # Todos os anos (demora mais)
"""

import sqlite3, requests, json, time, argparse, logging
from pathlib import Path

BASE_URL  = "https://api.enem.dev/v1"
DB_PATH   = Path(__file__).parent / "enem.db"
PAGE_SIZE = 50
SLEEP     = 0.4

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)

SCHEMA = """
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS questions (
    id             TEXT PRIMARY KEY,
    year           INTEGER,
    index_num      INTEGER,
    discipline     TEXT,
    language       TEXT,
    context        TEXT,
    files          TEXT,
    correct_answer TEXT
);
CREATE TABLE IF NOT EXISTS alternatives (
    question_id TEXT,
    letter      TEXT,
    text        TEXT,
    file        TEXT,
    PRIMARY KEY (question_id, letter)
);
CREATE INDEX IF NOT EXISTS idx_year       ON questions(year);
CREATE INDEX IF NOT EXISTS idx_discipline ON questions(discipline);
"""

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn

def get(path, params=None):
    for attempt in range(3):
        try:
            r = requests.get(f"{BASE_URL}{path}", params=params, timeout=15)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            log.warning(f"Tentativa {attempt+1}: {e}")
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Falha ao acessar {path}")

def save_question(conn, year, q):
    qid = str(q.get("index", f"{year}_{q.get('number', 0)}"))
    # contexto pode vir em "context" ou "alternativesIntroduction"
    context = q.get("context") or q.get("alternativesIntroduction")
    conn.execute(
        "INSERT OR REPLACE INTO questions VALUES (?,?,?,?,?,?,?,?)",
        (qid, year, q.get("index", q.get("number")), q.get("discipline"),
         q.get("language"), context,
         json.dumps(q.get("files", [])), q.get("correctAlternative"))
    )
    conn.execute("DELETE FROM alternatives WHERE question_id=?", (qid,))
    for a in q.get("alternatives", []):
        conn.execute(
            "INSERT OR REPLACE INTO alternatives VALUES (?,?,?,?)",
            (qid, a.get("letter"), a.get("text"), a.get("file"))
        )
    return qid

def sync_year(conn, year):
    log.info(f"📥 Baixando {year}...")
    page, total = 1, 0
    while True:
        data = get(f"/exams/{year}/questions", {"page": page, "limit": PAGE_SIZE})
        questions = data if isinstance(data, list) else data.get("questions", [])
        if not questions:
            break
        with conn:
            for q in questions:
                save_question(conn, year, q)
        total += len(questions)
        log.info(f"   Página {page}: {len(questions)} questões ({total} total)")
        meta = {} if isinstance(data, list) else data.get("meta", {})
        if page >= meta.get("pages", 1) or len(questions) < PAGE_SIZE:
            break
        page += 1
        time.sleep(SLEEP)
    log.info(f"✅ {year}: {total} questões salvas")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--year", type=int)
    p.add_argument("--all", action="store_true")
    args = p.parse_args()

    conn = db()
    if args.year:
        sync_year(conn, args.year)
    elif args.all:
        exams = get("/exams")
        years = [e["year"] for e in (exams if isinstance(exams, list) else exams.get("exams", []))]
        log.info(f"Anos disponíveis: {years}")
        for y in sorted(years):
            sync_year(conn, y)
            time.sleep(SLEEP)
    else:
        exams = get("/exams")
        years = [e["year"] for e in (exams if isinstance(exams, list) else exams.get("exams", []))]
        latest = max(years)
        sync_year(conn, latest)

    conn.close()
    total = sqlite3.connect(DB_PATH).execute("SELECT COUNT(*) FROM questions").fetchone()[0]
    log.info(f"\n🎉 Banco: {total} questões em {DB_PATH}")

if __name__ == "__main__":
    main()