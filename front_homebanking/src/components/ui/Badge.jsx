// Badge de estado. Colorea automáticamente según el texto del estado.
export default function Badge({ estado, tone }) {
  const text = estado ?? '—'
  const variant = tone || toneFor(text)
  return <span className={`hb-badge hb-badge-${variant}`}>{text}</span>
}

function toneFor(estado) {
  const e = String(estado).toLowerCase()
  if (/(activa|activo|normal|vigente|al d[ií]a|pagad)/.test(e)) return 'green'
  if (/(bloque|cancelad|inactiv|cerrad|castig|mora|vencid|atras)/.test(e)) return 'red'
  if (/(evaluaci|pendiente|proceso|revisi)/.test(e)) return 'amber'
  return 'gray'
}
