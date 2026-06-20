/**
 * Medidor circular 0–100 del scoring crediticio.
 * Color según los umbrales de decisión del backend:
 *  ≥70 APROBADO (verde) · 50–69 OBSERVADO (ámbar) · <50 RECHAZADO (rojo)
 */
export default function ScoreGauge({ score = 0 }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0))
  const color =
    s >= 70 ? 'var(--c-verde)' : s >= 50 ? 'var(--c-amarillo)' : 'var(--c-rojo)'

  const size = 140
  const stroke = 12
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - s / 100)

  return (
    <div className="score-gauge">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--c-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="34"
          fontWeight="800"
          fill={color}
        >
          {s}
        </text>
      </svg>
      <span style={{ color: 'var(--c-text-soft)' }}>Score / 100</span>
    </div>
  )
}
