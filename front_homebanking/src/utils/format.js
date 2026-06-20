// Utilidades de formato para el Homebanking.
// El backend devuelve montos como strings (p.ej. "7071.3800") y fechas ISO "yyyy-mm-dd".

/**
 * Formatea un monto a moneda peruana: "S/ 1,234.56".
 * Acepta number o string; si no es parseable devuelve "S/ 0.00".
 */
export function formatMoney(value, { simbolo = 'S/' } = {}) {
  const n = toNumber(value)
  const formatted = n.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${simbolo} ${formatted}`
}

/** Devuelve el símbolo de moneda según el texto del backend ("Soles" / "Dólares"). */
export function simboloMoneda(moneda) {
  if (!moneda) return 'S/'
  const m = String(moneda).toLowerCase()
  if (m.includes('dol') || m.includes('dól') || m === 'usd' || m.includes('us$')) return 'US$'
  return 'S/'
}

/** Convierte un valor string/number a Number de forma segura. */
export function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value
  const n = parseFloat(String(value).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

/**
 * Formatea una fecha ISO ("2022-10-31") o Date a "dd/mm/yyyy".
 * Si no es válida devuelve "—".
 */
export function formatDate(value) {
  if (!value) return '—'
  // La forma "yyyy-mm-dd" se parsea sin zona horaria para evitar corrimientos.
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]}`
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

/** Formatea una TEA (string/number) como porcentaje: "1.82%". */
export function formatTEA(value) {
  if (value === null || value === undefined || value === '') return '—'
  const n = toNumber(value)
  return `${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

/**
 * Extrae un mensaje de error legible de una respuesta de axios.
 * El backend puede responder:
 *   - { detail: "texto" }                          (401 / 403 / negocio)
 *   - { detail: [ { msg, loc }, ... ] }            (422 validación de FastAPI)
 *   - { detail: { error, elegibilidad } }          (crédito no apto)
 */
export function extractError(err, fallback = 'Ocurrió un error. Intente nuevamente.') {
  const detail = err?.response?.data?.detail
  if (detail == null) {
    if (err?.message === 'Network Error') {
      return 'No se pudo conectar con el servidor. Verifique que el backend esté activo.'
    }
    return err?.message || fallback
  }
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((d) => d?.msg || 'Dato inválido').join(' · ')
  }
  if (typeof detail === 'object') {
    // Caso elegibilidad de crédito
    if (detail.error || detail.elegibilidad) {
      const motivo = detail.elegibilidad?.motivo || detail.elegibilidad
      const base = detail.error || 'No es posible procesar la solicitud.'
      if (typeof motivo === 'string' && motivo) return `${base} ${motivo}`
      return base
    }
    return JSON.stringify(detail)
  }
  return fallback
}
