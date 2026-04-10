import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import '../style/Verified.css'

export default function Verified() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => navigate('/'), 4000)
  }, [])

  return (
    <div className="verified-page">
      <div className="verified-card">
        <div className="verified-emoji">✅</div>
        <h1>Email verificado!</h1>
        <p>Sua conta foi ativada com sucesso.</p>
        <p className="sub">Redirecionando para o login...</p>
        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/')}>
          Ir para o Login
        </button>
      </div>
    </div>
  )
}