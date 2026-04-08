import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
 
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
 
export default function Questions() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState(() => {
  return Number(localStorage.getItem('questionId')) || 1
  })
 
async function fetchQuestion() {
  setLoading(true)
  setSelected(null)
  setAnswered(false)

  try {
    const res = await api.get('/questions/random')
    setQuestion(res.data)
  } catch {
    setQuestion(null)
  }

  setLoading(false)
}

function nextQuestion() {
  setId(prev => {
    const newId = prev + 1
    localStorage.setItem('questionId', String(newId))
    return newId
  })
  fetchQuestion()
}
  useEffect(() => {
    fetchQuestion()
  }, [])
 
  function handleAnswer(letter: string) {
    if (answered) return
    setSelected(letter)
    setAnswered(true)
  }
 
  function getAltStyle(letter: string) {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '2px solid',
      fontSize: '14px',
      textAlign: 'left',
      cursor: answered ? 'default' : 'pointer',
      transition: 'all 0.2s',
      background: '#1f2937',
      borderColor: '#374151',
      color: '#d1d5db',
    }
 
    if (!answered) return base
 
    if (letter === question?.correctAlternative) {
      return { ...base, background: 'rgba(34,197,94,0.15)', borderColor: '#22c55e', color: '#4ade80' }
    }
    if (letter === selected) {
      return { ...base, background: 'rgba(239,68,68,0.15)', borderColor: '#ef4444', color: '#f87171' }
    }
    return { ...base, opacity: 0.4 }
  }
 
  function getLetterStyle(letter: string) {
    const base: React.CSSProperties = {
      minWidth: '28px',
      height: '28px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '13px',
      background: '#374151',
      color: '#9ca3af',
    }
 
    if (!answered) return base
 
    if (letter === question?.correctAlternative) {
      return { ...base, background: '#22c55e', color: '#fff' }
    }
    if (letter === selected) {
      return { ...base, background: '#ef4444', color: '#fff' }
    }
    return base
  }
  
  return (
    <div style={{ minHeight: '100vh', background: '#030712', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: '#111827',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}>
        <h1 style={{ color: '#60a5fa', fontWeight: '800', fontSize: '20px', margin: 0, letterSpacing: '-0.5px' }}>
          NextENEM
        </h1>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: '#1f2937',
            border: 'none',
            color: '#9ca3af',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Voltar
        </button>
      </header>
 
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px 100px' }}>
        {loading && (
          <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '40px' }}>Carregando questão...</p>
        )}
 
        {!loading && !question && (
          <p style={{ color: '#f87171', textAlign: 'center', marginTop: '40px' }}>Erro ao carregar questão. Tente novamente.</p>
        )}
 
        {!loading && question && (
          <>
            {/* Discipline badge */}
            <div style={{
              background: '#111827',
              borderRadius: '16px',
              padding: '12px 20px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: '4px solid #2563eb',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {question.discipline}
                </p>
                <p style={{ color: '#d1d5db', fontSize: '13px', margin: 0, fontWeight: '600' }}>
                  ENEM {question.year} · Questão {question.index}
                </p>
              </div>
              <span style={{
                background: '#1f2937',
                color: '#60a5fa',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                #{id}
              </span>
            </div>
 
            {/* Question card */}
            <div style={{
              background: '#111827',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}>
              <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>
                {question.context}
              </p>
 
              {question.files?.map((url, i) => (
                <img key={i} src={url} alt="imagem da questão" style={{ marginTop: '16px', borderRadius: '12px', maxWidth: '100%' }} />
              ))}
 
              {question.alternativesIntroduction && (
                <p style={{ color: '#9ca3af', marginTop: '16px', fontSize: '14px', marginBottom: 0 }}>
                  {question.alternativesIntroduction}
                </p>
              )}
            </div>
 
            {/* Alternatives */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {question.alternatives.map((alt) => (
                <button
                  key={alt.letter}
                  onClick={() => handleAnswer(alt.letter)}
                  style={getAltStyle(alt.letter)}
                >
                  <span style={getLetterStyle(alt.letter)}>{alt.letter}</span>
                  <span style={{ paddingTop: '4px' }}>{alt.text}</span>
                </button>
              ))}
            </div>
 
            {/* Feedback */}
            {answered && (
              <div style={{
                background: selected === question.correctAlternative
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(239,68,68,0.1)',
                color: selected === question.correctAlternative ? '#4ade80' : '#f87171',
                border: `1px solid ${selected === question.correctAlternative ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '15px',
                marginBottom: '16px',
              }}>
                {selected === question.correctAlternative
                  ? '✅ Resposta correta!'
                  : `❌ Errou! A correta era ${question.correctAlternative}`}
              </div>
            )}
 
            {/* Bottom buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '15px',
                  background: '#111827',
                  border: '2px solid #1f2937',
                  borderRadius: '14px',
                  color: '#6b7280',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                💡 Dica
              </button>
              <button
                onClick={nextQuestion}
                style={{
                  flex: 2,
                  padding: '15px',
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
                }}
              >
                Próxima →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
 
