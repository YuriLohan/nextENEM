import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'Estudante'

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold text-blue-400">NextENEM</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Sair
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-1">Olá, {name}! 👋</h2>
        <p className="text-gray-400 mb-8">O que vamos estudar hoje?</p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/questions')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl transition text-lg"
          >
            📝 Praticar Questões
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-5 rounded-xl transition text-lg"
          >
            📚 Conteúdos (em breve)
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-5 rounded-xl transition text-lg"
          >
            📊 Desempenho (em breve)
          </button>
        </div>
      </main>
    </div>
  )
}