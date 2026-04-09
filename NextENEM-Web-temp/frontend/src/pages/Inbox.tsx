import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

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
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif", padding: '24px',
    }}>
      <div style={{
        background: '#111827', borderRadius: '24px', padding: '40px 32px 32px',
        width: '100%', maxWidth: '420px', boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '52px', marginBottom: '8px' }}>📬</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#60a5fa', margin: '0 0 4px' }}>
            Caixa de Entrada
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Digite seu email para ver a mensagem
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!emailFound ? (
          <>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
              <input type="email" placeholder="email@dominio.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', border: 'none', borderRadius: '12px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', background: '#1f2937' }}
              />
            </div>
            <button onClick={handleSearch}
              style={{ width: '100%', padding: '15px', background: '#2563eb', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
            >
              Buscar Email
            </button>
          </>
        ) : (
          <div style={{ border: '1px solid #1f2937', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ background: '#1f2937', padding: '12px 16px', borderBottom: '1px solid #374151' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>De: no-reply@nextenem.com</p>
              <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#d1d5db' }}>
                NextENEM — Confirmação de Email
              </p>
            </div>
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>✉️</div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                Olá! Clique no botão abaixo para confirmar seu email e ativar sua conta no <strong style={{ color: '#60a5fa' }}>NextENEM</strong>.
              </p>
              <button onClick={() => { window.location.href = verificationLink }}
                style={{ background: '#2563eb', color: '#fff', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '12px', padding: '12px 28px', cursor: 'pointer' }}
              >
                ✅ Confirmar Email
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}