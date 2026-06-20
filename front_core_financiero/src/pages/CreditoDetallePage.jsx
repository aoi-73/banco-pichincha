import { useParams, useNavigate } from 'react-router-dom'
import { useCreditoDetalle } from '../hooks/useCreditos.js'
import TablaCronograma from '../components/ui/TablaCronograma.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num, pct } from '../utils/format.js'

export default function CreditoDetallePage() {
  const { codcuentacredito } = useParams()
  const navigate = useNavigate()
  const { detalle, cronograma, loading, error } =
    useCreditoDetalle(codcuentacredito)

  if (loading) {
    return (
      <div className="card">
        <Loader texto="Cargando crédito…" />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div className="alert alert--error" style={{ marginTop: 16 }}>
          {error}
        </div>
      </div>
    )
  }

  if (!detalle) return null

  // Campos reales del endpoint /creditos/{codcuentacredito}.
  const filas = [
    ['Cliente', detalle.nomcliente],
    ['Documento', detalle.numerodocumentoidentidad],
    ['Monto aprobado', money(detalle.montoaprobadocredito)],
    ['N° de cuotas', num(detalle.nrocuotaaprobado)],
    ['Tasa compensatoria', pct(detalle.tasainterescompensatoria)],
    ['Fecha de aprobación', detalle.fechaaprobacioncredito],
    ['Saldo capital', money(detalle.montosaldocapital)],
    ['Saldo interés', money(detalle.montosaldointeres)],
    ['Saldo total cliente', money(detalle.montosaldocliente)],
    ['Días de atraso', num(detalle.diasatrasocredito)],
  ]

  return (
    <div>
      <button className="btn btn--ghost" onClick={() => navigate(-1)}>
        ← Volver a cartera
      </button>

      <h1 className="page-title" style={{ marginTop: 16 }}>
        Crédito {detalle.codcuentacredito}
      </h1>
      <p className="page-subtitle">Cliente: {detalle.nomcliente}</p>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Detalle del crédito</h3>
          <ul className="detalle-list">
            {filas.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <span>
                  <strong>{v ?? '—'}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Cronograma de pagos</h3>
          <TablaCronograma cronograma={cronograma} />
        </div>
      </div>
    </div>
  )
}
