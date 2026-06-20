import Semaforo from './Semaforo.jsx'
import { money } from '../../utils/format.js'

// Etiquetas y formato de cada ratio del servicio RDS.
const RATIOS = {
  cuota_ingreso: { label: 'Cuota / Ingreso', fmt: (r) => `${r.valor_pct}%`, lim: (r) => `≤${r.apetito}% / ${r.tolerancia}%` },
  deuda_excedente: { label: 'Deuda / Excedente', fmt: (r) => `${r.valor_veces}×`, lim: (r) => `≤${r.apetito}× / ${r.tolerancia}×` },
  cuota_excedente: { label: 'Cuota / Excedente', fmt: (r) => `${r.valor_pct}%`, lim: (r) => `≤${r.apetito}% / ${r.tolerancia}%` },
  n_entidades: { label: 'N.º de entidades', fmt: (r) => `${r.valor}`, lim: (r) => `≤${r.apetito} / ${r.tolerancia}` },
}

/**
 * Panel de Riesgo de Sobreendeudamiento (servicio svc_rds).
 * Muestra cada ratio con su semáforo y el semáforo global.
 */
export default function RdsPanel({ rds }) {
  if (!rds) return null
  const entradas = Object.entries(rds.ratios || {})

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <div className="kpi-card__label">Semáforo global RDS</div>
          <Semaforo estado={rds.semaforo_global} />
        </div>
        <div>
          <div className="kpi-card__label">Excedente</div>
          <strong>{money(rds.excedente)}</strong>
        </div>
        <div>
          <div className="kpi-card__label">Cuota total</div>
          <strong>{money(rds.cuota_total)}</strong>
        </div>
      </div>

      {entradas.length === 0 ? (
        <p className="page-subtitle">
          Sin ratios calculados (faltan datos de centrales de riesgo).
        </p>
      ) : (
        <table className="tbl">
          <thead>
            <tr>
              <th>Ratio</th>
              <th className="num">Valor</th>
              <th className="num">Apetito / Tolerancia</th>
              <th>Semáforo</th>
            </tr>
          </thead>
          <tbody>
            {entradas.map(([key, r]) => {
              const cfg = RATIOS[key] || { label: key, fmt: () => '—', lim: () => '—' }
              return (
                <tr key={key}>
                  <td>{cfg.label}</td>
                  <td className="num">{cfg.fmt(r)}</td>
                  <td className="num">{cfg.lim(r)}</td>
                  <td>
                    <Semaforo estado={r.semaforo} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
