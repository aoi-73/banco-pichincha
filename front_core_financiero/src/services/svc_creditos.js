import api from './svc_api.js'

/**
 * GET /creditos/cartera?pkasesor=&periodomes=
 * @returns {Promise<import('../types/credito.types.js').CreditoResumen[]>}
 */
export async function getCartera(pkasesor, periodomes) {
  const { data } = await api.get('/creditos/cartera', {
    params: { pkasesor, periodomes },
  })
  return data
}

/**
 * GET /creditos/{codcuentacredito}
 * @returns {Promise<import('../types/credito.types.js').CreditoDetalle>}
 */
export async function getCreditoDetalle(codcuentacredito) {
  const { data } = await api.get(`/creditos/${codcuentacredito}`)
  return data
}

/**
 * GET /creditos/{codcuentacredito}/cronograma
 * @returns {Promise<import('../types/credito.types.js').CuotaCronograma[]>}
 */
export async function getCronograma(codcuentacredito) {
  const { data } = await api.get(`/creditos/${codcuentacredito}/cronograma`)
  return data
}

/**
 * GET /creditos/productos — catálogo dinámico de tipos de crédito (ME/PE/CO).
 * @returns {Promise<{productos:{codtipocredito:string, descripcion:string, segmento:string}[],
 *   por_segmento:Record<string,{codtipocredito:string, descripcion:string, segmento:string}[]>}>}
 */
export async function getProductos() {
  const { data } = await api.get('/creditos/productos')
  return data
}
