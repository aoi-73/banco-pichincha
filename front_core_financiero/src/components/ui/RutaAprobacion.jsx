import { Check } from 'lucide-react'

const PASO_LABEL = {
  opinion_admin: 'Opinión Administrador',
  opinion_jefe_reg: 'Opinión Jefe Regional',
  opinion_riesgos: 'Opinión Riesgos',
  comite: 'Comité',
}

/**
 * Stepper de la ruta de aprobación (ruta_aprobacion.pasos del backend).
 * Muestra los pasos requeridos según monto/endeudamiento/calificación.
 */
export default function RutaAprobacion({ ruta }) {
  if (!ruta) return null
  const pasos = ruta.pasos || []

  return (
    <div>
      <div className="ruta-steps">
        {pasos.map((p, i) => (
          <div className="ruta-step" key={p}>
            <span className="ruta-step__dot">{i + 1}</span>
            <span className="ruta-step__label">{PASO_LABEL[p] || p}</span>
            {i < pasos.length - 1 && <span className="ruta-step__line" />}
          </div>
        ))}
      </div>
      <ul className="detalle-list" style={{ marginTop: 14 }}>
        <li>
          <span>Monto propuesto</span>
          <span>
            <strong>
              {Number(ruta.monto_propuesto).toLocaleString('es-PE', {
                style: 'currency',
                currency: 'PEN',
              })}
            </strong>
          </span>
        </li>
        <li>
          <span>Requiere opinión Administrador</span>
          <span>{ruta.requiere_opinion_admin ? <Check size={16} color="var(--c-verde)" /> : 'No'}</span>
        </li>
        <li>
          <span>Requiere opinión Jefe Regional</span>
          <span>{ruta.requiere_opinion_jefe_regional ? <Check size={16} color="var(--c-verde)" /> : 'No'}</span>
        </li>
        <li>
          <span>Requiere opinión Riesgos</span>
          <span>{ruta.requiere_opinion_riesgos ? <Check size={16} color="var(--c-verde)" /> : 'No'}</span>
        </li>
      </ul>
    </div>
  )
}
