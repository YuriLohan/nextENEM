import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../style/Questions.css'

interface Alternative {
  letter: string
  text: string
}

interface Question {
  index: number
  year: number
  discipline: string
  context: string
  files: string[]
  alternativesIntroduction: string
  alternatives: Alternative[]
  correctAlternative: string
}

interface SavedSession {
  questions: Question[]
  answers: (string | null)[]
  currentIndex: number
  finished: boolean
}

const TOTAL = 10

export default function Questions() {
  const navigate = useNavigate()

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<(string | null)[]>(Array(TOTAL).fill(null))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('questionsSession')
    if (saved) {
      const session: SavedSession = JSON.parse(saved)
      setQuestions(session.questions)
      setAnswers(session.answers)
      setCurrentIndex(session.currentIndex)
      setFinished(session.finished)
      const prevAnswer = session.answers[session.currentIndex]
      if (prevAnswer) {
        setSelected(prevAnswer)
        setAnswered(true)
      }
      setLoading(false)
    } else {
      fetchAllQuestions()
    }
  }, [])

  useEffect(() => {
    if (questions.length === TOTAL) {
      const session: SavedSession = { questions, answers, currentIndex, finished }
      localStorage.setItem('questionsSession', JSON.stringify(session))
    }
  }, [questions, answers, currentIndex, finished])

  async function fetchAllQuestions() {
    setLoading(true)
    const fetched: Question[] = []
    while (fetched.length < TOTAL) {
      try {
        const res = await api.get('/questions/random')
        fetched.push(res.data)
      } catch {}
    }
    setQuestions(fetched)
    setLoading(false)
  }

  function handleAnswer(letter: string) {
    if (answered) return
    setSelected(letter)
    setAnswered(true)
    const newAnswers = [...answers]
    newAnswers[currentIndex] = letter
    setAnswers(newAnswers)
  }

  function nextQuestion() {
    if (!answered) return
    if (currentIndex + 1 >= TOTAL) {
      setFinished(true)
    } else {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      const prevAnswer = answers[nextIdx]
      setSelected(prevAnswer)
      setAnswered(!!prevAnswer)
    }
  }

  function restartQuiz() {
    localStorage.removeItem('questionsSession')
    setQuestions([])
    setAnswers(Array(TOTAL).fill(null))
    setCurrentIndex(0)
    setSelected(null)
    setAnswered(false)
    setFinished(false)
    fetchAllQuestions()
  }

  const question = questions[currentIndex]
  const correctCount = answers.filter((a, i) => a === questions[i]?.correctAlternative).length
  const score = Math.round((correctCount / TOTAL) * 100)

  function getAltClass(letter: string) {
    if (!answered) return 'alt-btn'
    if (letter === question?.correctAlternative) return 'alt-btn correct'
    if (letter === selected) return 'alt-btn wrong'
    return 'alt-btn faded'
  }

  function getLetterClass(letter: string) {
    if (!answered) return 'letter-circle'
    if (letter === question?.correctAlternative) return 'letter-circle correct'
    if (letter === selected) return 'letter-circle wrong'
    return 'letter-circle'
  }

  if (finished) {
    return (
      <div className="result-page">
        <div className="result-card">
          <div className="trophy">{score >= 70 ? '🏆' : score >= 40 ? '📚' : '💪'}</div>
          <h1>Resultado Final</h1>
          <div className="score-box">
            <p className="label">Pontuação</p>
            <p className={`score-value ${score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'}`}>{score}</p>
            <p className="sub">de 100 pontos</p>
          </div>
          <p className="result-summary">
            Você acertou <strong>{correctCount}</strong> de <strong>{TOTAL}</strong> questões
          </p>
          <div className="questions-summary">
            {questions.map((q, i) => (
              <div key={i} className={`summary-dot ${answers[i] === q.correctAlternative ? 'correct' : 'wrong'}`}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="result-buttons">
            <button className="btn-restart" onClick={restartQuiz}>🔄 Novo Quiz</button>
            <button className="btn-home" onClick={() => navigate('/home')}>🏠 Início</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="questions-page">
      <header className="questions-header">
        <h1>NextENEM</h1>
        <button className="btn-back" onClick={() => navigate('/home')}>← Voltar</button>
      </header>

      <main className="questions-main">
        {loading && (
          <div className="loading-wrapper">
            <p>Carregando questões...</p>
            <p>Isso pode levar alguns segundos</p>
          </div>
        )}

        {!loading && question && (
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
              {question.files?.map((url, i) => (
                <img key={i} src={url} alt="imagem da questão" />
              ))}
              {question.alternativesIntroduction && (
                <p className="intro">{question.alternativesIntroduction}</p>
              )}
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
                {selected === question.correctAlternative ? '✅ Resposta correta!' : `❌ Errou! A correta era ${question.correctAlternative}`}
              </div>
            )}

            <div className="bottom-buttons">
              <button className="btn-hint">💡 Dica</button>
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