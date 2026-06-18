import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../style/shared.css'
import '../style/Inbox.css'

export default function Inbox() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [emailFound, setEmailFound] = useState(false)
  const [verificationLink, setVerificationLink] = useState('')

  async function handleSearch() {
    setError('')
    try {
      const res = await api.get(`/auth/get-verification-link?email=${email}`)
      setVerificationLink(res.data.verification_link)
      setEmailFound(true)
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Email não encontrado.'
      setError(msg)
    }
  }

  return (
    <div className="page">
      <div className="card card-wide">
        <div className="logo-wrapper">
          <div className="inbox-emoji">📬</div>
          <h1 className="logo-title">Caixa de Entrada</h1>
          {!emailFound && (
            <p className="logo-subtitle">
              Digite seu email para ver a mensagem
            </p>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {!emailFound ? (
          <>
            <div className="input-wrapper" style={{ marginBottom: '16px' }}>
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
              <input className="input-field" type="email" placeholder="email@dominio.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleSearch}>Buscar Email</button>
          </>
        ) : (
          <div className="inbox-email-card">
            <div className="inbox-email-header">
              <p>De: no-reply@nextenem.com</p>
              <p>NextENEM — Confirmação de Email</p>
            </div>
            <div className="inbox-email-body">
              <div className="emoji">✉️</div>
              <p>Olá! Clique no botão abaixo para confirmar seu email e ativar sua conta no <strong>NextENEM</strong>.</p>
              <button className="btn-confirm" onClick={() => { window.location.href = verificationLink }}>
                ✅ Confirmar Email
              </button>
            </div>
          </div>
        )}

        {/*<p className="inbox-back" onClick={() => navigate('/register')}>← Voltar ao cadastro</p>*/}
      </div>
    </div>
  )
}