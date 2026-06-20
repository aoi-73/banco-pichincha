/** Formatea un número como moneda en soles (PEN). */
export function money(v) {
  const n = Number(v)
  if (Number.isNaN(n)) return '—'
  return n.toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Formatea un número con separador de miles. */
export function num(v) {
  const n = Number(v)
  if (Number.isNaN(n)) return '—'
  return n.toLocaleString('es-PE')
}

/** Formatea un porcentaje (recibe el valor ya en escala 0–100). */
export function pct(v, dec = 1) {
  const n = Number(v)
  if (Number.isNaN(n)) return '—'
  return `${n.toFixed(dec)}%`
}

/** Formatea una fecha ISO (yyyy-mm-dd) como dd/mm/yyyy. Tolera nulos. */
export function fecha(v) {
  if (!v) return '—'
  const m = String(v).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return String(v)
  return `${m[3]}/${m[2]}/${m[1]}`
}
