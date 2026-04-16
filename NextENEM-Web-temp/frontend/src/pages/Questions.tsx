import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import '../style/Questions.css'

interface Alternative { letter: string; text: string }
interface Question {
  index: number; year: number; discipline: string; context: string;
  files: string[]; alternativesIntroduction: string; 
  alternatives: Alternative[]; correctAlternative: string;
}

const TOTAL = 10

export default function Questions() {
  const navigate = useNavigate()
  const location = useLocation()

  // Verifica se o usuário veio do "Conteúdos" selecionando uma área específica
  const selectedDiscipline = location.state?.discipline || ''

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<(string | null)[]>(Array(TOTAL).fill(null))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)

  // Carregamento inicial
  useEffect(() => {
    const saved = localStorage.getItem('questionsSession')
    
    if (saved) {
      const session = JSON.parse(saved)
      // Só restaura a sessão se a disciplina salva for a mesma da rota atual
      if (session.discipline === selectedDiscipline) {
        setQuestions(session.questions)
        setAnswers(session.answers)
        setCurrentIndex(session.currentIndex)
        setFinished(session.finished)
        const prevAnswer = session.answers[session.currentIndex]
        if (prevAnswer) { setSelected(prevAnswer); setAnswered(true); }
        setLoading(false)
        return
      }
    }
    
    // Se não houver sessão ou for uma área diferente, busca novas questões
    fetchQuestions(selectedDiscipline)
  }, [selectedDiscipline])

  // Salva progresso no LocalStorage
  useEffect(() => {
    if (questions.length === TOTAL) {
      const session = { 
        questions, 
        answers, 
        currentIndex, 
        finished, 
        discipline: selectedDiscipline 
      }
      localStorage.setItem('questionsSession', JSON.stringify(session))
    }
  }, [questions, answers, currentIndex, finished, selectedDiscipline])

  async function fetchQuestions(discipline: string) {
    setLoading(true)
    const fetched: Question[] = []
    // Define a URL baseada na disciplina (se vazia, o backend manda aleatório)
    const url = discipline ? `/questions/random?discipline=${discipline}` : '/questions/random'
    
    while (fetched.length < TOTAL) {
      try {
        const res = await api.get(url)
        fetched.push(res.data)
      } catch { break }
    }
    setQuestions(fetched)
    setLoading(false)
  }

  async function handleAnswer(letter: string) {
    if (answered) return
    const question = questions[currentIndex]
    setSelected(letter)
    setAnswered(true)

    const newAnswers = [...answers]
    newAnswers[currentIndex] = letter
    setAnswers(newAnswers)

    try {
      await api.post('/questions/answer', {
        question_index: question.index,
        year: question.year,
        discipline: question.discipline,
        selected: letter,
        correct: question.correctAlternative,
        is_correct: letter === question.correctAlternative,
      })
    } catch {}
  }

  function nextQuestion() {
    if (!answered) return
    if (currentIndex + 1 >= TOTAL) {
      setFinished(true)
    } else {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      const prevAnswer = answers[nextIdx]
      setSelected(prevAnswer || null)
      setAnswered(!!prevAnswer)
    }
  }

  function restartQuiz() {
    localStorage.removeItem('questionsSession')
    setAnswers(Array(TOTAL).fill(null))
    setCurrentIndex(0)
    setSelected(null)
    setAnswered(false)
    setFinished(false)
    fetchQuestions(selectedDiscipline)
  }

  const question = questions[currentIndex]
  const correctCount = answers.filter((a, i) => a === questions[i]?.correctAlternative).length
  const score = Math.round((correctCount / TOTAL) * 100)

  const getAltClass = (l: string) => !answered ? 'alt-btn' : l === question?.correctAlternative ? 'alt-btn correct' : l === selected ? 'alt-btn wrong' : 'alt-btn faded'
  const getLetterClass = (l: string) => !answered ? 'letter-circle' : l === question?.correctAlternative ? 'letter-circle correct' : l === selected ? 'letter-circle wrong' : 'letter-circle'

  if (finished) {
    return (
      <div className="result-page">
        <div className="result-card">
          <div className="trophy">{score >= 70 ? '🏆' : score >= 40 ? '📚' : '💪'}</div>
          <h1>{selectedDiscipline ? `Fim de: ${question?.discipline}` : 'Simulado Finalizado'}</h1>
          <div className="score-box">
            <p className="label">Pontuação</p>
            <p className={`score-value ${score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'}`}>{score}</p>
          </div>
          <div className="questions-summary">
            {questions.map((q, i) => (
              <div key={i} className={`summary-dot ${answers[i] === q.correctAlternative ? 'correct' : 'wrong'}`}>{i + 1}</div>
            ))}
          </div>
          <div className="result-buttons">
            <button className="btn-restart" onClick={restartQuiz}>🔄 Refazer</button>
            <button className="btn-home" onClick={() => navigate('/home')}>🏠 Início</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="questions-page">
      <header className="questions-header">
        <h1>NextENEM · {selectedDiscipline ? 'Estudo focado' : 'Praticar'}</h1>
        <button className="btn-back" onClick={() => navigate('/home')}>← Sair</button>
      </header>

      <main className="questions-main">
        {loading ? (
          <div className="loading-wrapper">
            <p>Buscando questões de {selectedDiscipline || 'todas as áreas'}...</p>
          </div>
        ) : (
          <>
            <div className="progress-wrapper">
              <div className="progress-labels">
                <span>Questão {currentIndex + 1} de {TOTAL}</span>
                <span>{Math.round((currentIndex / TOTAL) * 100)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${(currentIndex / TOTAL) * 100}%` }} />
              </div>
            </div>

            <div className="question-badge">
              <div>
                <p className="discipline">{question.discipline}</p>
                <p className="year-index">ENEM {question.year} · Questão {question.index}</p>
              </div>
            </div>

            <div className="question-card">
              <p>{question.context}</p>
              {question.files?.map((url, i) => <img key={i} src={url} alt="imagem" />)}
              {question.alternativesIntroduction && <p className="intro">{question.alternativesIntroduction}</p>}
            </div>

            <div className="alternatives-list">
              {question.alternatives.map((alt) => (
                <button key={alt.letter} className={getAltClass(alt.letter)} onClick={() => handleAnswer(alt.letter)} disabled={answered}>
                  <span className={getLetterClass(alt.letter)}>{alt.letter}</span>
                  <span style={{ paddingTop: '4px' }}>{alt.text}</span>
                </button>
              ))}
            </div>

            {answered && (
              <div className={`feedback ${selected === question.correctAlternative ? 'correct' : 'wrong'}`}>
                {selected === question.correctAlternative ? '✅ Excelente!' : `❌ A correta é a letra ${question.correctAlternative}`}
              </div>
            )}

            <div className="bottom-buttons">
              <button className="btn-hint" onClick={() => alert("Dica: Foque nas palavras-chave do enunciado.")}>💡 Dica</button>
              <button className={`btn-next ${answered ? 'active' : 'disabled'}`} onClick={nextQuestion} disabled={!answered}>
                {currentIndex + 1 >= TOTAL ? 'Ver Resultado 🏆' : 'Próxima →'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}