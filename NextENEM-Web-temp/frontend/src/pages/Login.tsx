import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
 
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
 
  async function handleLogin() {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('name', res.data.name)
      navigate('/home')
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Email ou senha inválidos'
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
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#1d4ed8',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}> {/*TODO: remover o svg e trocar pela imagem da nossa logo*/}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="14" r="7" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#60a5fa',
            margin: '0 0 4px',
            letterSpacing: '-0.5px',
          }}>NextENEM</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Entre na sua conta para continuar aprendendo
          </p>
        </div>
 
        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
 
        {/* Email */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>
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
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#1f2937',
            }}
          />
        </div>
 
        {/* Password */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>
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
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#1f2937',
            }}
          />
        </div>
 
        {/* Login button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '15px',
            background: '#2563eb',
            color: '#fff',
            fontWeight: '700',
            fontSize: '15px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '14px',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
          onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
        >
          Entrar
        </button>
 
        {/* Google */}
        <button
          style={{
            width: '100%',
            padding: '14px',
            background: '#1f2937',
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            marginBottom: '20px',
            color: '#d1d5db',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09A6.5 6.5 0 0 1 5.5 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com o Google
        </button>
 
        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', margin: '0 0 8px' }}>
          Esqueceu sua senha?
        </p>
 
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', margin: 0 }}>
          Não tem conta?{' '}
          <Link to="/register" style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'none' }}>
            Criar agora
          </Link>
        </p>
 
      </div>
    </div>
  )
}