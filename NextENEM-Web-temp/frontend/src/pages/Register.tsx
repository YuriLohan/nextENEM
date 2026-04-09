import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [registered, setRegistered] = useState(false)

  async function handleRegister() {
  setError('')
  setSuccess('')
    // ✅ Validação mínima
  if (!name.trim() || !email.trim() || !password.trim()) {
    setError('Todos os campos são obrigatórios')
    return
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    setError('Email inválido')
    return
  }

  try {
    await api.post('/auth/register', { name, email, password })
    setSuccess('Cadastro realizado! Verifique seu email para ativar a conta.')
    setRegistered(true)
    navigate('/inbox')
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Erro ao cadastrar. Tente outro email.'
      setError(msg)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '24px',
    }}>
      <div style={{
        background: '#111827',
        borderRadius: '24px',
        padding: '40px 32px 32px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: '#1d4ed8', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="14" r="7" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M22 11l2 2-2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#60a5fa', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            NextENEM
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            {registered ? 'Verifique seu email' : 'Crie sua conta gratuitamente'}
          </p>
        </div>

        {/* Erro — só quando não registrado */}
        {error && !registered && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Após cadastro */}
        {registered ? (
          <>
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              {success}
            </div>
            <button
              onClick={() => window.open('http://localhost:5173/inbox', '_blank')}
              style={{ width: '100%', padding: '15px', background: '#16a34a', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer', marginBottom: '16px' }}
            >
              📥 Ir para Caixa de Entrada
            </button>
          </>
        ) : (
          <>
            {/* Nome */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <input type="text" placeholder="Nome completo" value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', border: 'none', borderRadius: '12px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', background: '#1f2937' }}
              />
            </div>

            {/* Email */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
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

            {/* Senha */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', border: 'none', borderRadius: '12px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', background: '#1f2937' }}
              />
            </div>

            <button onClick={handleRegister}
              style={{ width: '100%', padding: '15px', background: '#2563eb', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer', marginBottom: '20px', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
            >
              Cadastrar
            </button>
          </>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', margin: 0 }}>
          Já tem conta?{' '}
          <Link to="/" style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}