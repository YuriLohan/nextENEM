"""
app.py — Servidor completo para testar questões ENEM
Roda com: python app.py
Acesse: http://localhost:8000
"""

import json, sqlite3, random
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

DB_PATH = Path(__file__).parent / "enem.db"

app = FastAPI(title="ENEM Tester")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── DB helpers ─────────────────────────────────────────────────────────────────

def get_conn():
    if not DB_PATH.exists():
        raise HTTPException(503, "Banco não encontrado. Rode: python sync.py")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def build_question(row, alts):
    return {
        "id": row["id"],
        "year": row["year"],
        "index": row["index_num"],
        "discipline": row["discipline"],
        "language": row["language"],
        "context": row["context"],
        "files": json.loads(row["files"] or "[]"),
        "alternatives": [{"letter": a["letter"], "text": a["text"], "file": a["file"]} for a in alts],
        "correct_answer": row["correct_answer"],
    }

# ── API ────────────────────────────────────────────────────────────────────────

@app.get("/api/meta")
def meta():
    conn = get_conn()
    total = conn.execute("SELECT COUNT(*) FROM questions").fetchone()[0]
    years = [r[0] for r in conn.execute("SELECT DISTINCT year FROM questions ORDER BY year DESC")]
    discs = [r[0] for r in conn.execute("SELECT DISTINCT discipline FROM questions WHERE discipline IS NOT NULL ORDER BY discipline")]
    conn.close()
    return {"total": total, "years": years, "disciplines": discs}

@app.get("/api/question/random")
def random_q(year: Optional[int] = None, discipline: Optional[str] = None):
    conn = get_conn()
    conds, params = [], []
    if year:        conds.append("year=?");       params.append(year)
    if discipline:  conds.append("discipline=?"); params.append(discipline)
    where = ("WHERE " + " AND ".join(conds)) if conds else ""
    ids = conn.execute(f"SELECT id FROM questions {where}", params).fetchall()
    if not ids:
        raise HTTPException(404, "Nenhuma questão encontrada")
    qid = random.choice(ids)[0]
    row  = conn.execute("SELECT * FROM questions WHERE id=?", (qid,)).fetchone()
    alts = conn.execute("SELECT * FROM alternatives WHERE question_id=? ORDER BY letter", (qid,)).fetchall()
    conn.close()
    return build_question(row, alts)

@app.get("/api/question/{qid}")
def get_q(qid: str):
    conn = get_conn()
    row  = conn.execute("SELECT * FROM questions WHERE id=?", (qid,)).fetchone()
    if not row: raise HTTPException(404, "Questão não encontrada")
    alts = conn.execute("SELECT * FROM alternatives WHERE question_id=? ORDER BY letter", (qid,)).fetchall()
    conn.close()
    return build_question(row, alts)

class Answer(BaseModel):
    answer: str

@app.post("/api/question/{qid}/check")
def check(qid: str, body: Answer):
    conn = get_conn()
    row = conn.execute("SELECT correct_answer FROM questions WHERE id=?", (qid,)).fetchone()
    if not row: raise HTTPException(404, "Questão não encontrada")
    conn.close()
    correct = (row["correct_answer"] or "").upper()
    chosen  = body.answer.upper()
    return {"correct": chosen == correct, "correct_answer": correct, "chosen": chosen}

# ── Frontend ───────────────────────────────────────────────────────────────────

HTML = r"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ENEM Tester</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:    #0e0f14;
    --panel: #15171f;
    --border:#22263a;
    --accent:#5b6ef5;
    --accent2:#f5d45b;
    --text:  #e8eaf6;
    --muted: #7b7f9e;
    --correct:#3dd68c;
    --wrong:  #f55b5b;
    --r: 14px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  header {
    padding: 18px 32px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid var(--border);
    background: var(--panel);
  }
  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -0.5px;
    color: var(--text);
  }
  .logo span { color: var(--accent); }
  .badge {
    background: var(--border);
    color: var(--muted);
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .header-stats {
    margin-left: auto;
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .stat { font-size: 12px; color: var(--muted); }
  .stat strong { color: var(--accent2); font-family: 'Syne', sans-serif; font-size: 16px; }

  /* ── Layout ── */
  .layout {
    display: flex;
    flex: 1;
    gap: 0;
  }

  /* ── Sidebar ── */
  aside {
    width: 240px;
    min-width: 240px;
    background: var(--panel);
    border-right: 1px solid var(--border);
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .filter-label {
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  select {
    width: 100%;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7f9e' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  select:focus { border-color: var(--accent); }

  .btn {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all .15s;
  }
  .btn-primary {
    background: var(--accent);
    color: #fff;
  }
  .btn-primary:hover { background: #7181f7; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    margin-top: 4px;
  }
  .btn-ghost:hover { color: var(--text); border-color: var(--muted); }

  /* Session stats */
  .session-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
  }
  .session-box .filter-label { margin-bottom: 12px; }
  .session-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    font-size: 13px;
    color: var(--muted);
  }
  .session-row strong { color: var(--text); font-weight: 500; }
  .progress-bar {
    height: 4px;
    background: var(--border);
    border-radius: 4px;
    margin-top: 10px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 4px;
    transition: width .4s ease;
  }

  /* ── Main ── */
  main {
    flex: 1;
    padding: 36px 48px;
    max-width: 800px;
  }

  /* Loading / error */
  .state-msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 300px;
    color: var(--muted);
    font-size: 15px;
  }
  .state-msg .icon { font-size: 40px; }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Question card */
  .q-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .chip {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .chip-year  { background: #1a1e2e; color: var(--accent); border: 1px solid var(--accent); }
  .chip-disc  { background: #1a2010; color: #7fd46b; border: 1px solid #3a5a2a; }
  .chip-lang  { background: #201a10; color: #f5a05b; border: 1px solid #5a3a2a; }

  .q-index {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .q-context {
    line-height: 1.75;
    color: #c8cadf;
    font-size: 14.5px;
    white-space: pre-wrap;
    margin-bottom: 24px;
    padding: 20px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--r);
    border-left: 3px solid var(--accent);
  }

  .q-images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  .q-images img {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .q-label {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .alternatives { display: flex; flex-direction: column; gap: 10px; }
  .alt {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 16px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: all .15s;
    background: var(--panel);
    text-align: left;
    width: 100%;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }
  .alt:hover:not(:disabled) {
    border-color: var(--accent);
    background: #1a1d2e;
  }
  .alt-letter {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 14px;
    color: var(--accent);
    min-width: 18px;
    margin-top: 1px;
  }
  .alt.selected        { border-color: var(--accent); background: #1a1d2e; }
  .alt.correct         { border-color: var(--correct); background: #0e2018; }
  .alt.correct .alt-letter { color: var(--correct); }
  .alt.wrong           { border-color: var(--wrong); background: #220e0e; }
  .alt.wrong .alt-letter   { color: var(--wrong); }
  .alt:disabled        { cursor: default; }

  .alt-img { max-width: 100%; margin-top: 6px; border-radius: 6px; }

  /* Feedback */
  .feedback {
    margin-top: 20px;
    padding: 16px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    display: none;
    align-items: center;
    gap: 12px;
    animation: fadeIn .3s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
  .feedback.correct { display: flex; background: #0e2018; border: 1px solid var(--correct); color: var(--correct); }
  .feedback.wrong   { display: flex; background: #220e0e; border: 1px solid var(--wrong); color: var(--wrong); }
  .feedback-icon { font-size: 22px; }

  .next-btn {
    margin-top: 20px;
    display: none;
  }
  .next-btn.visible { display: block; }
</style>
</head>
<body>
<header>
  <div class="logo">ENEM<span>.</span>test</div>
  <div class="badge">API Tester</div>
  <div class="header-stats">
    <div class="stat"><strong id="hdr-total">—</strong><br>questões no banco</div>
  </div>
</header>

<div class="layout">
  <aside>
    <div>
      <div class="filter-label">Ano</div>
      <select id="sel-year"><option value="">Qualquer ano</option></select>
    </div>
    <div>
      <div class="filter-label">Disciplina</div>
      <select id="sel-disc"><option value="">Qualquer área</option></select>
    </div>
    <button class="btn btn-primary" onclick="loadRandom()">▶ Nova questão</button>
    <button class="btn btn-ghost" onclick="resetSession()">↺ Reiniciar sessão</button>

    <div class="session-box">
      <div class="filter-label">Sessão atual</div>
      <div class="session-row"><span>Respondidas</span><strong id="s-total">0</strong></div>
      <div class="session-row"><span>Corretas</span><strong id="s-correct" style="color:var(--correct)">0</strong></div>
      <div class="session-row"><span>Erradas</span><strong id="s-wrong" style="color:var(--wrong)">0</strong></div>
      <div class="session-row"><span>Aproveitamento</span><strong id="s-pct">—</strong></div>
      <div class="progress-bar"><div class="progress-fill" id="s-bar" style="width:0%"></div></div>
    </div>
  </aside>

  <main id="main">
    <div class="state-msg">
      <div class="icon">📖</div>
      <div>Selecione os filtros e clique em <strong>Nova questão</strong></div>
    </div>
  </main>
</div>

<script>
  let session = { total: 0, correct: 0, wrong: 0 };
  let currentQ = null;
  let answered  = false;

  async function fetchMeta() {
    const r = await fetch('/api/meta');
    const d = await r.json();
    document.getElementById('hdr-total').textContent = d.total.toLocaleString('pt-BR');
    const ys = document.getElementById('sel-year');
    d.years.forEach(y => { const o = document.createElement('option'); o.value=y; o.text=y; ys.appendChild(o); });
    const ds = document.getElementById('sel-disc');
    const labels = { matematica:'Matemática', linguagens:'Linguagens', humanas:'Ciências Humanas', natureza:'Ciências da Natureza' };
    d.disciplines.forEach(d2 => { const o = document.createElement('option'); o.value=d2; o.text=labels[d2]||d2; ds.appendChild(o); });
  }

  async function loadRandom() {
    const year = document.getElementById('sel-year').value;
    const disc = document.getElementById('sel-disc').value;
    let url = '/api/question/random';
    const params = new URLSearchParams();
    if (year) params.set('year', year);
    if (disc) params.set('discipline', disc);
    if ([...params].length) url += '?' + params;

    showLoading();
    try {
      const r = await fetch(url);
      if (!r.ok) { showError(await r.json()); return; }
      currentQ = await r.json();
      answered = false;
      renderQuestion(currentQ);
    } catch(e) { showError({detail: 'Erro de conexão'}); }
  }

  function renderQuestion(q) {
    const disc_labels = { matematica:'Matemática', linguagens:'Linguagens', humanas:'Ciências Humanas', natureza:'Ciências da Natureza' };
    const disc_colors = { matematica:'chip-disc', linguagens:'chip-lang', humanas:'chip-disc', natureza:'chip-disc' };

    let html = `<div class="q-meta">
      <span class="chip chip-year">${q.year}</span>
      ${q.discipline ? `<span class="chip ${disc_colors[q.discipline]||'chip-disc'}">${disc_labels[q.discipline]||q.discipline}</span>` : ''}
      ${q.language ? `<span class="chip chip-lang">${q.language}</span>` : ''}
    </div>
    <div class="q-index">Questão ${q.index}</div>`;

    if (q.context) {
      html += `<div class="q-context">${escHtml(q.context)}</div>`;
    }
    if (q.files && q.files.length) {
      html += `<div class="q-images">${q.files.map(f=>`<img src="${f}" alt="imagem da questão">`).join('')}</div>`;
    }

    html += `<div class="q-label">Alternativas</div><div class="alternatives" id="alts">`;
    q.alternatives.forEach(a => {
      html += `<button class="alt" id="alt-${a.letter}" onclick="choose('${a.letter}')">
        <span class="alt-letter">${a.letter}</span>
        <span>${a.text ? escHtml(a.text) : ''}${a.file ? `<br><img class="alt-img" src="${a.file}">` : ''}</span>
      </button>`;
    });
    html += `</div>
    <div class="feedback" id="feedback">
      <span class="feedback-icon" id="fb-icon"></span>
      <span id="fb-text"></span>
    </div>
    <div class="next-btn" id="next-btn">
      <button class="btn btn-primary" onclick="loadRandom()">Próxima questão →</button>
    </div>`;

    document.getElementById('main').innerHTML = html;
  }

  async function choose(letter) {
    if (answered) return;
    answered = true;

    document.querySelectorAll('.alt').forEach(b => b.disabled = true);
    document.getElementById(`alt-${letter}`).classList.add('selected');

    const r = await fetch(`/api/question/${currentQ.id}/check`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({answer: letter})
    });
    const result = await r.json();

    const fb = document.getElementById('feedback');
    const icon = document.getElementById('fb-icon');
    const text = document.getElementById('fb-text');

    if (result.correct) {
      document.getElementById(`alt-${letter}`).classList.add('correct');
      fb.className = 'feedback correct';
      icon.textContent = '✓';
      text.textContent = 'Correto! Muito bem!';
      session.correct++;
    } else {
      document.getElementById(`alt-${letter}`).classList.add('wrong');
      if (result.correct_answer) {
        document.getElementById(`alt-${result.correct_answer}`)?.classList.add('correct');
      }
      fb.className = 'feedback wrong';
      icon.textContent = '✗';
      text.textContent = `Errou. A resposta correta era a alternativa ${result.correct_answer}.`;
      session.wrong++;
    }
    session.total++;
    updateSession();
    document.getElementById('next-btn').classList.add('visible');
  }

  function updateSession() {
    document.getElementById('s-total').textContent   = session.total;
    document.getElementById('s-correct').textContent = session.correct;
    document.getElementById('s-wrong').textContent   = session.wrong;
    const pct = session.total ? Math.round(session.correct / session.total * 100) : 0;
    document.getElementById('s-pct').textContent = session.total ? pct + '%' : '—';
    document.getElementById('s-bar').style.width = pct + '%';
  }

  function resetSession() {
    session = { total:0, correct:0, wrong:0 };
    updateSession();
  }

  function showLoading() {
    document.getElementById('main').innerHTML = `<div class="state-msg"><div class="spinner"></div><div>Buscando questão...</div></div>`;
  }

  function showError(err) {
    document.getElementById('main').innerHTML = `<div class="state-msg"><div class="icon">⚠️</div><div>${err.detail || 'Erro desconhecido'}</div></div>`;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  fetchMeta();
</script>
</body>
</html>"""

@app.get("/", response_class=HTMLResponse)
def index():
    return HTML

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)