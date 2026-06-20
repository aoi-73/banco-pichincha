import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

/**
 * Gráfico de línea genérico, con línea de referencia opcional.
 * data: [{ [xKey]: ..., [yKey]: number }]
 */
export default function GraficoLinea({
  data = [],
  xKey = 'periodomes',
  yKey = 'valor',
  color = '#0F265C',
  refY = null,
  refLabel,
  sufijo = '',
}) {
  if (!data.length) {
    return <p className="page-subtitle">Sin datos para graficar.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey={xKey} fontSize={11} />
        <YAxis fontSize={11} tickFormatter={(v) => `${v}${sufijo}`} />
        <Tooltip formatter={(v) => `${v}${sufijo}`} />
        {refY != null && (
          <ReferenceLine
            y={refY}
            stroke="#dc2626"
            strokeDasharray="5 5"
            label={{ value: refLabel, position: 'insideTopRight', fontSize: 11, fill: '#dc2626' }}
          />
        )}
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
