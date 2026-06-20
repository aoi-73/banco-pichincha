import api from './svc_api.js'

/**
 * GET /ahorros/resumen-agencia/{codagencia}?periodomes=
 * @returns {Promise<import('../types/ahorro.types.js').ResumenAhorroTipo[]>}
 */
export async function getResumenAgencia(codagencia, periodomes) {
  const { data } = await api.get(`/ahorros/resumen-agencia/${codagencia}`, {
    params: { periodomes },
  })
  return data
}

/**
 * GET /ahorros/cliente/{codcliente}?periodomes=
 * @returns {Promise<import('../types/ahorro.types.js').CuentaAhorroOut[]>}
 */
export async function getCuentasCliente(codcliente, periodomes) {
  const { data } = await api.get(`/ahorros/cliente/${codcliente}`, {
    params: { periodomes },
  })
  return data
}

/**
 * GET /ahorros/{codcuentaahorro}?periodomes=
 * @returns {Promise<import('../types/ahorro.types.js').CuentaAhorroOut>}
 */
export async function getCuentaDetalle(codcuentaahorro, periodomes) {
  const { data } = await api.get(`/ahorros/${codcuentaahorro}`, {
    params: { periodomes },
  })
  return data
}
