import hbApi from './hb_api.js'

/**
 * POST /creditos/solicitar -> SolicitudCreditoResponse
 * Body: { montosolicitud, plazo, codtipocredito (ME|CO), codactividadeconomica, montoingresoneto }
 * Puede responder 422 con detail = { error, elegibilidad } cuando el cliente no es apto.
 */
export async function solicitarCredito(payload) {
  const { data } = await hbApi.post('/creditos/solicitar', payload)
  return data
}
