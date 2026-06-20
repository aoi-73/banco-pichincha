import hbApi from './hb_api.js'

// POST /operaciones/transferencia { cuenta_origen, cuenta_destino, monto } -> TransferenciaResponse
export async function transferir({ cuenta_origen, cuenta_destino, monto }) {
  const { data } = await hbApi.post('/operaciones/transferencia', {
    cuenta_origen,
    cuenta_destino,
    monto,
  })
  return data
}

/**
 * POST /operaciones/pago-cuota
 * body: { codcuentacredito, monto?, cuenta_origen? }
 *   - monto omitido  -> paga la cuota completa.
 *   - cuenta_origen  -> cuenta de ahorro propia de la que se DEBITA el pago.
 * resp: { mensaje, codcuentacredito, nrocuota, monto_pagado, pkoperacion,
 *         cuenta_origen, pkoperacion_debito_ahorro, codkardex }
 */
export async function pagarCuota({ codcuentacredito, monto, cuenta_origen }) {
  const body = { codcuentacredito }
  if (monto !== undefined && monto !== null && monto !== '') body.monto = monto
  if (cuenta_origen) body.cuenta_origen = cuenta_origen
  const { data } = await hbApi.post('/operaciones/pago-cuota', body)
  return data
}

// GET /operaciones/servicios -> [{ codservicio, nombre }]
export async function getServicios() {
  const { data } = await hbApi.get('/operaciones/servicios')
  return Array.isArray(data) ? data : []
}

/**
 * POST /operaciones/pago-servicio
 * body: { cuenta_origen, codservicio, codsuministro, monto }
 * resp: { mensaje, servicio, codsuministro, cuenta_origen, monto, pkoperacion, codkardex }
 */
export async function pagarServicio({ cuenta_origen, codservicio, codsuministro, monto }) {
  const { data } = await hbApi.post('/operaciones/pago-servicio', {
    cuenta_origen,
    codservicio,
    codsuministro,
    monto,
  })
  return data
}
