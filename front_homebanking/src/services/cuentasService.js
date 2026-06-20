import hbApi from './hb_api.js'

// GET /cuentas/ahorro -> CuentaAhorroOut[]
export async function getCuentasAhorro() {
  const { data } = await hbApi.get('/cuentas/ahorro')
  return Array.isArray(data) ? data : []
}

// GET /cuentas/ahorro/{cod}/detalle -> DetalleAhorroResponse
// { codcuentaahorro, tipo, codtipo (AC|AP|PF|CT), plazo_fijo?, cts?, ahorro_programado?{...cronograma[]}, mensaje? }
export async function getDetalleAhorro(codcuentaahorro) {
  const { data } = await hbApi.get(`/cuentas/ahorro/${encodeURIComponent(codcuentaahorro)}/detalle`)
  return data
}

// GET /cuentas/ahorro/{cod}/movimientos?limit=50 -> MovimientoOut[]
export async function getMovimientos(codcuentaahorro, limit = 50) {
  const { data } = await hbApi.get(
    `/cuentas/ahorro/${encodeURIComponent(codcuentaahorro)}/movimientos`,
    { params: { limit } },
  )
  return Array.isArray(data) ? data : []
}

// GET /cuentas/credito -> CuentaCreditoOut[]
export async function getCuentasCredito() {
  const { data } = await hbApi.get('/cuentas/credito')
  return Array.isArray(data) ? data : []
}

// GET /cuentas/credito/{cod}/cuotas -> CuotaOut[]
export async function getCuotas(codcuentacredito) {
  const { data } = await hbApi.get(
    `/cuentas/credito/${encodeURIComponent(codcuentacredito)}/cuotas`,
  )
  return Array.isArray(data) ? data : []
}
