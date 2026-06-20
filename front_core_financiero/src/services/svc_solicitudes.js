import api from './svc_api.js'

/**
 * Servicio del flujo de solicitudes de crédito (todas las rutas bajo /creditos
 * requieren JWT, que el interceptor de svc_api inyecta automáticamente).
 */

/**
 * POST /creditos/solicitudes  — crear solicitud + pre-scoring + RDS + ruta.
 * @param {import('../types/solicitud.types.js').SolicitudIn} data
 * @returns {Promise<import('../types/solicitud.types.js').SolicitudCreada>}
 */
export async function crearSolicitud(data) {
  const { data: res } = await api.post('/creditos/solicitudes', data)
  return res
}

/**
 * GET /creditos/solicitudes — listado para la bandeja (institucional).
 * @param {{estado?:number, search?:string, limit?:number, offset?:number}} [opts]
 * @returns {Promise<import('../types/solicitud.types.js').SolicitudDetalle[]>}
 */
export async function listarSolicitudes({ estado, search, fecIni, fecFin, limit = 100, offset = 0 } = {}) {
  const params = { limit, offset }
  if (estado != null) params.estado = estado
  if (search) params.search = search
  if (fecIni) params.fec_ini = fecIni
  if (fecFin) params.fec_fin = fecFin
  const { data } = await api.get('/creditos/solicitudes', { params })
  return data
}

/**
 * GET /creditos/solicitudes/resumen — conteos globales por estado.
 * @returns {Promise<{total:number, por_estado:{pksolicitudestado:number, dessolicitudestado:string, n:number}[]}>}
 */
export async function getResumenSolicitudes() {
  const { data } = await api.get('/creditos/solicitudes/resumen')
  return data
}

/**
 * GET /creditos/solicitudes/{codsolicitud}
 * @returns {Promise<import('../types/solicitud.types.js').SolicitudDetalle>}
 */
export async function getSolicitud(codsolicitud) {
  const { data } = await api.get(`/creditos/solicitudes/${codsolicitud}`)
  return data
}

/**
 * POST /creditos/solicitudes/{cod}/opinion
 * @param {string} codsolicitud
 * @param {{tipo:string, favorable:boolean, comentario?:string}} body
 */
export async function registrarOpinion(codsolicitud, body) {
  const { data } = await api.post(
    `/creditos/solicitudes/${codsolicitud}/opinion`,
    body,
  )
  return data
}

/**
 * POST /creditos/solicitudes/{cod}/comite
 */
export async function enviarComite(codsolicitud, pkcomite = null) {
  const { data } = await api.post(
    `/creditos/solicitudes/${codsolicitud}/comite`,
    { pkcomite },
  )
  return data
}

/**
 * POST /creditos/solicitudes/{cod}/resolver
 * @param {{decision:string, motivo?:string, monto_aprobado?:number}} body
 */
export async function resolverSolicitud(codsolicitud, body) {
  const { data } = await api.post(
    `/creditos/solicitudes/${codsolicitud}/resolver`,
    body,
  )
  return data
}

/**
 * GET /creditos/solicitudes/{cod}/cronograma  (solo si está aprobada)
 */
export async function getCronogramaSolicitud(codsolicitud) {
  const { data } = await api.get(
    `/creditos/solicitudes/${codsolicitud}/cronograma`,
  )
  return data
}

/**
 * POST /creditos/solicitudes/{cod}/ingresos — registra una fuente de ingreso.
 * @param {string} cod
 * @param {{tipo:'DE'|'NE'|'RH', monto:number, nombre_empresa?:string}} body
 * @returns {Promise<{codsolicitud:string, pkcliente:number, tipo:string, monto:number}>}
 */
export async function registrarIngreso(cod, body) {
  const { data } = await api.post(`/creditos/solicitudes/${cod}/ingresos`, body)
  return data
}

/**
 * POST /creditos/solicitudes/{cod}/evaluacion — registra la evaluación (ME o CO,
 * el backend elige según el tipo de la solicitud).
 * @param {string} cod
 * @param {{ingreso:number, gasto_familiar:number, fortaleza?:string, debilidad?:string}} body
 * @returns {Promise<{codsolicitud:string, pkevaluacion:number, excedente:number, creada:boolean}>}
 */
export async function registrarEvaluacion(cod, body) {
  const { data } = await api.post(`/creditos/solicitudes/${cod}/evaluacion`, body)
  return data
}

/**
 * POST /creditos/solicitudes/{cod}/desembolsar — desembolsa una solicitud aprobada.
 * @param {string} cod
 * @returns {Promise<{codsolicitud:string, estado:string, codcuentacredito:string, monto_desembolsado:number, fecha:string}>}
 */
export async function desembolsarSolicitud(cod) {
  const { data } = await api.post(`/creditos/solicitudes/${cod}/desembolsar`)
  return data
}
