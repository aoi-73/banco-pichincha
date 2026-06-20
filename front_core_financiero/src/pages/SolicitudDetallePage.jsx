import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSolicitud } from '../hooks/useSolicitudes.js'
import { useAuth } from '../hooks/useAuth.js'
import { puede, ESTADO, OPINIONES } from '../utils/permisos.js'
import EstadoSolicitud from '../components/ui/EstadoSolicitud.jsx'
import TablaCronograma from '../components/ui/TablaCronograma.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num, pct } from '../utils/format.js'

/** Caja para emitir una opinión (favorable/desfavorable + comentario). */
function OpinionBox({ label, tipo, onSubmit, loading }) {
  const [favorable, setFavorable] = useState(true)
  const [comentario, setComentario] = useState('')
  return (
    <div className="card" style={{ background: 'var(--c-bg)', marginBottom: 12 }}>
      <strong>{label}</strong>
      <div className="field" style={{ marginTop: 10 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={favorable} onChange={(e) => setFavorable(e.target.checked)} style={{ width: 'auto' }} />
          Favorable
        </label>
      </div>
      <div className="field" style={{ marginTop: 8 }}>
        <label>Comentario</label>
        <input type="text" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Justificación…" />
      </div>
      <button className="btn" disabled={loading} style={{ marginTop: 10 }} onClick={() => onSubmit(tipo, favorable, comentario)}>
        Registrar opinión
      </button>
    </div>
  )
}

/** Formulario para registrar una fuente de ingreso (DE/NE/RH). */
function IngresoBox({ onSubmit, loading }) {
  const [tipo, setTipo] = useState('DE')
  const [monto, setMonto] = useState('')
  const [nombreEmpresa, setNombreEmpresa] = useState('')
  const submit = () => {
    if (monto === '') return
    const body = { tipo, monto: Number(monto) }
    if (nombreEmpresa.trim()) body.nombre_empresa = nombreEmpresa.trim()
    onSubmit(body)
  }
  return (
    <div className="card" style={{ background: 'var(--c-bg)', marginBottom: 12 }}>
      <strong>Registrar ingresos</strong>
      <div className="field" style={{ marginTop: 10 }}>
        <label>Tipo de ingreso</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="DE">DE — Dependiente (boleta)</option>
          <option value="NE">NE — Negocio</option>
          <option value="RH">RH — Recibo por honorarios</option>
        </select>
      </div>
      <div className="field" style={{ marginTop: 8 }}>
        <label>Monto (S/)</label>
        <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" />
      </div>
      <div className="field" style={{ marginTop: 8 }}>
        <label>Nombre de la empresa (opcional)</label>
        <input type="text" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} placeholder="Razón social…" />
      </div>
      <button className="btn" disabled={loading || monto === ''} style={{ marginTop: 10 }} onClick={submit}>
        Registrar ingreso
      </button>
    </div>
  )
}

/** Formulario para registrar la evaluación (ingreso/gasto + fortaleza/debilidad). */
function EvaluacionBox({ onSubmit, loading }) {
  const [ingreso, setIngreso] = useState('')
  const [gastoFamiliar, setGastoFamiliar] = useState('')
  const [fortaleza, setFortaleza] = useState('')
  const [debilidad, setDebilidad] = useState('')
  const submit = () => {
    if (ingreso === '' || gastoFamiliar === '') return
    const body = {
      ingreso: Number(ingreso),
      gasto_familiar: Number(gastoFamiliar),
    }
    if (fortaleza.trim()) body.fortaleza = fortaleza.trim()
    if (debilidad.trim()) body.debilidad = debilidad.trim()
    onSubmit(body)
  }
  return (
    <div className="card" style={{ background: 'var(--c-bg)', marginBottom: 12 }}>
      <strong>Registrar evaluación</strong>
      <div className="field" style={{ marginTop: 10 }}>
        <label>Ingreso (S/)</label>
        <input type="number" step="0.01" value={ingreso} onChange={(e) => setIngreso(e.target.value)} placeholder="0.00" />
      </div>
      <div className="field" style={{ marginTop: 8 }}>
        <label>Gasto familiar (S/)</label>
        <input type="number" step="0.01" value={gastoFamiliar} onChange={(e) => setGastoFamiliar(e.target.value)} placeholder="0.00" />
      </div>
      <div className="field" style={{ marginTop: 8 }}>
        <label>Fortaleza (opcional)</label>
        <input type="text" value={fortaleza} onChange={(e) => setFortaleza(e.target.value)} placeholder="Fortaleza del cliente…" />
      </div>
      <div className="field" style={{ marginTop: 8 }}>
        <label>Debilidad (opcional)</label>
        <input type="text" value={debilidad} onChange={(e) => setDebilidad(e.target.value)} placeholder="Debilidad del cliente…" />
      </div>
      <button className="btn" disabled={loading || ingreso === '' || gastoFamiliar === ''} style={{ marginTop: 10 }} onClick={submit}>
        Registrar evaluación
      </button>
    </div>
  )
}

export default function SolicitudDetallePage() {
  const { codsolicitud } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    solicitud, loading, error,
    accionLoading, accionMsg,
    opinar, aComite, resolver,
    registrarIngresos, evaluar, desembolsar,
    cronograma, cronogramaError, cargarCronograma,
  } = useSolicitud(codsolicitud)

  // Estado del formulario de resolución (Comité)
  const [decision, setDecision] = useState('APROBADO')
  const [motivo, setMotivo] = useState('')
  const [montoAprobado, setMontoAprobado] = useState('')

  if (loading) {
    return <div className="card"><Loader texto="Cargando solicitud…" /></div>
  }
  if (error) {
    return (
      <div>
        <button className="btn btn--ghost" onClick={() => navigate('/solicitudes')}>← Volver</button>
        <div className="alert alert--error" style={{ marginTop: 16 }}>{error}</div>
      </div>
    )
  }
  if (!solicitud) return null

  const est = solicitud.pksolicitudestado
  const enEvaluacion = est === ESTADO.EN_EVALUACION
  const enComite = est === ESTADO.EN_COMITE
  const aprobada = est === ESTADO.APROBADO

  // Opiniones que el rol del usuario puede emitir.
  const opinionesPermitidas = OPINIONES.filter((o) => puede(user?.rol, o.accion))
  const puedeComite = puede(user?.rol, 'enviar_comite')
  const puedeResolver = puede(user?.rol, 'resolver_comite')
  const puedeCrear = puede(user?.rol, 'crear_solicitud')

  const filas = [
    ['Cliente', solicitud.nomcliente],
    ['Monto solicitado', money(solicitud.montosolicitudcredito)],
    ['Plazo', `${num(solicitud.plazosolicitudcredito)} meses`],
    ['Tipo', solicitud.codtiposolicitud],
    ['Nivel de aprobación', solicitud.desnivelaprobacion || '—'],
    ['Monto aprobado', solicitud.montoaprobadocredito ? money(solicitud.montoaprobadocredito) : '—'],
    ['Fecha de aprobación', solicitud.fechaaprobacioncredito || '—'],
    ['Fecha de solicitud', solicitud.fechasolicitudcredito || '—'],
    ['Motivo / traza', solicitud.desmotivosolicitud || '—'],
  ]

  return (
    <div>
      <button className="btn btn--ghost" onClick={() => navigate('/solicitudes')}>← Solicitudes</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Solicitud {solicitud.codsolicitud}</h1>
        <EstadoSolicitud pkestado={est} texto={solicitud.dessolicitudestado} />
      </div>

      {accionMsg && (
        <div className={`alert ${accionMsg.tipo === 'ok' ? 'alert--info' : 'alert--error'}`}>
          {accionMsg.texto}
        </div>
      )}

      <div className="grid grid-2">
        {/* Detalle */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Detalle</h3>
          <ul className="detalle-list">
            {filas.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <span><strong>{v ?? '—'}</strong></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Acciones del flujo */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Flujo de aprobación</h3>

          {/* 0) Carga de ingresos y evaluación (asesor/administrador, en evaluación) */}
          {enEvaluacion && puedeCrear && (
            <>
              <h4 style={{ marginTop: 0 }}>Ingresos y evaluación</h4>
              <IngresoBox onSubmit={registrarIngresos} loading={accionLoading} />
              <EvaluacionBox onSubmit={evaluar} loading={accionLoading} />
            </>
          )}

          {/* 1) Opiniones (durante evaluación) */}
          {enEvaluacion && (
            <>
              <h4 style={{ marginTop: 0 }}>Opiniones</h4>
              {opinionesPermitidas.length === 0 ? (
                <p className="page-subtitle">
                  Tu rol <strong>{user?.rol}</strong> no emite opiniones en este flujo.
                </p>
              ) : (
                opinionesPermitidas.map((o) => (
                  <OpinionBox key={o.tipo} label={o.label} tipo={o.tipo} onSubmit={opinar} loading={accionLoading} />
                ))
              )}

              {/* 2) Enviar a comité */}
              <h4>Comité</h4>
              {puedeComite ? (
                <button className="btn" disabled={accionLoading} onClick={() => aComite(null)}>
                  Enviar a Comité →
                </button>
              ) : (
                <p className="page-subtitle">Tu rol no puede enviar a Comité.</p>
              )}
            </>
          )}

          {/* 3) Resolución (en comité) */}
          {enComite && (
            <>
              <h4 style={{ marginTop: 0 }}>Resolución del Comité</h4>
              {puedeResolver ? (
                <>
                  <div className="field">
                    <label>Decisión</label>
                    <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                      <option value="APROBADO">APROBADO</option>
                      <option value="DENEGADO_TEMPORAL">DENEGADO_TEMPORAL</option>
                      <option value="DENEGADO_DEFINITIVO">DENEGADO_DEFINITIVO</option>
                    </select>
                  </div>
                  {decision === 'APROBADO' && (
                    <div className="field" style={{ marginTop: 10 }}>
                      <label>Monto aprobado (opcional)</label>
                      <input type="number" step="0.01" value={montoAprobado} onChange={(e) => setMontoAprobado(e.target.value)} placeholder={`Por defecto: ${money(solicitud.montosolicitudcredito)}`} />
                    </div>
                  )}
                  <div className="field" style={{ marginTop: 10 }}>
                    <label>Motivo</label>
                    <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                  </div>
                  <button
                    className="btn"
                    disabled={accionLoading}
                    style={{ marginTop: 12 }}
                    onClick={() => resolver(decision, motivo, montoAprobado === '' ? null : Number(montoAprobado))}
                  >
                    Registrar resolución
                  </button>
                </>
              ) : (
                <p className="page-subtitle">Tu rol no puede resolver en Comité.</p>
              )}
            </>
          )}

          {/* 4) Cronograma (aprobada) */}
          {aprobada && (
            <>
              <h4 style={{ marginTop: 0 }}>Cronograma referencial</h4>
              <button className="btn btn--ghost" disabled={accionLoading} onClick={cargarCronograma}>
                Generar cronograma
              </button>
              {cronogramaError && <div className="alert alert--error">{cronogramaError}</div>}
              {cronograma && (
                <>
                  <ul className="detalle-list" style={{ marginTop: 12 }}>
                    <li><span>Monto</span><span><strong>{money(cronograma.monto)}</strong></span></li>
                    <li><span>Plazo</span><span><strong>{cronograma.plazo_meses} meses</strong></span></li>
                    <li><span>TEA</span><span><strong>{pct(cronograma.tea)}</strong></span></li>
                    <li><span>Cuota referencial</span><span><strong>{money(cronograma.cuota_referencial)}</strong></span></li>
                  </ul>
                  <CronogramaSolicitud cuotas={cronograma.cronograma} />
                </>
              )}
            </>
          )}

          {/* 5) Desembolso (aprobada, rol comité/administrador/gerencia) */}
          {aprobada && puedeResolver && (
            <>
              <h4>Desembolso</h4>
              <p className="page-subtitle">
                Genera la cuenta de crédito y marca la solicitud como Desembolsada.
              </p>
              <button className="btn" disabled={accionLoading} onClick={desembolsar}>
                Desembolsar →
              </button>
            </>
          )}

          {/* Estados terminales */}
          {est === ESTADO.RECHAZADO && (
            <p className="page-subtitle">La solicitud fue rechazada. No hay acciones disponibles.</p>
          )}
        </div>
      </div>
    </div>
  )
}

/** Adapta el cronograma de la solicitud (claves cuota/capital/interes/saldo) a la tabla. */
function CronogramaSolicitud({ cuotas = [] }) {
  const filas = cuotas.map((c) => ({
    nrocuota: c.nrocuota,
    fechavencimientopagocuota: '—',
    montocapitalprogramado: c.capital,
    montointeresprogramado: c.interes,
    montocuota: c.cuota,
    montosaldo: c.saldo,
    codestadocuota: '',
  }))
  return <TablaCronograma cronograma={filas} />
}
