import { useState } from 'react'
import { useCartera } from '../hooks/useCreditos.js'
import { useAuth } from '../hooks/useAuth.js'
import TablaCartera from '../components/ui/TablaCartera.jsx'
import Loader from '../components/ui/Loader.jsx'

const PERIODO_DEFAULT = '202512'

export default function CarteraPage() {
  const { user } = useAuth()
  // El pkasesor viene del login; queda editable por si una jefatura consulta otra cartera.
  const [pkasesor, setPkasesor] = useState(String(user?.pkasesor ?? ''))
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT)

  const { cartera, loading, error } = useCartera(pkasesor, periodomes)

  return (
    <div>
      <h1 className="page-title">Cartera del asesor</h1>
      <p className="page-subtitle">
        Créditos priorizados por días de atraso (mayor morosidad primero).
        {user?.codasesor && ` · Asesor ${user.codasesor}`}
      </p>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="form-grid">
          <div className="field">
            <label>PK del asesor</label>
            <input
              type="number"
              value={pkasesor}
              onChange={(e) => setPkasesor(e.target.value)}
              placeholder="Ej. 31"
            />
          </div>
          <div className="field">
            <label>Período (AAAAMM)</label>
            <input
              type="text"
              value={periodomes}
              onChange={(e) => setPeriodomes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {loading && <Loader texto="Cargando cartera…" />}
        {error && <div className="alert alert--error">{error}</div>}
        {!loading && !error && <TablaCartera cartera={cartera} />}
      </div>
    </div>
  )
}
