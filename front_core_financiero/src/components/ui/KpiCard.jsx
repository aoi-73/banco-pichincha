/**
 * Tarjeta de indicador. valor + label + color de borde opcional.
 */
export default function KpiCard({ label, valor, color, sufijo = '' }) {
  return (
    <div className="kpi-card" style={color ? { borderLeftColor: color } : undefined}>
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value" style={color ? { color } : undefined}>
        {valor}
        {sufijo}
      </div>
    </div>
  )
}
