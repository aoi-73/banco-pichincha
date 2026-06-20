import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus2, ArrowLeft, Clock } from 'lucide-react'
import { useSolicitudCredito } from '../hooks/useOperaciones.js'
import { toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

// Actividades económicas (CIIU) que EXISTEN en dactividadeconomica de la BD.
// Usar un código inexistente hace que el backend responda 400 "no encontrada".
const ACTIVIDADES = [
  { cod: '0111', label: '0111 — Cultivo de cereales (excepto arroz)' },
  { cod: '4711', label: '4711 — Comercio minorista (bodega/abarrotes)' },
  { cod: '4771', label: '4771 — Comercio minorista de prendas de vestir' },
  { cod: '4520', label: '4520 — Mantenimiento y reparación de vehículos' },
  { cod: '5610', label: '5610 — Restaurantes y servicio de comidas' },
  { cod: '4100', label: '4100 — Construcción de edificios' },
  { cod: '4923', label: '4923 — Transporte de carga por carretera' },
  { cod: '9601', label: '9601 — Lavado y limpieza de prendas' },
]

export default function SolicitarCreditoPage() {
  const navigate = useNavigate()
  const { run, loading, error, result, reset } = useSolicitudCredito()
  const [validacion, setValidacion] = useState(null)

  const [form, setForm] = useState({
    montosolicitud: '',
    plazo: '',
    codtipocredito: 'CO',
    codactividadeconomica: '0111',
    montoingresoneto: '',
  })

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setValidacion(null)

    const monto = toNumber(form.montosolicitud)
    const plazo = parseInt(form.plazo, 10)
    const ingreso = toNumber(form.montoingresoneto)

    if (monto <= 0) { setValidacion('Ingrese un monto de solicitud válido.'); return }
    if (!plazo || plazo <= 0) { setValidacion('Ingrese un plazo (número de cuotas) válido.'); return }
    if (ingreso <= 0) { setValidacion('Ingrese su ingreso neto mensual.'); return }
    if (!form.codactividadeconomica) { setValidacion('Seleccione una actividad económica.'); return }

    try {
      await run({
        montosolicitud: monto,
        plazo,
        codtipocredito: form.codtipocredito,
        codactividadeconomica: form.codactividadeconomica,
        montoingresoneto: ingreso,
      })
    } catch {
      /* mensaje de elegibilidad se muestra vía `error` */
    }
  }

  const nuevaSolicitud = () => {
    reset()
    setForm({ montosolicitud: '', plazo: '', codtipocredito: 'CO', codactividadeconomica: '0111', montoingresoneto: '' })
  }

  return (
    <PageLayout>
      <button className="hb-back" onClick={() => navigate('/operaciones')}>
        <ArrowLeft size={16} /> Volver a Operaciones
      </button>
      <h1 className="bbva-page-title">Solicitud de Crédito — Producto Digital</h1>
      <p className="bbva-page-sub">Operaciones › Solicitar préstamo</p>

      {result ? (
        <Card>
          <div className="hb-comprobante">
            <h3>Solicitud registrada</h3>
            <p style={{ marginTop: 0 }}>{result.mensaje}</p>
            <dl className="hb-dl">
              <div><dt>Código de solicitud</dt><dd>{result.codsolicitud}</dd></div>
              <div><dt>Estado</dt><dd><Badge estado={result.estado} /></dd></div>
              <div><dt>Monto solicitado</dt><dd><Money value={result.montosolicitud} /></dd></div>
              <div><dt>Plazo</dt><dd>{result.plazo} cuotas</dd></div>
            </dl>
            <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--hb-amber)', fontSize: 13, marginBottom: 0 }}>
              <Clock size={15} /> Su solicitud pasará por evaluación del banco (core financiero). Le notificaremos el resultado.
            </p>
          </div>
          <div className="bbva-form-actions">
            <button className="bbva-btn-gray" onClick={nuevaSolicitud}>Nueva solicitud</button>
            <button className="bbva-btn" onClick={() => navigate('/inicio')}>Ir al inicio</button>
          </div>
        </Card>
      ) : (
        <Card title="Datos de la solicitud" icon={<FilePlus2 size={18} />}>
          {error && <Alert tipo="error">{error}</Alert>}
          {validacion && <Alert tipo="warn">{validacion}</Alert>}

          <form onSubmit={onSubmit}>
            <div className="hb-grid-2">
              <div className="hb-field">
                <label htmlFor="monto">Monto solicitado (S/)</label>
                <input id="monto" className="hb-input" type="number" min="1" step="0.01"
                  placeholder="0.00" value={form.montosolicitud} onChange={setF('montosolicitud')} />
              </div>
              <div className="hb-field">
                <label htmlFor="plazo">Plazo (n° de cuotas / meses)</label>
                <input id="plazo" className="hb-input" type="number" min="1" step="1"
                  placeholder="12" value={form.plazo} onChange={setF('plazo')} />
              </div>
            </div>

            <div className="hb-grid-2">
              <div className="hb-field">
                <label htmlFor="tipo">Tipo de crédito</label>
                <select id="tipo" className="hb-select" value={form.codtipocredito} onChange={setF('codtipocredito')}>
                  <option value="CO">CO — Consumo</option>
                  <option value="ME">ME — Microempresa</option>
                </select>
              </div>
              <div className="hb-field">
                <label htmlFor="ingreso">Ingreso neto mensual (S/)</label>
                <input id="ingreso" className="hb-input" type="number" min="0" step="0.01"
                  placeholder="0.00" value={form.montoingresoneto} onChange={setF('montoingresoneto')} />
              </div>
            </div>

            <div className="hb-field">
              <label htmlFor="actividad">Actividad económica (CIIU)</label>
              <select id="actividad" className="hb-select" value={form.codactividadeconomica} onChange={setF('codactividadeconomica')}>
                {ACTIVIDADES.map((a) => (
                  <option key={a.cod} value={a.cod}>{a.label}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bbva-btn" disabled={loading}>
              <FilePlus2 size={18} />
              {loading ? 'Enviando solicitud…' : 'Enviar solicitud'}
            </button>
          </form>
        </Card>
      )}
    </PageLayout>
  )
}
