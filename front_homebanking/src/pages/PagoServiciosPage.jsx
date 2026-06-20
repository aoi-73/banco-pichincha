import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ArrowLeft, ArrowRight, ShieldCheck, Zap, Droplet, Phone, Tv, Flame, Building2 } from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { usePagoServicio, useServicios } from '../hooks/useOperaciones.js'
import { toNumber, simboloMoneda } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import Comprobante from '../components/ui/Comprobante.jsx'

// Iconos por código de servicio del catálogo (LUZ, AGUA, TEL, CABLE, GAS, MUNI).
const ICONOS = {
  LUZ: { icon: Zap, color: '#d97706' },
  AGUA: { icon: Droplet, color: '#29b6f6' },
  TEL: { icon: Phone, color: '#0F265C' },
  CABLE: { icon: Tv, color: '#d0a675' },
  GAS: { icon: Flame, color: '#c2410c' },
  MUNI: { icon: Building2, color: '#10b981' },
}

export default function PagoServiciosPage() {
  const navigate = useNavigate()
  const { cuentas, loading: lca, recargar: recargarCuentas } = useCuentas('ahorro')
  const { servicios, loading: ls, error: errServ } = useServicios()
  const { run, loading: pagando, error, result, reset } = usePagoServicio()

  const [paso, setPaso] = useState('form')
  const [codservicio, setCodservicio] = useState('')
  const [codsuministro, setCodsuministro] = useState('')
  const [origen, setOrigen] = useState('')
  const [monto, setMonto] = useState('')
  const [validacion, setValidacion] = useState(null)

  const serv = servicios.find((s) => s.codservicio === codservicio) || null
  const cuentaOrigen = cuentas.find((c) => c.codcuentaahorro === origen)
  const simbolo = cuentaOrigen ? simboloMoneda(cuentaOrigen.moneda) : 'S/'
  const saldoInsuficiente = cuentaOrigen && toNumber(monto) > toNumber(cuentaOrigen.saldo)

  const validar = () => {
    if (!codservicio) return 'Seleccione la empresa / servicio.'
    if (!codsuministro.trim()) return 'Ingrese el código de suministro o recibo.'
    if (!origen) return 'Seleccione la cuenta de ahorro de origen.'
    if (toNumber(monto) <= 0) return 'Ingrese un monto válido mayor a cero.'
    if (saldoInsuficiente) return 'Saldo insuficiente en la cuenta de ahorro.'
    return null
  }

  const irAConfirmar = (e) => {
    e.preventDefault()
    const v = validar()
    setValidacion(v)
    if (!v) setPaso('confirm')
  }

  const confirmar = async () => {
    try {
      await run({ cuenta_origen: origen, codservicio, codsuministro: codsuministro.trim(), monto: toNumber(monto) })
      recargarCuentas()
    } catch { /* error vía `error` */ }
  }

  const nuevo = () => { reset(); setPaso('form'); setCodservicio(''); setCodsuministro(''); setMonto('') }

  return (
    <PageLayout>
      <button className="hb-back" onClick={() => navigate('/operaciones')}>
        <ArrowLeft size={16} /> Volver a Operaciones
      </button>
      <h1 className="bbva-page-title">Pago de servicios</h1>
      <p className="bbva-page-sub">Operaciones › Pago de servicios</p>

      {result ? (
        <Comprobante
          titulo="Pago de servicio realizado"
          mensaje={result.mensaje}
          filas={[
            { label: 'Servicio', value: result.servicio },
            { label: 'Suministro / recibo', value: result.codsuministro },
            { label: 'Cuenta debitada', value: result.cuenta_origen },
            { label: 'Monto', value: <Money value={result.monto} simbolo={simbolo} /> },
            { label: 'N° de operación', value: result.pkoperacion },
            { label: 'Kardex', value: result.codkardex },
          ]}
          acciones={[
            { label: 'Pagar otro servicio', onClick: nuevo },
            { label: 'Ir al inicio', primary: true, onClick: () => navigate('/inicio') },
          ]}
        />
      ) : (
        <Card title="Datos del pago" icon={<FileText size={18} />}>
          {lca || ls ? (
            <Loader text="Cargando datos…" />
          ) : paso === 'confirm' ? (
            <div className="bbva-confirm">
              <p className="bbva-confirm-lead">Confirma el pago del servicio:</p>
              {error && <Alert tipo="error">{error}</Alert>}
              <dl className="hb-dl">
                <div><dt>Servicio</dt><dd>{serv?.nombre}</dd></div>
                <div><dt>Suministro</dt><dd>{codsuministro}</dd></div>
                <div><dt>Cuenta a debitar</dt><dd>{origen} · {cuentaOrigen?.tipo}</dd></div>
                <div><dt>Monto</dt><dd><Money value={monto} simbolo={simbolo} /></dd></div>
              </dl>
              <div className="bbva-form-actions">
                <button className="bbva-btn-gray" onClick={() => setPaso('form')} disabled={pagando}>Volver</button>
                <button className="bbva-btn" onClick={confirmar} disabled={pagando}>
                  <ShieldCheck size={18} /> {pagando ? 'Procesando…' : 'Confirmar pago'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={irAConfirmar}>
              {errServ && <Alert tipo="error">{errServ}</Alert>}
              {validacion && <Alert tipo="warn">{validacion}</Alert>}

              <label className="hb-field-label">Empresa / servicio</label>
              <div className="bbva-serv-grid">
                {servicios.map((s) => {
                  const meta = ICONOS[s.codservicio] || { icon: FileText, color: '#6b6b7b' }
                  const Icon = meta.icon
                  return (
                    <button type="button" key={s.codservicio}
                      className={`bbva-serv ${codservicio === s.codservicio ? 'sel' : ''}`}
                      onClick={() => setCodservicio(s.codservicio)}>
                      <span className="bbva-serv-ico" style={{ background: `${meta.color}1a`, color: meta.color }}><Icon size={20} /></span>
                      <span><strong>{s.nombre}</strong><small>{s.codservicio}</small></span>
                    </button>
                  )
                })}
              </div>

              <div className="hb-grid-2" style={{ marginTop: 16 }}>
                <div className="hb-field">
                  <label htmlFor="suministro">N° de suministro / recibo</label>
                  <input id="suministro" className="hb-input" placeholder="Ej. 1234567890"
                    value={codsuministro} onChange={(e) => setCodsuministro(e.target.value)} />
                </div>
                <div className="hb-field">
                  <label htmlFor="monto">Monto a pagar (S/)</label>
                  <input id="monto" className="hb-input" type="number" min="0.01" step="0.01"
                    placeholder="0.00" value={monto} onChange={(e) => setMonto(e.target.value)} />
                </div>
              </div>

              <div className="hb-field">
                <label htmlFor="origen">Cuenta de ahorro origen</label>
                <select id="origen" className="hb-select" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                  <option value="">— Seleccione una cuenta —</option>
                  {cuentas.map((c) => (
                    <option key={c.codcuentaahorro} value={c.codcuentaahorro}>
                      {c.codcuentaahorro} · {c.tipo} · {simboloMoneda(c.moneda)} {c.saldo}
                    </option>
                  ))}
                </select>
              </div>
              {cuentaOrigen && (
                <p className="bbva-saldo-hint">
                  Saldo disponible: <Money value={cuentaOrigen.saldo} simbolo={simbolo} />
                  {saldoInsuficiente && <span style={{ color: 'var(--hb-red)', fontWeight: 600 }}> · saldo insuficiente</span>}
                </p>
              )}

              <button type="submit" className="bbva-btn" disabled={cuentas.length === 0 || saldoInsuficiente}>
                Continuar <ArrowRight size={18} />
              </button>
            </form>
          )}
        </Card>
      )}
    </PageLayout>
  )
}
