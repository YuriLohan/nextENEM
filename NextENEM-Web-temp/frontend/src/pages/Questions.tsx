import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' // Importado useLocation
import api from '../services/api'
import '../style/Questions.css'
import '../style/Shared.css'
import ReactMarkdown from 'react-markdown'

// IMPORTAÇÃO DA IMAGEM DO ELEFANTE
import elefanteIdeia from '../assets/elefante_ideia2-removebg-preview.png'

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
  discipline: string // Adicionado disciplina na interface
}

const TOTAL = 10

export default function Questions() {
  const navigate = useNavigate()
  const location = useLocation() // Para pegar a disciplina do Contents.tsx

  // Pega a disciplina vinda do navigate('/questions', { state: { discipline: '...' } })
  const disciplineFromState = location.state?.discipline || ''

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
      
      // LOGICA CRITICAL: Só restaura se a disciplina for a MESMA.
      // Se eu estava no aleatório e cliquei em "Matemática", ele ignora o cache e carrega novo.
      if (session.discipline === disciplineFromState) {
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
        return // Para aqui, não executa o fetchAllQuestions
      }
    }
    
    // Se não tem cache ou a disciplina é diferente, busca novas
    fetchAllQuestions(disciplineFromState)
  }, [disciplineFromState]) // Recarrega se a disciplina mudar

  useEffect(() => {
    if (questions.length === TOTAL) {
      const session: SavedSession = { 
        questions, 
        answers, 
        currentIndex, 
        finished,
        discipline: disciplineFromState // Salva qual disciplina é essa sessão
      }
      localStorage.setItem('questionsSession', JSON.stringify(session))
    }
  }, [questions, answers, currentIndex, finished, disciplineFromState])

  async function fetchAllQuestions(disc: string) {
    setLoading(true);
    const fetched: Question[] = [];
    
    try {
      // Busca 10 questões (ou faça um loop de 10 chamadas)
      for (let i = 0; i < TOTAL; i++) {
        const res = await api.get('/questions/random', {
          params: disc ? { discipline: disc } : {}
        });
        fetched.push(res.data);
      }
      setQuestions(fetched);
    } catch (err) {
      console.error("Erro ao carregar simulado:", err);
      // Se falhar, você pode decidir se limpa o loading ou mostra erro
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(letter: string) {
    if (answered) return
    setSelected(letter)
    setAnswered(true)
    const newAnswers = [...answers]
    newAnswers[currentIndex] = letter
    setAnswers(newAnswers)

    // Opcional: Enviar resposta para o banco de dados aqui se desejar
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
    fetchAllQuestions(disciplineFromState)
  }

  const question = questions[currentIndex]
  const cleanContext = question?.context
  ? question.context
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\(https?:\/\/\S+\)/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim()
  : '';

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
          <h1>{disciplineFromState ? `Fim de Estudo` : 'Simulado Finalizado'}</h1>
          <div className="score-box">
            <p className="label">Pontuação</p>
            <p className={`score-value ${score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'}`}>{score}</p>
            <p className="sub">de 100 pontos</p>
          </div>
          <p className="result-summary">
            Área: <strong>{disciplineFromState || 'Misturado'}</strong><br/>
            Acertou <strong>{correctCount}</strong> de <strong>{TOTAL}</strong> questões
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
        <h1>NextENEM · {disciplineFromState || 'Geral'}</h1>
        <button className="btn-back" onClick={() => navigate('/home')}>← Voltar</button>
      </header>

      <main className="questions-main">
        {loading ? (
          <div className="loading-wrapper">
            <p>Buscando questões de {disciplineFromState || 'todas as áreas'}...</p>
            <p>Preparando seu material...</p>
          </div>
        ) : questions.length > 0 ? (
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
              {question.files?.map((url, i) => (
                <img key={i} src={url} alt="imagem da questão" />
              ))}

              {cleanContext && (
                <div style={{ marginTop: '16px' }}>
                  <ReactMarkdown>{cleanContext}</ReactMarkdown>
                </div>
              )}

              {question.alternativesIntroduction && (
                <div className="intro">
                  <ReactMarkdown>{question.alternativesIntroduction}</ReactMarkdown>
                </div>
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
              {/* ALTERAÇÃO EXCLUSIVA AQUI: Estrutura interna modificada */}
              <button className="btn-hint" onClick={() => alert("Dica: Foque no comando da questão.")}>
                <img src={elefanteIdeia} alt="Elefante Ideia" className="hint-icon" />
                <span>Dica do elefante</span>
              </button>
              <button className={`btn-next ${answered ? 'active' : 'disabled'}`} onClick={nextQuestion} disabled={!answered}>
                {currentIndex + 1 >= TOTAL ? 'Ver Resultado 🏆' : 'Próxima →'}
              </button>
            </div>
          </>
        ) : (
          <div className="error-wrapper">
            <p>Não encontramos questões para esta área no momento.</p>
            <button onClick={() => navigate('/home')}>Voltar</button>
          </div>
        )}
      </main>
    </div>
  )
}