import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/AreaSelect.css'
import api from '../services/api'

const areas = [
  { id: 'medicina', label: 'Medicina', emoji: '🩺' },
  { id: 'direito', label: 'Direito', emoji: '⚖️' },
  { id: 'computacao', label: 'Computação', emoji: '💻' },
  { id: 'outros', label: 'Outros', emoji: '📚' },
]

export default function AreaSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  function handleCardClick(id: string) {
    if (id === 'outros') {
      navigate('/area-outros')
    } else {
      setSelected(id)
    }
  }

  async function handleConfirm() {
    if (!selected) return
    try {
      await api.post('/auth/study-area', { study_area: selected })
      navigate('/home')
    } catch {
      navigate('/home')
    }
  }

  return (
    <div className="area-page">
      <div className="area-header">
        <div className="area-logo">
          <span className="area-logo-ne">NE</span>
          <span className="area-logo-text">NextENEM</span>
        </div>
        <p className="area-header-sub">Estamos quase lá</p>
        <div className="area-progress">
          <div className="area-progress-fill" />
        </div>
      </div>

      <h2 className="area-title">Selecione seu foco de estudo</h2>

      <div className="area-grid">
        {areas.map(area => (
          <button
            key={area.id}
            className={`area-card ${selected === area.id ? 'selected' : ''}`}
            onClick={() => handleCardClick(area.id)}
          >
            <span className="area-emoji">{area.emoji}</span>
            <span className="area-label">{area.label}</span>
          </button>
        ))}
      </div>

      <button
        className={`area-confirm ${selected ? 'active' : 'disabled'}`}
        onClick={handleConfirm}
        disabled={!selected}
      >
        Confirmar
      </button>
    </div>
  )
}