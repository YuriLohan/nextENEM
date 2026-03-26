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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">NextENEM</h1>
        <p className="text-gray-400 text-center mb-6">Crie sua conta</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm mb-4 px-4 py-3 rounded-lg text-center">
            {success}
          </div>
        )}

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

        <p className="text-gray-400 text-center mt-4 text-sm">
          Já tem conta?{' '}
          <Link to="/" className="text-blue-400 hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}