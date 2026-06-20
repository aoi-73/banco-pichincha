import api from './svc_api.js'

/**
 * GET /dashboard/kpis?periodomes=
 * @returns {Promise<import('../types/dashboard.types.js').KpisOut>}
 */
export async function getKpis(periodomes) {
  const { data } = await api.get('/dashboard/kpis', { params: { periodomes } })
  return data
}

/**
 * GET /dashboard/productividad-asesores?periodomes=&codagencia=
 * @returns {Promise<import('../types/dashboard.types.js').ProductividadAsesor[]>}
 */
export async function getProductividad(periodomes, codagencia) {
  const { data } = await api.get('/dashboard/productividad-asesores', {
    params: { periodomes, codagencia },
  })
  return data
}

/**
 * GET /dashboard/evolucion-historica
 * @returns {Promise<import('../types/dashboard.types.js').EvolucionHistorica[]>}
 */
export async function getEvolucionHistorica() {
  const { data } = await api.get('/dashboard/evolucion-historica')
  return data
}

/**
 * GET /dashboard/desembolsos?periodomes= (yyyymm = mes de la fecha de desembolso).
 * @returns {Promise<{periodo:number, anio:number,
 *   mes:{n_creditos:number, volumen:number, ticket_promedio:number},
 *   anual:{n_creditos:number, volumen:number, ticket_promedio:number},
 *   por_oficina:{codagencia:string, desagencia:string, deszonacomercial:string, n_creditos:number, volumen:number}[],
 *   por_zona:{codzonacomercial:string, deszonacomercial:string, n_creditos:number, volumen:number}[]}>}
 */
export async function getDesembolsos(periodomes) {
  const { data } = await api.get('/dashboard/desembolsos', { params: { periodomes } })
  return data
}
