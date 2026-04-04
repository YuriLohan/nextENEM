import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
 
export default function Home() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'Estudante'
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)
 
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/')
  }
 
  useEffect(() => {
    async function fetchQuote() {
      try {
        const frases = [
          { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
          { text: 'A educação é a arma mais poderosa que você pode usar para mudar o mundo.', author: 'Nelson Mandela' },
          { text: 'O único lugar onde o sucesso vem antes do trabalho é no dicionário.', author: 'Vidal Sassoon' },
          { text: 'Investir em conhecimento sempre paga os melhores juros.', author: 'Benjamin Franklin' },
          { text: 'Não importa o quão devagar você vá, desde que não pare.', author: 'Confúcio' },
          { text: 'A persistência é o caminho do êxito.', author: 'Charlie Chaplin' },
          { text: 'Você nunca sabe que resultados virão da sua ação. Mas se você não fizer nada, não existirão resultados.', author: 'Mahatma Gandhi' },
        ]
        const aleatoria = frases[Math.floor(Math.random() * frases.length)]
        setQuote(aleatoria)
      } catch {
        setQuote({ text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' })
      }
    }
    fetchQuote()
  }, [])
 
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#1d4ed8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>NE</span>
          </div>
          <span style={{ color: '#60a5fa', fontWeight: '800', fontSize: '18px' }}>NextENEM</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#1f2937',
            border: 'none', color: '#9ca3af',
            padding: '6px 14px', borderRadius: '20px',
            fontSize: '13px', cursor: 'pointer', fontWeight: '600',
          }}
        >
          Sair
        </button>
      </header>
 
      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '24px 16px 40px' }}>
        {/* Greeting */}
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f9fafb', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
          Olá, {name}! 👋
        </h2>
 
        {/* Frase do dia */}
        <div style={{
          background: '#111827',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          borderLeft: '4px solid #2563eb',
        }}>
          <p style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            💬 Frase do dia
          </p>
          {quote ? (
            <>
              <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6', margin: '0 0 8px', fontStyle: 'italic' }}>
                "{quote.text}"
              </p>
              <p style={{ color: '#4b5563', fontSize: '12px', margin: 0, fontWeight: '600' }}>
                — {quote.author}
              </p>
            </>
          ) : (
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Carregando frase...</p>
          )}
        </div>
 
        {/* Continuar estudando */}
        <div style={{
          background: '#1d4ed8',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '16px',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(29,78,216,0.4)',
        }}
          onClick={() => navigate('/questions')}
        >
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '600', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Continuar estudando...
          </p>
          <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: '0 0 4px' }}>
            📝 Praticar Questões
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
            Questões do ENEM de todos os anos
          </p>
        </div>
 
        {/* Em breve cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{
            background: '#111827',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            opacity: 0.7,
          }}>
            <p style={{ fontSize: '22px', margin: '0 0 6px' }}>📚</p>
            <p style={{ color: '#f9fafb', fontWeight: '700', fontSize: '14px', margin: '0 0 4px' }}>Conteúdos</p>
            <p style={{ color: '#4b5563', fontSize: '12px', margin: 0 }}>Em breve</p>
          </div>
 
          <div style={{
            background: '#111827',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            opacity: 0.7,
          }}>
            <p style={{ fontSize: '22px', margin: '0 0 6px' }}>📊</p>
            <p style={{ color: '#f9fafb', fontWeight: '700', fontSize: '14px', margin: '0 0 4px' }}>Desempenho</p>
            <p style={{ color: '#4b5563', fontSize: '12px', margin: 0 }}>Em breve</p>
          </div>
        </div>
      </main>
    </div>
  )
}
 