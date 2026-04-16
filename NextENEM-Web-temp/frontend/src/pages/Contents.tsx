import { useNavigate } from 'react-router-dom'
import '../style/Questions.css'

const DISCIPLINES = [
  { value: 'matematica', label: '📐 Matemática', color: '#3b82f6' },
  { value: 'linguagens', label: '📖 Linguagens', color: '#10b981' },
  { value: 'ciencias-humanas', label: '🌍 Ciências Humanas', color: '#f59e0b' },
  { value: 'ciencias-da-natureza', label: '🔬 Ciências da Natureza', color: '#ef4444' },
]

export default function Contents() {
  const navigate = useNavigate()

  const handleSelect = (disciplineValue: string) => {
    // Mandamos para a rota de questões passando a disciplina no estado da navegação
    navigate('/questions', { state: { discipline: disciplineValue } })
  }

  return (
    <div className="questions-page">
      <header className="questions-header">
        <h1>Conteúdos</h1>
        <button className="btn-back" onClick={() => navigate('/home')}>← Voltar</button>
      </header>
      <main className="questions-main">
        <div className="select-area-wrapper">
          <h2 className="select-area-title">O que vamos estudar?</h2>
          <p className="select-area-sub">Selecione uma área para filtrar as questões</p>
          <div className="select-area-grid">
            {DISCIPLINES.map((d) => (
              <button 
                key={d.value} 
                className="select-area-btn" 
                style={{ borderColor: d.color }} 
                onClick={() => handleSelect(d.value)}
              >
                <span className="select-area-label">{d.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}