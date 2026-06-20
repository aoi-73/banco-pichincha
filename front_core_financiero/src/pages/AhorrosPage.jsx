import { useState } from 'react'
import { useResumenAhorros } from '../hooks/useAhorros.js'
import { useAuth } from '../hooks/useAuth.js'
import GraficoTorta from '../components/ui/GraficoTorta.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num } from '../utils/format.js'

// En ahorros el período es una fecha (yyyymmdd), no AAAAMM.
const PERIODO_DEFAULT = '20251231'

export default function AhorrosPage() {
  const { user } = useAuth()
  const [codagencia, setCodagencia] = useState(user?.codagencia ?? '0001')
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT)

  const { resumen, loading, error } = useResumenAhorros(codagencia, periodomes)

  const totalSaldo = resumen.reduce((acc, r) => acc + Number(r.saldo_total || 0), 0)
  const dataTorta = resumen.map((r) => ({
    name: r.tipo,
    value: Number(r.saldo_total || 0),
  }))

  return (
    <div>
      <h1 className="page-title">Ahorros — resumen por agencia</h1>
      <p className="page-subtitle">
        Saldo de captaciones agrupado por tipo de cuenta.
      </p>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="form-grid">
          <div className="field">
            <label>Código de agencia</label>
            <input
              type="number"
              value={codagencia}
              onChange={(e) => setCodagencia(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Período (AAAAMMDD)</label>
            <input
              type="text"
              value={periodomes}
              onChange={(e) => setPeriodomes(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="card">
          <Loader texto="Cargando ahorros…" />
        </div>
      )}
      {error && <div className="alert alert--error">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-2">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Saldo por tipo de cuenta</h3>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Tipo de cuenta</th>
                  <th className="num">N° cuentas</th>
                  <th className="num">Saldo capital</th>
                </tr>
              </thead>
              <tbody>
                {resumen.map((r) => (
                  <tr key={r.tipo}>
                    <td>{r.tipo}</td>
                    <td className="num">{num(r.n_cuentas)}</td>
                    <td className="num">{money(r.saldo_total)}</td>
                  </tr>
                ))}
                {resumen.length > 0 && (
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td className="num" />
                    <td className="num">
                      <strong>{money(totalSaldo)}</strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Distribución</h3>
            <GraficoTorta data={dataTorta} />
          </div>
        </div>
      )}
    </div>
  )
}
