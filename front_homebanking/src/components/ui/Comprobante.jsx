import { CheckCircle2, Printer } from 'lucide-react'

/**
 * Tarjeta de comprobante tras una operación.
 * filas: [{ label, value }]   (value puede ser texto o <Money/>)
 * acciones: [{ label, onClick, primary? }]
 */
export default function Comprobante({ titulo = 'Operación exitosa', mensaje, filas = [], nota, simulado = false, acciones = [] }) {
  return (
    <div className="bbva-comprobante">
      <div className="bbva-comprobante-card">
        <div className="bbva-comprobante-head">
          <span className="bbva-comprobante-check"><CheckCircle2 size={30} /></span>
          <div>
            <h3>{titulo}</h3>
            {mensaje && <p>{mensaje}</p>}
          </div>
          <button className="bbva-print" onClick={() => window.print()} title="Imprimir">
            <Printer size={18} />
          </button>
        </div>

        {simulado && (
          <div className="bbva-comprobante-sim">Operación simulada (el endpoint aún no existe en el backend).</div>
        )}

        <dl className="bbva-comprobante-rows">
          {filas.map((f, i) => (
            <div key={i}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {nota && <p className="bbva-comprobante-nota">{nota}</p>}
      </div>

      {acciones.length > 0 && (
        <div className="bbva-form-actions">
          {acciones.map((a, i) => (
            <button key={i} className={a.primary ? 'bbva-btn' : 'bbva-btn-gray'} onClick={a.onClick}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
