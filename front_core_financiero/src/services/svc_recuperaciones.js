import api from './svc_api.js'

/**
 * Servicio del módulo de Recuperaciones / Mora. Todas las rutas requieren JWT,
 * que el interceptor de svc_api inyecta automáticamente.
 */

/**
 * GET /recuperaciones/resumen — KPIs de cartera por banda de mora.
 * @returns {Promise<{total:number, en_mora:number,
 *   por_banda:{banda:string, n_creditos:number, saldo:number, saldo_vencido:number}[]}>}
 */
export async function getResumenMora() {
  const { data } = await api.get('/recuperaciones/resumen')
  return data
}

/**
 * GET /recuperaciones/cartera?banda=&limit=&offset= — créditos en mora.
 * @param {{banda?:string, limit?:number, offset?:number}} [params]
 */
export async function getCarteraMora(params) {
  const { data } = await api.get('/recuperaciones/cartera', { params })
  return data
}

/**
 * GET /recuperaciones/tipos-gestion — catálogo de tipos de gestión de cobranza.
 * @returns {Promise<{pktipogestion:number, codtipogestion:string, destipogestion:string}[]>}
 */
export async function getTiposGestion() {
  const { data } = await api.get('/recuperaciones/tipos-gestion')
  return data
}

/**
 * POST /recuperaciones/creditos/{cod}/gestion — registra una gestión de cobranza.
 * @param {string} cod
 * @param {{codtipogestion:string, resultado?:string, compromiso_pago?:string, monto_comprometido?:number}} body
 */
export async function registrarGestion(cod, body) {
  const { data } = await api.post(`/recuperaciones/creditos/${cod}/gestion`, body)
  return data
}

/**
 * GET /recuperaciones/creditos/{cod}/gestiones — historial de gestiones de un crédito.
 */
export async function getGestiones(cod) {
  const { data } = await api.get(`/recuperaciones/creditos/${cod}/gestiones`)
  return data
}

/**
 * POST /recuperaciones/creditos/{cod}/judicial — deriva a cobranza judicial (>=121 días).
 * @param {string} cod
 * @param {boolean} [forzar] salta el umbral de días (uso excepcional)
 * @returns {Promise<{codcuentacredito:string, estado:string, dias_atraso:number, fecha_ingreso_judicial:string}>}
 */
export async function pasarJudicial(cod, forzar = false) {
  const { data } = await api.post(`/recuperaciones/creditos/${cod}/judicial`, { forzar })
  return data
}

/**
 * POST /recuperaciones/creditos/{cod}/castigar — castigo contable del crédito (>180 días).
 * @param {string} cod
 * @param {boolean} [forzar] salta el umbral de días (uso excepcional)
 * @returns {Promise<{codcuentacredito:string, estado:string, dias_atraso:number}>}
 */
export async function castigarCredito(cod, forzar = false) {
  const { data } = await api.post(`/recuperaciones/creditos/${cod}/castigar`, { forzar })
  return data
}
