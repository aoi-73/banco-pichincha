import { useScoring } from '../hooks/useScoring.js'
import { useAuth } from '../hooks/useAuth.js'
import ScoringForm from '../components/forms/ScoringForm.jsx'
import ScoreGauge from '../components/ui/ScoreGauge.jsx'
import Semaforo from '../components/ui/Semaforo.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, pct } from '../utils/format.js'

// Mapeo decisión → semáforo visual
const DECISION_SEMAFORO = {
  APROBADO: 'VERDE',
  OBSERVADO: 'AMARILLO',
  RECHAZADO: 'ROJO',
}

// El backend devuelve detalle_score anidado: cada factor es un objeto
// con su .puntaje (y datos extra). Las claves son las del backend.
const FACTORES = [
  { key: 'capacidad_pago', label: 'Capacidad de pago', max: 40 },
  { key: 'historial', label: 'Historial en BD', max: 30 },
  { key: 'sector_economico', label: 'Sector económico', max: 20 },
  { key: 'plazo', label: 'Plazo', max: 10 },
]

export default function ScoringPage() {
  const { user } = useAuth()
  const { resultado, loading, error, evaluar } = useScoring()

  return (
    <div>
      <h1 className="page-title">Scoring crediticio</h1>
      <p className="page-subtitle">
        Evalúa una solicitud y obtén score, decisión, TEA y cuota estimada.
      </p>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Solicitud</h3>
          <ScoringForm
            onSubmit={evaluar}
            loading={loading}
            codasesorDefault={user?.codasesor}
          />
          {error && <div className="alert alert--error">{error}</div>}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Resultado</h3>

          {loading && <Loader texto="Evaluando solicitud…" />}

          {!loading && !resultado && (
            <p className="page-subtitle">
              Completa el formulario y presiona <strong>Evaluar</strong>.
            </p>
          )}

          {resultado && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 32,
                  flexWrap: 'wrap',
                }}
              >
                <ScoreGauge score={resultado.score} />
                <div>
                  <div style={{ marginBottom: 10 }}>
                    <Semaforo estado={DECISION_SEMAFORO[resultado.decision]} />{' '}
                    <strong style={{ fontSize: 18 }}>{resultado.decision}</strong>
                  </div>
                  <div className="page-subtitle" style={{ margin: 0 }}>
                    TEA sugerida: <strong>{pct(resultado.tea_sugerida)}</strong>
                  </div>
                  <div className="page-subtitle" style={{ margin: 0 }}>
                    Cuota estimada: <strong>{money(resultado.cuota_estimada)}</strong>
                  </div>
                </div>
              </div>

              <h4>Desglose del puntaje</h4>
              <ul className="detalle-list">
                {FACTORES.map((f) => (
                  <li key={f.key}>
                    <span>{f.label}</span>
                    <span>
                      <strong>
                        {resultado.detalle_score?.[f.key]?.puntaje ?? '—'}
                      </strong>{' '}
                      / {f.max}
                    </span>
                  </li>
                ))}
              </ul>

              {resultado.observaciones?.length > 0 && (
                <>
                  <h4>Observaciones</h4>
                  <ul>
                    {resultado.observaciones.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
