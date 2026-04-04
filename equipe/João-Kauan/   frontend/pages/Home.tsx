import { useNavigate } from 'react-router-dom'
 
export default function Home() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'Estudante'
 
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/')
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
          onClick={handleLogout}
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
          Sair
        </button>
      </header>
 
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          Olá, {name}! 👋
        </h2>
        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
          O que vamos estudar hoje?
        </p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate('/questions')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
              border: 'none',
              borderRadius: '16px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(14,165,233,0.4)',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            📝 Praticar Questões
          </button>
 
          <button
            disabled
            style={{
              padding: '20px',
              background: '#fff',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              color: '#94a3b8',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'not-allowed',
            }}
          >
            📚 Conteúdos (em breve)
          </button>
 
          <button
            disabled
            style={{
              padding: '20px',
              background: '#fff',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              color: '#94a3b8',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'not-allowed',
            }}
          >
            📊 Desempenho (em breve)
          </button>
        </div>
      </main>
    </div>
  )
}
