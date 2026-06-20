import { useNavigate } from 'react-router-dom'
import { useCrearSolicitud } from '../hooks/useSolicitudes.js'
import { useAuth } from '../hooks/useAuth.js'
import { puede } from '../utils/permisos.js'
import SolicitudForm from '../components/forms/SolicitudForm.jsx'
import ScoreGauge from '../components/ui/ScoreGauge.jsx'
import Semaforo from '../components/ui/Semaforo.jsx'
import RdsPanel from '../components/ui/RdsPanel.jsx'
import RutaAprobacion from '../components/ui/RutaAprobacion.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, pct } from '../utils/format.js'

const DECISION_SEMAFORO = { APROBADO: 'VERDE', OBSERVADO: 'AMARILLO', RECHAZADO: 'ROJO' }

export default function SolicitudNuevaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { crear, resultado, rechazo, loading, error } = useCrearSolicitud()

  const puedeCrear = puede(user?.rol, 'crear_solicitud')

  return (
    <div>
      <button className="btn btn--ghost" onClick={() => navigate('/solicitudes')}>
        ← Bandeja
      </button>
      <div style={{ marginTop: 16 }}>
        <h1 className="page-title">Nueva solicitud de crédito</h1>
        <p className="page-subtitle">
          Originación MPR-003-CRE: elegibilidad → pre-scoring → RDS → ruta de aprobación.
        </p>
      </div>

      {!puedeCrear && (
        <div className="alert alert--info">
          Tu rol <strong>{user?.rol}</strong> no tiene permiso para crear solicitudes
          (solo <em>asesor</em> o <em>administrador</em>). Puedes intentarlo, pero el
          backend lo rechazará con 403.
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <SolicitudForm onSubmit={crear} loading={loading} codasesorDefault={user?.codasesor} />
          {error && <div className="alert alert--error">{error}</div>}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Resultado de la evaluación</h3>

          {loading && <Loader texto="Evaluando solicitud…" />}

          {!loading && !resultado && !rechazo && (
            <p className="page-subtitle">Completa el formulario y crea la solicitud.</p>
          )}

          {/* Cliente NO sujeto de crédito (HTTP 422) */}
          {rechazo && (
            <div>
              <div className="alert alert--error">
                <strong>{rechazo.error}</strong>
              </div>
              {rechazo.elegibilidad && (
                <>
                  <p>
                    Calificación: <strong>{rechazo.elegibilidad.calificacion}</strong> —{' '}
                    <Semaforo estado="ROJO" /> {rechazo.elegibilidad.resultado}
                  </p>
                  <ul>
                    {(rechazo.elegibilidad.motivos || []).map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Solicitud creada */}
          {resultado && (
            <div>
              <div className="alert alert--info">
                Solicitud{' '}
                <strong
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => navigate(`/solicitudes/${resultado.codsolicitud}`)}
                >
                  {resultado.codsolicitud}
                </strong>{' '}
                creada — estado <strong>{resultado.estado}</strong>
                {resultado.observada && ' (OBSERVADA: cliente CPP)'}
              </div>

              {/* Scoring */}
              <h4>Pre-scoring</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <ScoreGauge score={resultado.scoring?.score} />
                <div>
                  <Semaforo estado={DECISION_SEMAFORO[resultado.scoring?.decision]} />{' '}
                  <strong>{resultado.scoring?.decision}</strong>
                  <div className="page-subtitle" style={{ margin: '6px 0 0' }}>
                    TEA sugerida: <strong>{pct(resultado.scoring?.tea_sugerida)}</strong>
                  </div>
                  <div className="page-subtitle" style={{ margin: 0 }}>
                    Cuota estimada: <strong>{money(resultado.scoring?.cuota_estimada)}</strong>
                  </div>
                </div>
              </div>

              {/* Elegibilidad */}
              <h4>Elegibilidad</h4>
              <p style={{ margin: 0 }}>
                <Semaforo estado={resultado.elegibilidad?.resultado === 'APTO' ? 'VERDE' : 'AMARILLO'} />{' '}
                {resultado.elegibilidad?.resultado} — calificación{' '}
                <strong>{resultado.elegibilidad?.calificacion}</strong>
              </p>
              {resultado.elegibilidad?.motivos?.length > 0 && (
                <ul>
                  {resultado.elegibilidad.motivos.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              )}

              {/* RDS */}
              <h4>Riesgo de sobreendeudamiento (RDS)</h4>
              <RdsPanel rds={resultado.rds} />

              {/* Nivel y ruta */}
              <h4>Nivel de aprobación</h4>
              <p style={{ marginTop: 0 }}>
                <strong>{resultado.nivel_aprobacion?.codigo || '—'}</strong>{' '}
                {resultado.nivel_aprobacion?.descripcion || ''}
              </p>

              <h4>Ruta de aprobación</h4>
              <RutaAprobacion ruta={resultado.ruta_aprobacion} />

              <button className="btn" style={{ marginTop: 18 }} onClick={() => navigate(`/solicitudes/${resultado.codsolicitud}`)}>
                Ir al detalle y continuar el flujo →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
