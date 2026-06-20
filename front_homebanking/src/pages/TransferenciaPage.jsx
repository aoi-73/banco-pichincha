import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { useTransferencia } from '../hooks/useOperaciones.js'
import { simboloMoneda, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import Comprobante from '../components/ui/Comprobante.jsx'

export default function TransferenciaPage() {
  const navigate = useNavigate()
  const { cuentas, loading } = useCuentas('ahorro')
  const { run, loading: enviando, error, result, reset } = useTransferencia()

  const [paso, setPaso] = useState('form') // form | confirm
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [monto, setMonto] = useState('')
  const [validacion, setValidacion] = useState(null)

  const cuentaOrigen = cuentas.find((c) => c.codcuentaahorro === origen)
  const cuentaDestino = cuentas.find((c) => c.codcuentaahorro === destino)
  const simbolo = cuentaOrigen ? simboloMoneda(cuentaOrigen.moneda) : 'S/'
  const destinos = useMemo(() => cuentas.filter((c) => c.codcuentaahorro !== origen), [cuentas, origen])

  const validar = () => {
    if (!origen || !destino) return 'Seleccione la cuenta de origen y destino.'
    if (origen === destino) return 'La cuenta de origen y destino no pueden ser la misma.'
    const m = toNumber(monto)
    if (m <= 0) return 'Ingrese un monto válido mayor a cero.'
    if (cuentaOrigen && m > toNumber(cuentaOrigen.saldo)) return 'El monto supera el saldo disponible de la cuenta de origen.'
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
      await run({ cuenta_origen: origen, cuenta_destino: destino, monto: toNumber(monto) })
    } catch { /* error mostrado vía `error` */ }
  }

  const nueva = () => {
    reset(); setPaso('form'); setMonto('')
  }

  return (
    <PageLayout>
      <button className="hb-back" onClick={() => navigate('/operaciones')}>
        <ArrowLeft size={16} /> Volver a Operaciones
      </button>
      <h1 className="bbva-page-title">Transferencias entre cuentas propias</h1>
      <p className="bbva-page-sub">Operaciones › Transferencias propias</p>

      {result ? (
        <Comprobante
          titulo="Transferencia exitosa"
          mensaje={result.mensaje}
          filas={[
            { label: 'Cuenta origen', value: result.cuenta_origen },
            { label: 'Cuenta destino', value: result.cuenta_destino },
            { label: 'Monto', value: <Money value={result.monto} simbolo={simbolo} /> },
            { label: 'Op. débito', value: result.pkoperacion_debito },
            { label: 'Op. crédito', value: result.pkoperacion_credito },
          ]}
          acciones={[
            { label: 'Nueva transferencia', onClick: nueva },
            { label: 'Ver mis cuentas', primary: true, onClick: () => navigate('/cuentas/ahorro') },
          ]}
        />
      ) : (
        <Card title="Datos de la transferencia" icon={<Send size={18} />}>
          {loading ? (
            <Loader text="Cargando sus cuentas…" />
          ) : cuentas.length < 2 ? (
            <Alert tipo="info">Necesita al menos dos cuentas de ahorro activas para transferir entre cuentas propias.</Alert>
          ) : paso === 'confirm' ? (
            <div className="bbva-confirm">
              <p className="bbva-confirm-lead">Revisa los datos antes de confirmar:</p>
              {error && <Alert tipo="error">{error}</Alert>}
              <dl className="hb-dl">
                <div><dt>Desde</dt><dd>{origen} · {cuentaOrigen?.tipo}</dd></div>
                <div><dt>Hacia</dt><dd>{destino} · {cuentaDestino?.tipo}</dd></div>
                <div><dt>Monto</dt><dd><Money value={monto} simbolo={simbolo} /></dd></div>
              </dl>
              <div className="bbva-form-actions">
                <button className="bbva-btn-gray" onClick={() => setPaso('form')} disabled={enviando}>Volver</button>
                <button className="bbva-btn" onClick={confirmar} disabled={enviando}>
                  <ShieldCheck size={18} /> {enviando ? 'Procesando…' : 'Confirmar transferencia'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={irAConfirmar}>
              {validacion && <Alert tipo="warn">{validacion}</Alert>}
              <div className="hb-grid-2">
                <div className="hb-field">
                  <label htmlFor="origen">Cuenta de origen</label>
                  <select id="origen" className="hb-select" value={origen}
                    onChange={(e) => { setOrigen(e.target.value); if (e.target.value === destino) setDestino('') }}>
                    <option value="">— Seleccione —</option>
                    {cuentas.map((c) => (
                      <option key={c.codcuentaahorro} value={c.codcuentaahorro}>
                        {c.codcuentaahorro} · {c.tipo} · {simboloMoneda(c.moneda)} {c.saldo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hb-field">
                  <label htmlFor="destino">Cuenta de destino</label>
                  <select id="destino" className="hb-select" value={destino}
                    onChange={(e) => setDestino(e.target.value)} disabled={!origen}>
                    <option value="">— Seleccione —</option>
                    {destinos.map((c) => (
                      <option key={c.codcuentaahorro} value={c.codcuentaahorro}>
                        {c.codcuentaahorro} · {c.tipo} · {simboloMoneda(c.moneda)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {cuentaOrigen && (
                <p className="bbva-saldo-hint">
                  Saldo disponible en origen: <Money value={cuentaOrigen.saldo} simbolo={simbolo} />
                </p>
              )}

              <div className="hb-field">
                <label htmlFor="monto">Monto a transferir ({simbolo})</label>
                <input id="monto" className="hb-input" type="number" min="0.01" step="0.01"
                  placeholder="0.00" value={monto} onChange={(e) => setMonto(e.target.value)} />
              </div>

              <button type="submit" className="bbva-btn">
                Continuar <ArrowRight size={18} />
              </button>
            </form>
          )}
        </Card>
      )}
    </PageLayout>
  )
}
