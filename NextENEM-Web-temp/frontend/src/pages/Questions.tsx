import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Alternative {
  letter: string
  text: string
}

interface Question {
  index: number
  year: number
  discipline: string
  context: string
  files: string[]
  alternativesIntroduction: string
  alternatives: Alternative[]
  correctAlternative: string
}

export default function Questions() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(true)

  async function fetchQuestion() {
    setLoading(true)
    setSelected(null)
    setAnswered(false)
    try {
      const res = await api.get('/questions/random')
      setQuestion(res.data)
    } catch {
      setQuestion(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestion()
  }, [])

  function handleAnswer(letter: string) {
    if (answered) return
    setSelected(letter)
    setAnswered(true)
  }

  function getColor(letter: string) {
    if (!answered) return 'bg-gray-800 hover:bg-gray-700'
    if (letter === question?.correctAlternative) return 'bg-green-700'
    if (letter === selected) return 'bg-red-700'
    return 'bg-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold text-blue-400">NextENEM</h1>
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Voltar
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {loading && <p className="text-gray-400">Carregando questão...</p>}

        {!loading && !question && (
          <p className="text-red-400">Erro ao carregar questão. Tente novamente.</p>
        )}

        {!loading && question && (
          <>
            <div className="mb-4 flex gap-3 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">{question.year}</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">{question.discipline}</span>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{question.context}</p>

            {question.files?.map((url, i) => (
              <img key={i} src={url} alt="imagem da questão" className="mb-4 rounded-lg max-w-full" />
            ))}

            <p className="text-gray-300 mb-4">{question.alternativesIntroduction}</p>

            <div className="flex flex-col gap-3 mb-6">
              {question.alternatives.map((alt) => (
                <button
                  key={alt.letter}
                  onClick={() => handleAnswer(alt.letter)}
                  className={`text-left px-4 py-3 rounded-xl transition text-sm ${getColor(alt.letter)}`}
                >
                  <span className="font-bold mr-2">{alt.letter})</span>{alt.text}
                </button>
              ))}
            </div>

            {answered && (
              <div className={`text-center font-semibold text-lg mb-6 ${selected === question.correctAlternative ? 'text-green-400' : 'text-red-400'}`}>
                {selected === question.correctAlternative ? '✅ Resposta correta!' : `❌ Errou! A correta era ${question.correctAlternative}`}
              </div>
            )}

            <button
              onClick={fetchQuestion}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
            >
              Próxima questão →
            </button>
          </>
        )}
      </main>
    </div>
  )
}