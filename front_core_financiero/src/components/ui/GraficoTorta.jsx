import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#0d3b66', '#1d7874', '#d97706', '#dc2626', '#6366f1']

/**
 * Gráfico de torta para distribución de cartera (vigente vs vencida)
 * o saldos de ahorro por tipo de cuenta.
 * data: [{ name, value }]
 */
export default function GraficoTorta({ data = [] }) {
  const limpio = data.filter((d) => Number(d.value) > 0)
  if (!limpio.length) {
    return <p className="page-subtitle">Sin datos para graficar.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={limpio}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(e) => e.name}
        >
          {limpio.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
