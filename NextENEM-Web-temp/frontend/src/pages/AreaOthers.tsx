import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/AreaSelect.css'
import api from '../services/api'

export default function AreaOthers() {
  const navigate = useNavigate()
  const [customArea, setCustomArea] = useState('')
  const [error, setError] = useState('')

  async function handleConfirm() {
    const trimmed = customArea.trim()
    if (!trimmed) {
      setError('Digite sua área de estudo')
      return
    }
    try {
      await api.post('/auth/study-area', { study_area: trimmed })
      localStorage.setItem('studyArea', trimmed)
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

      <h2 className="area-title">Qual é a sua área de estudo?</h2>

      <div className="area-custom-wrapper">
        <p className="area-custom-title">Digite sua área</p>
        <input
          className="area-custom-input"
          type="text"
          placeholder="Ex: Engenharia, Psicologia, Administração..."
          value={customArea}
          onChange={e => { setCustomArea(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        {error && <p className="area-custom-error">{error}</p>}
      </div>

      <button
        className={`area-confirm ${customArea.trim() ? 'active' : 'disabled'}`}
        onClick={handleConfirm}
        disabled={!customArea.trim()}
      >
        Confirmar
      </button>

      <p className="area-back" onClick={() => navigate('/area-select')}>
        ← Voltar
      </p>
    </div>
  )
}