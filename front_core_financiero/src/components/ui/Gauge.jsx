/**
 * Medidor semicircular de cumplimiento (0–100%+) con zonas de color
 * según el semáforo de metas: ≥90 verde · 70–89 ámbar · <70 rojo.
 *
 * @param {{value:number, sublabel?:string}} props  value = % de cumplimiento
 */
export default function Gauge({ value = 0, sublabel }) {
  const v = Math.max(0, value)
  const color = v >= 90 ? '#16a34a' : v >= 70 ? '#d97706' : '#dc2626'

  const R = 80
  const len = Math.PI * R // longitud del semicírculo
  const frac = Math.min(v, 100) / 100

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="220" height="132" viewBox="0 0 200 120">
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#eef2f7" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - frac)}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x="100" y="92" textAnchor="middle" fontSize="34" fontWeight="800" fill={color}>
          {Math.round(v)}%
        </text>
      </svg>
      {sublabel && <div style={{ color: 'var(--c-text-soft, #6b6b7b)', fontSize: 13, marginTop: 4 }}>{sublabel}</div>}
    </div>
  )
}
