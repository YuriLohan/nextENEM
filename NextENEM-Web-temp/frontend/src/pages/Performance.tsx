import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface DisciplineStats {
  total: number
  correct: number
  score: number
}

interface PerformanceData {
  total: number
  correct: number
  score: number
  by_discipline: Record<string, DisciplineStats>
}

const DISCIPLINE_LABELS: Record<string, string> = {
  matematica: '📐 Matemática',
  linguagens: '📖 Linguagens',
  'ciencias-humanas': '🌍 Ciências Humanas',
  'ciencias-da-natureza': '🔬 Ciências da Natureza',
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ background: '#1f2937', borderRadius: 8, height: 10, width: '100%', marginTop: 6 }}>
      <div style={{ background: color, width: `${score}%`, height: '100%', borderRadius: 8, transition: 'width 0.6s ease' }} />
    </div>
  )
}

export default function Performance() {
  const navigate = useNavigate()
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/questions/performance')
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#111827', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#60a5fa', fontSize: 20, fontWeight: 700 }}>NextENEM</h1>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 14 }}>
          ← Voltar
        </button>
      </header>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Meu Desempenho 📊</h2>
        <p style={{ color: '#9ca3af', marginBottom: 24 }}>Acompanhe seu progresso por área</p>

        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}

        {!loading && !data && (
          <p style={{ color: '#ef4444' }}>Erro ao carregar desempenho.</p>
        )}

        {!loading && data && data.total === 0 && (
          <div style={{ background: '#111827', borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📝</p>
            <p style={{ color: '#9ca3af' }}>Você ainda não respondeu nenhuma questão.</p>
            <button
              onClick={() => navigate('/questions')}
              style={{ marginTop: 16, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}
            >
              Praticar agora
            </button>
          </div>
        )}

        {!loading && data && data.total > 0 && (
          <>
            {/* Card geral */}
            <div style={{ background: '#111827', borderRadius: 16, padding: 24, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 4 }}>Total respondidas</p>
                <p style={{ fontSize: 28, fontWeight: 700 }}>{data.total}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 4 }}>Acertos</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{data.correct}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 4 }}>Aproveitamento</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: data.score >= 70 ? '#10b981' : data.score >= 40 ? '#f59e0b' : '#ef4444' }}>
                  {data.score}%
                </p>
              </div>
            </div>

            {/* Por área */}
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#e5e7eb' }}>Por área</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(data.by_discipline).map(([key, stats]) => (
                <div key={key} style={{ background: '#111827', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 600 }}>{DISCIPLINE_LABELS[key] || key}</p>
                    <p style={{ fontWeight: 700, color: stats.score >= 70 ? '#10b981' : stats.score >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {stats.score}%
                    </p>
                  </div>
                  <ScoreBar score={stats.score} />
                  <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 6 }}>
                    {stats.correct} acertos de {stats.total} questões
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}