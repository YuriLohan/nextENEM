import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import '../style/Verified.css'

export default function Verified() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 4000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="verified-page">
      <div className="verified-card">
        <div className="verified-emoji">✅</div>
        <h1>Email verificado!</h1>
        <p>Sua conta foi ativada com sucesso.</p>
        <p className="sub">Redirecionando para o login...</p>
      </div>
    </div>
  )
}