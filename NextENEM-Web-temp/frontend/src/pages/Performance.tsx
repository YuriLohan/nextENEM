import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import checklistIcon from '../assets/checklist.png' // Ícone para as matérias e estado vazio
import growthIcon from '../assets/growth.png'       // Ícone para o título principal
import NE from '../assets/NE.png'

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
  matematica: 'Matemática',
  linguagens: 'Linguagens',
  'ciencias-humanas': 'Ciências Humanas',
  'ciencias-da-natureza': 'Ciências da Natureza',
  outros: 'Outras Áreas' // Adicionado por segurança
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
    const token = localStorage.getItem('token')

    // Se não houver token no localStorage, nem gasta banda chamando a API
    if (!token) {
      console.warn("Nenhum token encontrado no localStorage. Usuário deslogado?")
      setData(null)
      setLoading(false)
      return
    }

    console.log("Disparando requisição de desempenho com o token:", token.substring(0, 10) + "...")

    api.get('/questions/performance', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        console.log("Dados de desempenho recebidos com sucesso:", res.data)
        setData(res.data)
      })
      .catch((err) => {
        // Mostra o erro exato que veio do servidor FastAPI no console do F12
        console.error("Erro detalhado na requisição de desempenho:", {
          status: err.response?.status,
          detail: err.response?.data?.detail,
          message: err.message,
          errorResponse: err.response
        })
        setData(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', fontFamily: 'sans-serif' }}>
      <header className="uni-header">
        <div className="uni-header-logo" onClick={() => navigate('/home')}>
          {/* Atualizado para usar o logotipo oficial em PNG */}
          <img src={NE} alt="NextENEM Logo" className="uni-header-logo-img" />
          <span className="uni-header-name">NextENEM</span>
        </div>
        <button className="uni-btn-back" onClick={() => navigate('/home')}>← Voltar</button>
      </header>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
        {/* TÍTULO: Agora usando corretamente o growthIcon ao lado de "Meu Desempenho" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Meu Desempenho</h2>
          <img src={growthIcon} alt="Progresso" style={{ width: 30, height: 30, objectFit: 'contain' }} />
        </div>
        <p style={{ color: '#9ca3af', marginBottom: 24 }}>Acompanhe seu progresso por área</p>

        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}

        {!loading && !data && (
          <p style={{ color: '#ef4444' }}>Erro ao carregar desempenho.</p>
        )}

        {/* ESTADO VAZIO: Mantido o checklistIcon aqui no meio */}
        {!loading && data && data.total === 0 && (
          <div style={{ background: '#111827', borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <img 
              src={checklistIcon} 
              alt="Checklist" 
              style={{ width: 56, height: 56, marginBottom: 12, objectFit: 'contain' }} 
            />
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
                    {/* DISCIPLINAS: Mantendo o checklistIcon antes de cada matéria */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={checklistIcon} alt="Checklist" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                      <p style={{ fontWeight: 600, margin: 0 }}>{DISCIPLINE_LABELS[key] || key}</p>
                    </div>
                    <p style={{ fontWeight: 700, margin: 0, color: stats.score >= 70 ? '#10b981' : stats.score >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {stats.score}%
                    </p>
                  </div>
                  <ScoreBar score={stats.score} />
                  <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 6, margin: '6px 0 0 0' }}>
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