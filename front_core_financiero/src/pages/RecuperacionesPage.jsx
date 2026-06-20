import { useState } from 'react'
import { X, RefreshCw, AlertTriangle, Gavel, Ban, History } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import {
  puede,
  BANDAS_MORA,
  BANDA_INFO,
  UMBRAL_JUDICIAL,
  UMBRAL_CASTIGO,
} from '../utils/permisos.js'
import {
  useResumenMora,
  useCarteraMora,
  useTiposGestion,
  useGestiones,
} from '../hooks/useRecuperaciones.js'
import { pasarJudicial, castigarCredito } from '../services/svc_recuperaciones.js'
import KpiCard from '../components/ui/KpiCard.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num, fecha } from '../utils/format.js'

/** Extrae el `detail` de un error de axios sin exponer objetos crudos. */
function detalleError(err, fallback) {
  const d = err.response?.data?.detail
  if (typeof d === 'string') return d
  if (d?.error) return d.error
  return fallback
}

/** Etiqueta coloreada de banda de mora. */
function BandaBadge({ banda }) {
  const info = BANDA_INFO[banda] || { label: banda, color: '#64748b' }
  return (
    <span
      className="badge"
      style={{ background: `${info.color}22`, color: info.color, border: `1px solid ${info.color}55` }}
    >
      {info.label}
    </span>
  )
}

export default function RecuperacionesPage() {
  const { user } = useAuth()
  const { resumen, loading: loadingResumen, recargar: recargarResumen } = useResumenMora()
  const { cartera, banda, setBanda, loading: loadingCartera, error, recargar: recargarCartera } = useCarteraMora(null)
  const [gestionCod, setGestionCod] = useState(null) // crédito en gestión (abre modal)
  const [aviso, setAviso] = useState(null) // {tipo:'ok'|'error', texto} de transiciones
  const [transCod, setTransCod] = useState(null) // crédito con transición en curso

  const puedeGestionar = puede(user?.rol, 'gestionar_cobranza')
  const puedeJudicial = puede(user?.rol, 'derivar_judicial')
  const puedeCastigar = puede(user?.rol, 'castigar_credito')
  const hayAcciones = puedeGestionar || puedeJudicial || puedeCastigar
  const nCols = hayAcciones ? 10 : 9

  // Mapa banda -> fila del resumen para alimentar los KPIs.
  const porBanda = {}
  for (const b of resumen?.por_banda || []) porBanda[b.banda] = b

  function refrescar() {
    recargarResumen()
    recargarCartera()
  }

  function cerrarModal(refrescarLista) {
    setGestionCod(null)
    if (refrescarLista) refrescar()
  }

  /** Ejecuta una transición sensible con confirmación previa y manejo de 400. */
  async function ejecutarTransicion(c, tipo) {
    const cfg = {
      judicial: { fn: pasarJudicial, pregunta: `¿Derivar a cobranza judicial el crédito ${c.codcuentacredito}?` },
      castigo: { fn: castigarCredito, pregunta: `¿Castigar el crédito ${c.codcuentacredito}? Esta acción es contable y excepcional.` },
    }[tipo]
    // eslint-disable-next-line no-alert
    if (!window.confirm(cfg.pregunta)) return
    setTransCod(c.codcuentacredito)
    setAviso(null)
    try {
      const res = await cfg.fn(c.codcuentacredito)
      setAviso({ tipo: 'ok', texto: `${c.codcuentacredito}: ${res.estado} (${num(res.dias_atraso)} días de atraso).` })
      refrescar()
    } catch (err) {
      setAviso({ tipo: 'error', texto: detalleError(err, 'No se pudo completar la transición.') })
    } finally {
      setTransCod(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          <AlertTriangle size={22} style={{ verticalAlign: '-4px', marginRight: 8, color: 'var(--c-naranja, #ea580c)' }} />
          Recuperaciones / Mora
        </h1>
        <button className="btn btn--ghost" onClick={refrescar} title="Refrescar">
          <RefreshCw size={15} />
        </button>
      </div>
      <p className="page-subtitle">
        Bandeja de cartera en mora por banda, gestión de cobranza y transiciones de estado.
        {resumen && <> Total créditos: <strong>{num(resumen.total)}</strong> · En mora: <strong>{num(resumen.en_mora)}</strong>.</>}
      </p>

      {aviso && (
        <div className={`alert ${aviso.tipo === 'ok' ? 'alert--info' : 'alert--error'}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{aviso.texto}</span>
          <button className="btn btn--ghost" style={{ padding: '2px 10px' }} onClick={() => setAviso(null)}>✕</button>
        </div>
      )}

      {/* ── KPIs por banda ── */}
      {loadingResumen ? (
        <div className="card"><Loader texto="Cargando resumen de mora…" /></div>
      ) : (
        <div className="grid grid-kpi" style={{ marginBottom: 20 }}>
          {BANDAS_MORA.map((b) => {
            const r = porBanda[b.cod]
            return (
              <KpiCard
                key={b.cod}
                label={`${b.label} · ${num(r?.n_creditos || 0)} créditos`}
                valor={money(r?.saldo || 0)}
                color={b.color}
              />
            )
          })}
        </div>
      )}

      {/* ── Tabs de banda ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <button
          className={'btn ' + (banda === null ? '' : 'btn--ghost')}
          onClick={() => setBanda(null)}
        >
          Todas
        </button>
        {BANDAS_MORA.map((b) => (
          <button
            key={b.cod}
            className={'btn ' + (banda === b.cod ? '' : 'btn--ghost')}
            style={banda === b.cod ? { background: b.color, borderColor: b.color } : { color: b.color }}
            onClick={() => setBanda(b.cod)}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* ── Tabla de cartera morosa ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loadingCartera && <div style={{ padding: 20 }}><Loader texto="Cargando cartera en mora…" /></div>}
        {error && <div className="alert alert--error" style={{ margin: 16 }}>{error}</div>}

        {!loadingCartera && !error && (
          <table className="tbl">
            <thead>
              <tr>
                <th>Crédito</th>
                <th>Cliente</th>
                <th className="num">Días atraso</th>
                <th className="num">Saldo</th>
                <th className="num">Saldo vencido</th>
                <th>Calificación</th>
                <th>Banda</th>
                <th>Agencia</th>
                <th>Estado</th>
                {hayAcciones && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cartera.map((c) => (
                <tr key={c.codcuentacredito}>
                  <td><strong>{c.codcuentacredito}</strong></td>
                  <td>
                    {c.nomcliente}
                    <div className="page-subtitle" style={{ fontSize: 11 }}>{(c.codcliente || '').trim()}</div>
                  </td>
                  <td className="num" style={c.diasatrasocredito > 120 ? { color: '#dc2626', fontWeight: 700 } : undefined}>
                    {num(c.diasatrasocredito)}
                  </td>
                  <td className="num">{money(c.montosaldocapital)}</td>
                  <td className="num">{money(c.montosaldovencido)}</td>
                  <td>{c.calificacion}</td>
                  <td><BandaBadge banda={c.banda} /></td>
                  <td>{c.desagencia || c.codagencia}</td>
                  <td>
                    <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {c.flagjudicial === 'S' && (
                        <span className="badge badge--rojo" title="En proceso judicial"><Gavel size={12} style={{ verticalAlign: '-2px' }} /> Judicial</span>
                      )}
                      {c.flagcastigado === 'S' && (
                        <span className="badge badge--neutral" title="Crédito castigado"><Ban size={12} style={{ verticalAlign: '-2px' }} /> Castigado</span>
                      )}
                      {c.flagjudicial !== 'S' && c.flagcastigado !== 'S' && (
                        <span className="page-subtitle" style={{ fontSize: 12 }}>—</span>
                      )}
                    </span>
                  </td>
                  {hayAcciones && (
                    <td>
                      <AccionesFila
                        c={c}
                        puedeGestionar={puedeGestionar}
                        puedeJudicial={puedeJudicial}
                        puedeCastigar={puedeCastigar}
                        ocupado={transCod === c.codcuentacredito}
                        onGestionar={() => setGestionCod(c.codcuentacredito)}
                        onJudicial={() => ejecutarTransicion(c, 'judicial')}
                        onCastigar={() => ejecutarTransicion(c, 'castigo')}
                      />
                    </td>
                  )}
                </tr>
              ))}
              {cartera.length === 0 && (
                <tr>
                  <td colSpan={nCols} className="page-subtitle" style={{ padding: 20 }}>
                    No hay créditos en esta banda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <p className="page-subtitle" style={{ fontSize: 12, marginTop: 8 }}>
        Mostrando {cartera.length} crédito(s){banda ? ` en banda ${BANDA_INFO[banda]?.label}` : ' en mora'}.
      </p>

      {gestionCod && (
        <GestionModal cod={gestionCod} puedeGestionar={puedeGestionar} onClose={cerrarModal} />
      )}
    </div>
  )
}

/** Botonera de acciones por fila, con permisos + umbrales de días (deshabilitado + tooltip). */
function AccionesFila({ c, puedeGestionar, puedeJudicial, puedeCastigar, ocupado, onGestionar, onJudicial, onCastigar }) {
  const dias = Number(c.diasatrasocredito || 0)

  // Motivo de bloqueo de cada transición (null = habilitada).
  const bloqueoJudicial =
    c.flagjudicial === 'S'
      ? 'Ya está en cobranza judicial'
      : dias < UMBRAL_JUDICIAL
        ? `Requiere ≥ ${UMBRAL_JUDICIAL} días de atraso (actual: ${dias})`
        : null
  const bloqueoCastigo =
    c.flagcastigado === 'S'
      ? 'Ya está castigado'
      : dias <= UMBRAL_CASTIGO
        ? `Requiere > ${UMBRAL_CASTIGO} días de atraso (actual: ${dias})`
        : null

  return (
    <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {puedeGestionar && (
        <button className="btn btn--ghost" style={{ padding: '4px 12px' }} disabled={ocupado} onClick={onGestionar}>
          Gestionar
        </button>
      )}
      {puedeJudicial && (
        <button
          className="btn btn--ghost"
          style={{ padding: '4px 12px', color: bloqueoJudicial ? undefined : '#dc2626' }}
          disabled={ocupado || !!bloqueoJudicial}
          title={bloqueoJudicial || 'Derivar a cobranza judicial'}
          onClick={onJudicial}
        >
          <Gavel size={13} style={{ verticalAlign: '-2px' }} /> Judicial
        </button>
      )}
      {puedeCastigar && (
        <button
          className="btn btn--ghost"
          style={{ padding: '4px 12px', color: bloqueoCastigo ? undefined : '#334155' }}
          disabled={ocupado || !!bloqueoCastigo}
          title={bloqueoCastigo || 'Castigar crédito (castigo contable)'}
          onClick={onCastigar}
        >
          <Ban size={13} style={{ verticalAlign: '-2px' }} /> Castigar
        </button>
      )}
    </span>
  )
}

/** Modal: registrar gestión de cobranza + historial del crédito. */
function GestionModal({ cod, puedeGestionar, onClose }) {
  const { tipos, loading: loadingTipos } = useTiposGestion()
  const { gestiones, loading, registrar, accionLoading, accionMsg } = useGestiones(cod)

  const [codtipogestion, setCodtipogestion] = useState('')
  const [resultado, setResultado] = useState('')
  const [compromiso, setCompromiso] = useState('')
  const [monto, setMonto] = useState('')

  async function guardar() {
    if (!codtipogestion) return
    const body = { codtipogestion }
    if (resultado.trim()) body.resultado = resultado.trim()
    if (compromiso) body.compromiso_pago = compromiso
    if (monto !== '') body.monto_comprometido = Number(monto)
    const res = await registrar(body)
    if (res) {
      // Limpia el formulario; el historial ya se recargó dentro del hook.
      setResultado('')
      setCompromiso('')
      setMonto('')
    }
  }

  return (
    <div className="modal-overlay" onClick={() => onClose(true)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620, width: '92%' }}>
        <button className="modal-close" onClick={() => onClose(true)} aria-label="Cerrar"><X size={18} /></button>

        <h2 style={{ margin: '0 0 4px', fontSize: 19, color: 'var(--c-primary)' }}>Gestión de cobranza</h2>
        <p className="page-subtitle" style={{ marginTop: 0 }}>Crédito <strong>{cod}</strong></p>

        {accionMsg && (
          <div className={`alert ${accionMsg.tipo === 'ok' ? 'alert--info' : 'alert--error'}`}>{accionMsg.texto}</div>
        )}

        {/* Formulario (solo si puede gestionar) */}
        {puedeGestionar && (
          <div className="card" style={{ background: 'var(--c-bg)', marginBottom: 14 }}>
            <div className="form-grid">
              <div className="field">
                <label>Tipo de gestión</label>
                <select value={codtipogestion} onChange={(e) => setCodtipogestion(e.target.value)} disabled={loadingTipos}>
                  <option value="">{loadingTipos ? 'Cargando…' : 'Seleccione…'}</option>
                  {tipos.map((t) => (
                    <option key={t.pktipogestion} value={t.codtipogestion}>{t.destipogestion}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Resultado</label>
                <input type="text" value={resultado} onChange={(e) => setResultado(e.target.value)} placeholder="Ej. Cliente promete pagar" />
              </div>
              <div className="field">
                <label>Compromiso de pago</label>
                <input type="date" value={compromiso} onChange={(e) => setCompromiso(e.target.value)} />
              </div>
              <div className="field">
                <label>Monto comprometido (S/)</label>
                <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <button className="btn" disabled={accionLoading || !codtipogestion} style={{ marginTop: 12 }} onClick={guardar}>
              {accionLoading ? 'Guardando…' : 'Registrar gestión'}
            </button>
          </div>
        )}

        {/* Historial */}
        <h4 style={{ margin: '6px 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <History size={16} /> Historial de gestiones
        </h4>
        {loading ? (
          <Loader texto="Cargando historial…" />
        ) : gestiones.length === 0 ? (
          <p className="page-subtitle">Sin gestiones registradas para este crédito.</p>
        ) : (
          <div style={{ maxHeight: 280, overflow: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Banda</th>
                  <th>Resultado</th>
                  <th>Compromiso</th>
                  <th className="num">Monto</th>
                  <th className="num">Días</th>
                </tr>
              </thead>
              <tbody>
                {gestiones.map((g) => (
                  <tr key={g.pkgestion}>
                    <td>{fecha(g.fechagestion)}</td>
                    <td>{g.tipo}</td>
                    <td><BandaBadge banda={g.banda} /></td>
                    <td>{g.resultado || '—'}</td>
                    <td>{fecha(g.compromisopago)}</td>
                    <td className="num">{g.montocomprometido ? money(g.montocomprometido) : '—'}</td>
                    <td className="num">{num(g.diasatrasoalmomento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
