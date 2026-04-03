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
 
  async function handleRegister() {
    setError('')
    setSuccess('')
    try {
      await api.post('/auth/register', { name, email, password })
      setSuccess('Cadastro realizado! Verifique seu email para ativar a conta.')
      setTimeout(() => navigate('/'), 3000)
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Erro ao cadastrar. Tente outro email.'
      setError(msg)
    }
  }
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0ea5e9 0%, #0284c7 40%, #0369a1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '32px',
        padding: '40px 32px 32px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="14" r="7" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M22 11l2 2-2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#0369a1',
            margin: '0 0 4px',
            letterSpacing: '-0.5px',
          }}>Next Enem</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Crie sua conta gratuitamente
          </p>
        </div>
 
        {/* Error */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
 
        {/* Success */}
        {success && (
          <div style={{
            background: '#dcfce7',
            color: '#15803d',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            {success}
          </div>
        )}
 
        {/* Name field */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: '#94a3b8',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 44px',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              fontSize: '14px',
              color: '#1e293b',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#f8fafc',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#0ea5e9'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
 
        {/* Email field */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: '#94a3b8',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
          </span>
          <input
            type="email"
            placeholder="email@dominio.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 44px',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              fontSize: '14px',
              color: '#1e293b',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#f8fafc',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#0ea5e9'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
 
        {/* Password field */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: '#94a3b8',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 44px',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              fontSize: '14px',
              color: '#1e293b',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#f8fafc',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#0ea5e9'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
 
        {/* Register button */}
        <button
          onClick={handleRegister}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '15px',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            marginBottom: '20px',
            boxShadow: '0 6px 20px rgba(14,165,233,0.4)',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          Cadastrar
        </button>
 
        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', margin: 0 }}>
          Já tem conta?{' '}
          <Link to="/" style={{ color: '#0ea5e9', fontWeight: '600', textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
