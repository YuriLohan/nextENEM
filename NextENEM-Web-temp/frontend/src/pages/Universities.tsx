import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import universitiesData from '../data/universities.json'
import '../style/Universities.css'

interface University {
  estado: string
  cidade: string
  instituicao: string
  endereco: string
  cursos: string[]
}

const universities: University[] = universitiesData

const estados = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO',
  'MA','MG','MS','MT','PA','PB','PE','PI','PR',
  'RJ','RN','RO','RR','RS','SC','SE','SP','TO'
]

export default function Universities() {
  const navigate = useNavigate()
  const studyArea = localStorage.getItem('studyArea') || ''
  const [selectedEstado, setSelectedEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [results, setResults] = useState<University[]>([])
  const [searched, setSearched] = useState(false)

  function normalize(str: string) {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  function handleSearch() {
    if (!selectedEstado) return
    const area = normalize(studyArea)

    const filtered = universities.filter(u => {
      const matchEstado = u.estado === selectedEstado
      const matchCidade = cidade.trim()
        ? normalize(u.cidade).includes(normalize(cidade.trim()))
        : true
      const matchCurso = u.cursos.some(c => normalize(c).includes(area) || area.includes(normalize(c)))
      return matchEstado && matchCidade && matchCurso
    })

    setResults(filtered)
    setSearched(true)
  }

  function getCursoLabel(curso: string) {
    const map: Record<string, string> = {
      medicina: 'Medicina', direito: 'Direito', computacao: 'Computação',
      engenharia: 'Engenharia', administracao: 'Administração', psicologia: 'Psicologia',
      pedagogia: 'Pedagogia', enfermagem: 'Enfermagem', arquitetura: 'Arquitetura',
      contabilidade: 'Contabilidade', letras: 'Letras', historia: 'História',
      geografia: 'Geografia', artes: 'Artes'
    }
    return map[curso] || curso
  }

  return (
    <div className="uni-page">
      <header className="uni-header">
        <div className="uni-header-logo">
          <div className="uni-header-circle">NE</div>
          <span className="uni-header-name">NextENEM</span>
        </div>
        <button className="uni-btn-back" onClick={() => navigate('/home')}>← Voltar</button>
      </header>

      <main className="uni-main">
        <div className="uni-title-wrapper">
          <h1 className="uni-title">🎓 Universidades</h1>
          <p className="uni-subtitle">
            Buscando faculdades com curso de{' '}
            <strong>{studyArea || 'sua área'}</strong>
          </p>
        </div>

        <div className="uni-search-card">
          <div className="uni-search-row">
            <select
              className="uni-select"
              value={selectedEstado}
              onChange={e => setSelectedEstado(e.target.value)}
            >
              <option value="">Selecione o estado</option>
              {estados.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <input
              className="uni-input"
              type="text"
              placeholder="Cidade (opcional)"
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            className={`uni-btn-search ${selectedEstado ? 'active' : 'disabled'}`}
            onClick={handleSearch}
            disabled={!selectedEstado}
          >
            🔍 Buscar Faculdades
          </button>
        </div>

        {searched && (
          <div className="uni-results">
            {results.length === 0 ? (
              <div className="uni-empty">
                <p>😕 Nenhuma faculdade encontrada com esse filtro.</p>
                <p>Tente outro estado ou cidade.</p>
              </div>
            ) : (
              <>
                <p className="uni-results-count">{results.length} instituição(ões) encontrada(s)</p>
                {results.map((u, i) => (
                  <div key={i} className="uni-card">
                    <h3 className="uni-card-name">{u.instituicao}</h3>
                    <p className="uni-card-address">📍 {u.endereco}</p>
                    <div className="uni-card-cursos">
                      {u.cursos.map(c => (
                        <span key={c} className="uni-curso-tag">{getCursoLabel(c)}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}