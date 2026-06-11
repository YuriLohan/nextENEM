import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import '../style/Home.css'

import NE from '../assets/NE.png'

import checklistIcon from '../assets/checklist.png'
import dashboardIcon from '../assets/dashboard.png'
import educationIcon from '../assets/education.png'
import graduationHatIcon from '../assets/graduation-hat.png'
import { getCursoLabel } from './Universities'

export default function Home() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'Estudante'
  const studyArea = localStorage.getItem('studyArea') || ''   
  const initials = name.slice(0, 2).toUpperCase()
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  function handleLogout() {
    // Remove apenas as credenciais da sessão atual
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('studyArea')
    localStorage.removeItem('email') // Limpa o e-mail para desvincular a chave do simulado

    // Manda de volta para a tela de login zerado
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
          <img src={NE} alt="NextENEM Logo" className="home-header-logo-img" />
          <span className="home-header-logo-name">NextENEM</span>
        </div>

        <div className="home-avatar-wrapper" ref={menuRef}>
          <button className="home-avatar-btn" onClick={() => setMenuOpen(prev => !prev)}>
            {initials}
          </button>

          {menuOpen && (
            <div className="home-dropdown">
              <div className="home-dropdown-header">
                <div className="home-dropdown-name">
                  <span>{name}</span>
                  <span>{getCursoLabel(studyArea)}</span>
                   
                </div>
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

        {/* Card de Praticar Questões atualizado com o ícone checklist */}
        <div className="home-practice-card" onClick={() => navigate('/questions')}>
          <div className="home-practice-content">
            <div className="home-practice-text">
              <p className="home-practice-label">Continuar estudando...</p>
              <p className="home-practice-title">Simulado Geral ENEM</p>
              <p className="home-practice-sub">Questões do ENEM de todos os anos</p>
            </div>
            <img src={checklistIcon} alt="Icone Checklist" className="home-practice-icon-img" />
          </div>
        </div>

        {/* Grid de Cards secundários atualizados substituindo os emojis por tags img */}
        <div className="home-grid">
          <div className="home-soon-card home-soon-card--active" onClick={() => navigate('/conteudos')}>
            <img src={educationIcon} alt="Icone Conteúdos" className="home-soon-icon-img" />
            <p className="home-soon-title">Simulados Específicos</p>
            <p className="home-soon-label">Estudar por área</p>
          </div>
          
          <div className="home-soon-card home-soon-card--active" onClick={() => navigate('/performance')}>
            <img src={dashboardIcon} alt="Icone Desempenho" className="home-soon-icon-img" />
            <p className="home-soon-title">Desempenho</p>
            <p className="home-soon-label">Ver meu progresso →</p>
          </div>
          
          <div className="home-soon-card home-soon-card--active" onClick={() => navigate('/universidades')}>
            <img src={graduationHatIcon} alt="Icone Universidades" className="home-soon-icon-img" />
            <p className="home-soon-title">Universidades</p>
            <p className="home-soon-label">Encontre faculdades na sua cidade</p>
          </div>
        </div>
      </main>
    </div>
  )
}