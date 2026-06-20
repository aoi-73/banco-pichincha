import api from './svc_api.js'

/**
 * GET /clientes/{codcliente}
 * @returns {Promise<Object>} ClienteOut
 */
export async function getCliente(codcliente) {
  const { data } = await api.get(`/clientes/${codcliente}`)
  return data
}
