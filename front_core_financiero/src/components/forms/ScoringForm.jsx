import { useState } from 'react'
import { useProductos } from '../../hooks/useProductos.js'

const VACIO = {
  codcliente: '',
  montosolicitud: '',
  plazo: '',
  codtipocredito: 'ME',
  montoingresoneto: '',
  codactividadeconomica: '',
  codasesor: '',
}

/**
 * Formulario de 7 campos del motor de scoring (ScoringIn).
 * Convierte los numéricos antes de delegar a onSubmit.
 */
export default function ScoringForm({ onSubmit, loading, codasesorDefault }) {
  const [form, setForm] = useState({
    ...VACIO,
    codasesor: codasesorDefault ?? '',
  })
  // Catálogo de tipos de crédito desde el backend (GET /creditos/productos).
  const { productos, loading: loadingProductos } = useProductos()

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // codcliente / codasesor / codactividadeconomica son strings en el backend;
    // solo monto y plazo son numéricos.
    onSubmit({
      codcliente: String(form.codcliente).trim(),
      montosolicitud: Number(form.montosolicitud),
      plazo: Number(form.plazo),
      codtipocredito: form.codtipocredito,
      montoingresoneto: Number(form.montoingresoneto),
      codactividadeconomica: String(form.codactividadeconomica).trim(),
      codasesor: String(form.codasesor).trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label>Código de cliente</label>
          <input
            type="text"
            value={form.codcliente}
            onChange={(e) => set('codcliente', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Monto solicitado</label>
          <input
            type="number"
            step="0.01"
            value={form.montosolicitud}
            onChange={(e) => set('montosolicitud', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Plazo (meses)</label>
          <input
            type="number"
            value={form.plazo}
            onChange={(e) => set('plazo', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Tipo de crédito</label>
          <select
            value={form.codtipocredito}
            onChange={(e) => set('codtipocredito', e.target.value)}
            disabled={loadingProductos}
          >
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
          <label>Ingreso neto mensual</label>
          <input
            type="number"
            step="0.01"
            value={form.montoingresoneto}
            onChange={(e) => set('montoingresoneto', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Actividad económica (CIIU)</label>
          <input
            type="text"
            value={form.codactividadeconomica}
            onChange={(e) => set('codactividadeconomica', e.target.value)}
            placeholder="Ej. 4711"
            required
          />
        </div>
        <div className="field">
          <label>Código de asesor</label>
          <input
            type="text"
            value={form.codasesor}
            onChange={(e) => set('codasesor', e.target.value)}
            required
          />
        </div>
      </div>

      <button className="btn" type="submit" disabled={loading} style={{ marginTop: 20 }}>
        {loading ? 'Evaluando…' : 'Evaluar solicitud'}
      </button>
    </form>
  )
}
