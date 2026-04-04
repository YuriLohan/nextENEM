import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Verified() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => navigate('/'), 4000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-white mb-2">Email verificado!</h1>
        <p className="text-gray-400">Sua conta foi ativada com sucesso.</p>
        <p className="text-gray-500 text-sm mt-2">Redirecionando para o login...</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Ir para o Login
        </button>
      </div>
    </div>
  )
}