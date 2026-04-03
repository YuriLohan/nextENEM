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
      background: '#fff',
      borderColor: '#e2e8f0',
      color: '#1e293b',
    }
 
    if (!answered) return base
 
    if (letter === question?.correctAlternative) {
      return { ...base, background: '#dcfce7', borderColor: '#22c55e', color: '#15803d' }
    }
    if (letter === selected) {
      return { ...base, background: '#fee2e2', borderColor: '#ef4444', color: '#b91c1c' }
    }
    return { ...base, opacity: 0.5 }
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
      background: '#e2e8f0',
      color: '#475569',
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
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
      }}>
        <h1 style={{ color: '#fff', fontWeight: '800', fontSize: '20px', margin: 0, letterSpacing: '-0.5px' }}>
          NextENEM
        </h1>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#fff',
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
          <p style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>Carregando questão...</p>
        )}
 
        {!loading && !question && (
          <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '40px' }}>Erro ao carregar questão. Tente novamente.</p>
        )}
 
        {!loading && question && (
          <>
            {/* Discipline badge */}
            <div style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
              borderRadius: '16px',
              padding: '12px 20px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {question.discipline}
                </p>
                <p style={{ color: '#fff', fontSize: '13px', margin: 0, fontWeight: '600' }}>
                  ENEM {question.year} · Questão {question.index}
                </p>
              </div>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                #{question.index}
              </span>
            </div>
 
            {/* Question card */}
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <p style={{ color: '#1e293b', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>
                {question.context}
              </p>
 
              {question.files?.map((url, i) => (
                <img key={i} src={url} alt="imagem da questão" style={{ marginTop: '16px', borderRadius: '12px', maxWidth: '100%' }} />
              ))}
 
              {question.alternativesIntroduction && (
                <p style={{ color: '#475569', marginTop: '16px', fontSize: '14px', marginBottom: 0 }}>
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
                background: selected === question.correctAlternative ? '#dcfce7' : '#fee2e2',
                color: selected === question.correctAlternative ? '#15803d' : '#b91c1c',
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
                  background: '#fff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '14px',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                💡 Dica
              </button>
              <button
                onClick={fetchQuestion}
                style={{
                  flex: 2,
                  padding: '15px',
                  background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(14,165,233,0.4)',
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