import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Receipt, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCreditos, useCuotas } from '../hooks/useCreditos.js'
import { useCuentas } from '../hooks/useCuentas.js'
import { usePagoCuota } from '../hooks/useOperaciones.js'
import { formatDate, toNumber, simboloMoneda } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import Comprobante from '../components/ui/Comprobante.jsx'

export default function PagoCreditoPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const { creditos, loading: lc } = useCreditos()
  const { cuentas, loading: lca, recargar: recargarCuentas } = useCuentas('ahorro')

  const [credito, setCredito] = useState(cod || '')
  const [origen, setOrigen] = useState('')
  const [monto, setMonto] = useState('')
  const [paso, setPaso] = useState('form')
  const [validacion, setValidacion] = useState(null)

  useEffect(() => {
    if (!credito && creditos.length === 1) setCredito(creditos[0].codcuentacredito)
  }, [creditos, credito])
  useEffect(() => {
    if (!origen && cuentas.length === 1) setOrigen(cuentas[0].codcuentaahorro)
  }, [cuentas, origen])

  const { cuotas, loading: lq, recargar: recargarCuotas } = useCuotas(credito)
  const { run, loading: pagando, error, result, reset } = usePagoCuota()

  const proxima = cuotas.find((c) => !c.pagada)
  const cuentaOrigen = cuentas.find((c) => c.codcuentaahorro === origen)
  const simbolo = cuentaOrigen ? simboloMoneda(cuentaOrigen.moneda) : 'S/'

  // El monto por defecto es el de la cuota; el usuario puede editarlo.
  useEffect(() => {
    setMonto(proxima ? String(toNumber(proxima.monto_cuota)) : '')
  }, [proxima?.nrocuota, credito]) // eslint-disable-line react-hooks/exhaustive-deps

  // Monto que efectivamente se cobrará (si está vacío => cuota completa).
  const montoAPagar = monto === '' ? toNumber(proxima?.monto_cuota) : toNumber(monto)
  const saldoInsuficiente = cuentaOrigen && montoAPagar > toNumber(cuentaOrigen.saldo)

  const validar = () => {
    if (!credito) return 'Seleccione el crédito a pagar.'
    if (!origen) return 'Seleccione la cuenta de ahorro de la que se debitará el pago.'
    if (!proxima) return 'Este crédito no tiene cuotas pendientes.'
    if (monto !== '' && toNumber(monto) <= 0) return 'El monto debe ser mayor a cero.'
    if (saldoInsuficiente) return 'Saldo insuficiente en la cuenta de ahorro origen.'
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
      // Si el campo monto quedó vacío, no se envía => el backend paga la cuota completa.
      await run({ codcuentacredito: credito, cuenta_origen: origen, monto: monto === '' ? undefined : toNumber(monto) })
      recargarCuotas()
      recargarCuentas()
    } catch { /* error vía `error` */ }
  }

  const nuevo = () => { reset(); setPaso('form'); recargarCuotas(); recargarCuentas() }

  const cargando = lc || lca

  return (
    <PageLayout>
      <button className="hb-back" onClick={() => navigate('/operaciones')}>
        <ArrowLeft size={16} /> Volver a Operaciones
      </button>
      <h1 className="bbva-page-title">Pago de crédito desde cuenta de ahorro</h1>
      <p className="bbva-page-sub">Operaciones › Pago de crédito</p>

      {result ? (
        <Comprobante
          titulo="Pago realizado"
          mensaje={result.mensaje}
          filas={[
            { label: 'Crédito', value: result.codcuentacredito },
            { label: 'N° de cuota', value: result.nrocuota },
            { label: 'Monto pagado', value: <Money value={result.monto_pagado} /> },
            { label: 'Cuenta debitada', value: result.cuenta_origen || origen },
            { label: 'N° de operación', value: result.pkoperacion },
            { label: 'Op. débito ahorro', value: result.pkoperacion_debito_ahorro ?? '—' },
            { label: 'Kardex', value: result.codkardex },
          ]}
          acciones={[
            { label: 'Realizar otro pago', onClick: nuevo },
            { label: 'Ir al inicio', primary: true, onClick: () => navigate('/inicio') },
          ]}
        />
      ) : (
        <Card title="Pagar cuota" icon={<Receipt size={18} />}>
          {cargando ? (
            <Loader text="Cargando datos…" />
          ) : creditos.length === 0 ? (
            <Alert tipo="info">No registra créditos sobre los cuales pagar cuotas.</Alert>
          ) : paso === 'confirm' ? (
            <div className="bbva-confirm">
              <p className="bbva-confirm-lead">Confirma el pago de la cuota:</p>
              {error && <Alert tipo="error">{error}</Alert>}
              <dl className="hb-dl">
                <div><dt>Crédito</dt><dd>{credito}</dd></div>
                <div><dt>Cuenta a debitar</dt><dd>{origen} · {cuentaOrigen?.tipo}</dd></div>
                <div><dt>N° de cuota</dt><dd>{proxima?.nrocuota}</dd></div>
                <div><dt>Vencimiento</dt><dd>{formatDate(proxima?.fecha_vencimiento)}</dd></div>
                <div><dt>Monto a pagar</dt><dd><Money value={montoAPagar} simbolo={simbolo} /></dd></div>
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
              {validacion && <Alert tipo="warn">{validacion}</Alert>}

              <div className="hb-field">
                <label htmlFor="credito">Crédito a pagar</label>
                <select id="credito" className="hb-select" value={credito} onChange={(e) => setCredito(e.target.value)}>
                  <option value="">— Seleccione un crédito —</option>
                  {creditos.map((c) => (
                    <option key={c.codcuentacredito} value={c.codcuentacredito}>
                      {c.codcuentacredito} · pendiente {c.pago_pendiente}
                    </option>
                  ))}
                </select>
              </div>

              {credito && (
                lq ? <Loader text="Consultando próxima cuota…" /> : proxima ? (
                  <div className="bbva-cuota-box">
                    <span>Próxima cuota a pagar</span>
                    <strong>N° {proxima.nrocuota}</strong>
                    <span>vence {formatDate(proxima.fecha_vencimiento)}</span>
                    <Money value={proxima.monto_cuota} className="bbva-money-strong" />
                  </div>
                ) : (
                  <Alert tipo="success">Este crédito no tiene cuotas pendientes. ¡Está al día!</Alert>
                )
              )}

              <div className="hb-grid-2">
                <div className="hb-field">
                  <label htmlFor="origen">Cuenta de ahorro origen (se debita)</label>
                  <select id="origen" className="hb-select" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                    <option value="">— Seleccione una cuenta —</option>
                    {cuentas.map((c) => (
                      <option key={c.codcuentaahorro} value={c.codcuentaahorro}>
                        {c.codcuentaahorro} · {c.tipo} · {simboloMoneda(c.moneda)} {c.saldo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hb-field">
                  <label htmlFor="monto">Monto a pagar (S/) — vacío = cuota completa</label>
                  <input id="monto" className="hb-input" type="number" min="0" step="0.01"
                    placeholder={proxima ? String(toNumber(proxima.monto_cuota)) : '0.00'}
                    value={monto} onChange={(e) => setMonto(e.target.value)} />
                </div>
              </div>

              {cuentaOrigen && (
                <p className="bbva-saldo-hint">
                  Saldo disponible en origen: <Money value={cuentaOrigen.saldo} simbolo={simbolo} />
                  {saldoInsuficiente && <span style={{ color: 'var(--hb-red)', fontWeight: 600 }}> · saldo insuficiente</span>}
                </p>
              )}

              <button type="submit" className="bbva-btn" disabled={!proxima || saldoInsuficiente}>
                Continuar <ArrowRight size={18} />
              </button>
            </form>
          )}
        </Card>
      )}
    </PageLayout>
  )
}
