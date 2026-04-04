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
  const [verificationLink, setVerificationLink] = useState('') // ✅ novo estado

  async function handleRegister() {
    setError('')
    setSuccess('')
    setVerificationLink('')
    try {
      const res = await api.post('/auth/register', { name, email, password })
      setSuccess(res.data.message)
      setVerificationLink(res.data.verification_link) // ✅ captura o link
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Erro ao cadastrar. Tente outro email.'
      setError(msg)
    }
  }

  // ✅ Abre o link e redireciona para login após 2s
  async function handleVerify() {
    window.location.href = verificationLink
    setTimeout(() => navigate('/'), 2000)
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

        {/* ✅ Botão de verificação aparece automaticamente após cadastro */}
        {verificationLink && (
          <button
            onClick={handleVerify}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition mb-4"
          >
            ✅ Verificar meu email agora
          </button>
        )}

        {!verificationLink && (
          <>
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Cadastrar
            </button>
          </>
        )}

        <p className="text-gray-400 text-center mt-4 text-sm">
          Já tem conta?{' '}
          <Link to="/" style={{ color: '#0ea5e9', fontWeight: '600', textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
 