import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import '../style/Home.css'

export default function Home() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'Estudante'
  const initials = name.slice(0, 2).toUpperCase()
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/')
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const frases = [
      { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
      { text: 'A educação é a arma mais poderosa que você pode usar para mudar o mundo.', author: 'Nelson Mandela' },
      { text: 'O único lugar onde o sucesso vem antes do trabalho é no dicionário.', author: 'Vidal Sassoon' },
      { text: 'Investir em conhecimento sempre paga os melhores juros.', author: 'Benjamin Franklin' },
      { text: 'Não importa o quão devagar você vá, desde que não pare.', author: 'Confúcio' },
      { text: 'A persistência é o caminho do êxito.', author: 'Charlie Chaplin' },
      { text: 'Você nunca sabe que resultados virão da sua ação. Mas se você não fizer nada, não existirão resultados.', author: 'Mahatma Gandhi' },
    ]
    setQuote(frases[Math.floor(Math.random() * frases.length)])
  }, [])

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-logo">
          <div className="home-header-logo-circle">NE</div>
          <span className="home-header-logo-name">NextENEM</span>
        </div>

        <div className="home-avatar-wrapper" ref={menuRef}>
          <button className="home-avatar-btn" onClick={() => setMenuOpen(prev => !prev)}>
            {initials}
          </button>

          {menuOpen && (
            <div className="home-dropdown">
              <div className="home-dropdown-header">
                <p className="home-dropdown-name">{name}</p>
              </div>
              <button className="home-dropdown-item" onClick={() => { setMenuOpen(false); navigate('/area-select') }}>
                🎯 Mudar área de estudo
              </button>
              <button className="home-dropdown-item danger" onClick={handleLogout}>
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="home-main">
        <h2 className="home-greeting">Olá, {name}! 👋</h2>

        <div className="home-quote-card">
          <p className="home-quote-label">💬 Frase do dia</p>
          {quote ? (
            <>
              <p className="home-quote-text">"{quote.text}"</p>
              <p className="home-quote-author">— {quote.author}</p>
            </>
          ) : (
            <p className="home-quote-author">Carregando frase...</p>
          )}
        </div>

        <div className="home-practice-card" onClick={() => navigate('/questions')}>
          <p className="home-practice-label">Continuar estudando...</p>
          <p className="home-practice-title">📝 Praticar Questões</p>
          <p className="home-practice-sub">Questões do ENEM de todos os anos</p>
        </div>

        <div className="home-grid">
          <div className="home-soon-card home-soon-card--active" onClick={() => navigate('/conteudos')}>
            <p className="home-soon-emoji">📚</p>
            <p className="home-soon-title">Conteúdos</p>
            <p className="home-soon-label">Estudar por área</p>
          </div>
          <div className="home-soon-card home-soon-card--active" onClick={() => navigate('/performance')}>
            <p className="home-soon-emoji">📊</p>
            <p className="home-soon-title">Desempenho</p>
            <p className="home-soon-label">Ver meu progresso →</p>
          </div>
          <div className="home-soon-card home-soon-card--active" onClick={() => navigate('/universidades')}>
            <p className="home-soon-emoji">🎓</p>
            <p className="home-soon-title">Universidades</p>
            <p className="home-soon-label">Encontre faculdades na sua cidade</p>
          </div>
        </div>
      </main>
    </div>
  )
}