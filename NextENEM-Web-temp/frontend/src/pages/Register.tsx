import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../style/shared.css'
import '../style/Register.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [registered, setRegistered] = useState(false)

  async function handleRegister() {
    setError('')
    setSuccess('')
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Todos os campos são obrigatórios')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email inválido')
      return
    }
    try {
      await api.post('/auth/register', { name, email, password })
      setSuccess('Cadastro realizado! Verifique seu email para ativar a conta.')
      setRegistered(true)
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Erro ao cadastrar. Tente outro email.'
      setError(msg)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="logo-wrapper">
          <div className="logo-circle">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="14" r="7" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M22 11l2 2-2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="logo-title">NextENEM</h1>
          <p className="logo-subtitle">{registered ? 'Verifique seu email' : 'Crie sua conta gratuitamente'}</p>
        </div>

        {error && !registered && <div className="alert alert-error">{error}</div>}

        {registered ? (
          <>
            <div className="alert alert-success">{success}</div>
            <button className="btn btn-green" onClick={() => window.open('http://localhost:5173/inbox', '_blank')}>
              📥 Ir para Caixa de Entrada
            </button>
          </>
        ) : (
          <>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <input className="input-field" type="text" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
              <input className="input-field" type="email" placeholder="email@dominio.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="input-wrapper register-input-last">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button className="btn btn-primary" onClick={handleRegister}>Cadastrar</button>
          </>
        )}

        <p className="page-footer">
          Já tem conta?{' '}
          <Link to="/">Entrar</Link>
        </p>
      </div>
    </div>
  )
}