import { useState } from 'react'
import { useProductos } from '../../hooks/useProductos.js'

const VACIO = {
  codcliente: '',
  codtipocredito: 'ME',
  montosolicitud: '',
  plazo: '',
  montoingresoneto: '',
  codactividadeconomica: '',
  codasesor: '',
  // Datos opcionales de centrales de riesgo
  endeudamiento_global: '',
  cuotas_sistema_financiero: '',
  n_entidades: '',
  gastos_familiares: '',
  es_recurrente: false,
}

// Convierte un campo opcional a número o null si está vacío.
const opt = (v) => (v === '' || v === null ? null : Number(v))

/**
 * Formulario de creación de solicitud de crédito (SolicitudIn).
 * Los datos de centrales de riesgo son opcionales (mejoran el RDS y la ruta).
 */
export default function SolicitudForm({ onSubmit, loading, codasesorDefault }) {
  const [form, setForm] = useState({ ...VACIO, codasesor: codasesorDefault ?? '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  // Catálogo de tipos de crédito desde el backend (GET /creditos/productos).
  const { productos, loading: loadingProductos } = useProductos()

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      codcliente: String(form.codcliente).trim(),
      montosolicitud: Number(form.montosolicitud),
      plazo: Number(form.plazo),
      codtipocredito: form.codtipocredito,
      codactividadeconomica: String(form.codactividadeconomica).trim(),
      montoingresoneto: Number(form.montoingresoneto),
      codasesor: String(form.codasesor).trim(),
      endeudamiento_global: opt(form.endeudamiento_global),
      cuotas_sistema_financiero: opt(form.cuotas_sistema_financiero),
      n_entidades: opt(form.n_entidades),
      gastos_familiares: opt(form.gastos_familiares),
      es_recurrente: form.es_recurrente,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4 style={{ marginTop: 0 }}>Datos de la solicitud</h4>
      <div className="form-grid">
        <div className="field">
          <label>Código de cliente</label>
          <input type="text" value={form.codcliente} onChange={(e) => set('codcliente', e.target.value)} required />
        </div>
        <div className="field">
          <label>Tipo de crédito</label>
          <select value={form.codtipocredito} onChange={(e) => set('codtipocredito', e.target.value)} disabled={loadingProductos}>
            {loadingProductos ? (
              <option>Cargando…</option>
            ) : (
              productos.map((p) => (
                <option key={p.codtipocredito} value={p.codtipocredito}>
                  {p.descripcion}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="field">
          <label>Monto solicitado</label>
          <input type="number" step="0.01" value={form.montosolicitud} onChange={(e) => set('montosolicitud', e.target.value)} required />
        </div>
        <div className="field">
          <label>Plazo (meses)</label>
          <input type="number" value={form.plazo} onChange={(e) => set('plazo', e.target.value)} required />
        </div>
        <div className="field">
          <label>Ingreso neto mensual</label>
          <input type="number" step="0.01" value={form.montoingresoneto} onChange={(e) => set('montoingresoneto', e.target.value)} required />
        </div>
        <div className="field">
          <label>Actividad económica (CIIU)</label>
          <input type="text" value={form.codactividadeconomica} onChange={(e) => set('codactividadeconomica', e.target.value)} placeholder="Ej. 4711" required />
        </div>
        <div className="field">
          <label>Código de asesor</label>
          <input type="text" value={form.codasesor} onChange={(e) => set('codasesor', e.target.value)} required />
        </div>
      </div>

      <h4>Centrales de riesgo (opcional)</h4>
      <p className="page-subtitle" style={{ marginTop: 0 }}>
        No están en la BD del core. Mejoran el cálculo del RDS y la ruta de aprobación.
      </p>
      <div className="form-grid">
        <div className="field">
          <label>Endeudamiento global</label>
          <input type="number" step="0.01" value={form.endeudamiento_global} onChange={(e) => set('endeudamiento_global', e.target.value)} />
        </div>
        <div className="field">
          <label>Cuotas en otras entidades</label>
          <input type="number" step="0.01" value={form.cuotas_sistema_financiero} onChange={(e) => set('cuotas_sistema_financiero', e.target.value)} />
        </div>
        <div className="field">
          <label>N.º de entidades</label>
          <input type="number" value={form.n_entidades} onChange={(e) => set('n_entidades', e.target.value)} />
        </div>
        <div className="field">
          <label>Gastos familiares</label>
          <input type="number" step="0.01" value={form.gastos_familiares} onChange={(e) => set('gastos_familiares', e.target.value)} />
        </div>
        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.es_recurrente} onChange={(e) => set('es_recurrente', e.target.checked)} style={{ width: 'auto' }} />
            Cliente recurrente
          </label>
        </div>
      </div>

      <button className="btn" type="submit" disabled={loading} style={{ marginTop: 20 }}>
        {loading ? 'Evaluando…' : 'Crear solicitud'}
      </button>
    </form>
  )
}
