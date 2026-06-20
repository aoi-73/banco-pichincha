import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus, RefreshCw, Search, History, FileText,
  ClipboardList, ClipboardCheck, BadgeCheck, LogOut,
} from 'lucide-react'
import { useBandeja } from '../hooks/useSolicitudes.js'
import { useAuth } from '../hooks/useAuth.js'
import { ESTADO } from '../utils/permisos.js'
import EstadoSolicitud from '../components/ui/EstadoSolicitud.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money } from '../utils/format.js'

const MAX_LIMIT = 200 // el backend limita limit a ≤200

// Estados para el selector (con su pk). null = todos.
const ESTADOS = [
  { v: null, label: 'TODOS' },
  { v: ESTADO.EN_EVALUACION, label: 'En Evaluación' },
  { v: ESTADO.EN_COMITE, label: 'En Comité' },
  { v: ESTADO.APROBADO, label: 'Aprobado' },
  { v: ESTADO.DESEMBOLSADO, label: 'Desembolsado' },
  { v: ESTADO.RECHAZADO, label: 'Rechazado' },
]

export default function SolicitudesBandejaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    items, resumen, loading, error, recargar,
    estado, setEstado, search, setSearch,
    fecIni, setFecIni, fecFin, setFecFin, limit, setLimit,
  } = useBandeja()

  const [texto, setTexto] = useState('')
  const [sel, setSel] = useState(null) // solicitud seleccionada

  // Sincroniza el filtro de estado con el parámetro ?estado= de la URL
  // (lo usan los ítems del menú de otorgamiento).
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const e = searchParams.get('estado')
    setEstado(e ? Number(e) : null)
  }, [searchParams, setEstado])

  const cnt = (e) => resumen.porEstado[e] || 0
  const hayMas = items.length >= limit && limit < MAX_LIMIT

  function abrir(cod) {
    if (cod) navigate(`/solicitudes/${cod}`)
  }

  return (
    <div>
      <h1 className="page-title">Bandeja de flujo de trabajo</h1>
      <p className="page-subtitle">
        Consulta, registra y gestiona las solicitudes de crédito hasta el desembolso.
      </p>

      {/* ── Datos del usuario + Búsqueda y filtros ── */}
      <div className="wb-top">
        <div className="wb-panel">
          <h3 className="wb-panel__title">Datos del usuario</h3>
          <div className="wb-fields">
            <div className="wb-field">
              <label>Usuario</label>
              <span className="val">{user?.nombre || '—'}</span>
            </div>
            <div className="wb-field">
              <label>Cargo / Rol</label>
              <span className="val">{user?.rol || '—'}</span>
            </div>
            <div className="wb-field">
              <label>Agencia</label>
              <span className="val">{user?.codagencia || '—'}</span>
            </div>
          </div>
        </div>

        <div className="wb-panel">
          <h3 className="wb-panel__title">Búsqueda y filtros</h3>
          <form
            onSubmit={(e) => { e.preventDefault(); setSearch(texto.trim()) }}
            className="wb-fields"
          >
            <div className="wb-field">
              <label>Estado de la solicitud</label>
              <select
                value={estado ?? ''}
                onChange={(e) => setEstado(e.target.value === '' ? null : Number(e.target.value))}
              >
                {ESTADOS.map((s) => (
                  <option key={s.label} value={s.v ?? ''}>
                    {s.label}
                    {s.v == null ? ` (${resumen.total})` : ` (${cnt(s.v)})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="wb-field">
              <label>Fecha inicial</label>
              <input type="date" value={fecIni} onChange={(e) => setFecIni(e.target.value)} />
            </div>
            <div className="wb-field">
              <label>Fecha final</label>
              <input type="date" value={fecFin} onChange={(e) => setFecFin(e.target.value)} />
            </div>
            <div className="wb-field">
              <label>Código de solicitud o cliente</label>
              <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej. SOL0000123 o Homero" />
            </div>
            <div className="wb-field" style={{ justifyContent: 'flex-end' }}>
              <label>&nbsp;</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn" type="submit" style={{ flex: 1 }}>
                  <Search size={15} style={{ verticalAlign: '-2px' }} /> Buscar
                </button>
                <button className="btn btn--ghost" type="button" onClick={recargar} title="Refrescar">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Datos de la solicitud seleccionada + Nueva ── */}
      <div className="wb-panel" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h3 className="wb-panel__title">Datos de la solicitud de crédito</h3>
            <div className="wb-fields">
              <div className="wb-field">
                <label>Código cliente</label>
                <span className="val">{sel?.codcliente ?? '—'}</span>
              </div>
              <div className="wb-field">
                <label>Nombre</label>
                <span className="val">{sel?.nomcliente ?? '—'}</span>
              </div>
              <div className="wb-field">
                <label>Código de solicitud</label>
                <span className="val">{sel?.codsolicitud ?? '—'}</span>
              </div>
              <div className="wb-field">
                <label>Estado de la solicitud</label>
                <span className="val">
                  {sel ? <EstadoSolicitud pkestado={sel.pksolicitudestado} texto={sel.dessolicitudestado} /> : '—'}
                </span>
              </div>
            </div>
          </div>
          <button className="btn" onClick={() => navigate('/solicitudes/nueva')}>
            <Plus size={16} style={{ verticalAlign: '-3px' }} /> Nueva solicitud
          </button>
        </div>
      </div>

      {search && (
        <div className="alert alert--info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Búsqueda activa: “<strong>{search}</strong>”</span>
          <button className="btn btn--ghost" style={{ padding: '4px 10px' }} onClick={() => { setTexto(''); setSearch('') }}>
            Limpiar
          </button>
        </div>
      )}

      {/* ── Grilla ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <div style={{ padding: 20 }}><Loader texto="Cargando solicitudes…" /></div>}
        {error && <div className="alert alert--error" style={{ margin: 16 }}>{error}</div>}

        {!loading && !error && (
          <table className="tbl">
            <thead>
              <tr>
                <th>Código solicitud</th>
                <th>Cliente</th>
                <th>Motivo</th>
                <th>Tipo</th>
                <th>Fecha registro</th>
                <th className="num">Monto</th>
                <th className="num">Plazo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr
                  key={s.codsolicitud}
                  className={sel?.codsolicitud === s.codsolicitud ? 'sel' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSel(s)}
                  onDoubleClick={() => abrir(s.codsolicitud)}
                >
                  <td><strong>{s.codsolicitud}</strong></td>
                  <td>{s.nomcliente}</td>
                  <td>{s.desmotivosolicitud || '—'}</td>
                  <td>{s.codtiposolicitud || '—'}</td>
                  <td>{s.fechasolicitudcredito || '—'}</td>
                  <td className="num">{money(s.montosolicitudcredito)}</td>
                  <td className="num">{s.plazosolicitudcredito ?? '—'}</td>
                  <td><EstadoSolicitud pkestado={s.pksolicitudestado} texto={s.dessolicitudestado} /></td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="page-subtitle" style={{ padding: 20 }}>
                    {search ? 'Sin resultados.' : 'No hay solicitudes en este filtro.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {hayMas && (
          <div style={{ textAlign: 'center', padding: 14 }}>
            <button className="btn btn--ghost" onClick={() => setLimit(Math.min(limit + 100, MAX_LIMIT))}>
              Cargar más
            </button>
          </div>
        )}
      </div>

      <p className="page-subtitle" style={{ fontSize: 12, marginTop: 8 }}>
        Mostrando {items.length} de {resumen.total} solicitudes · selecciona una fila y usa las acciones.
      </p>

      {/* ── Barra de acciones ── */}
      <div className="wb-toolbar">
        <button
          className="wb-tool"
          disabled={!sel?.codcliente}
          title={sel?.codcliente ? 'Ver ficha del cliente' : 'Selecciona una solicitud'}
          onClick={() => sel?.codcliente && navigate(`/clientes/${sel.codcliente}`)}
        >
          <History size={20} />
          Historial cliente
        </button>
        <button className="wb-tool" disabled title="Informe RCC no disponible en el backend">
          <FileText size={20} />
          Informe RCC
        </button>
        <button className="wb-tool" disabled={!sel} onClick={() => abrir(sel?.codsolicitud)}>
          <ClipboardList size={20} />
          Registro solicitud
        </button>
        <button className="wb-tool" disabled={!sel} onClick={() => abrir(sel?.codsolicitud)}>
          <ClipboardCheck size={20} />
          Evaluar solicitud
        </button>
        <button className="wb-tool" disabled={!sel} onClick={() => abrir(sel?.codsolicitud)}>
          <BadgeCheck size={20} />
          Pre aprobar
        </button>
        <button className="wb-tool wb-tool--exit" onClick={() => navigate('/dashboard')}>
          <LogOut size={20} />
          Salir
        </button>
      </div>
    </div>
  )
}
