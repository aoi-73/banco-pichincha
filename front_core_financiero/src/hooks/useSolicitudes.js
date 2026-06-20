import { useState, useEffect, useCallback } from 'react'
import {
  crearSolicitud,
  listarSolicitudes,
  getResumenSolicitudes,
  getSolicitud,
  registrarOpinion,
  enviarComite,
  resolverSolicitud,
  getCronogramaSolicitud,
  registrarIngreso,
  registrarEvaluacion,
  desembolsarSolicitud,
} from '../services/svc_solicitudes.js'

function detalleError(err, fallback) {
  const d = err.response?.data?.detail
  if (typeof d === 'string') return d
  if (d?.error) return d.error
  return fallback
}

/**
 * Creación de una solicitud. Distingue el caso "no sujeto de crédito"
 * (HTTP 422 con elegibilidad) del resto de errores.
 */
export function useCrearSolicitud() {
  const [resultado, setResultado] = useState(null)
  /** @type {[{error:string, elegibilidad?:object}|null, Function]} */
  const [rechazo, setRechazo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function crear(data) {
    setLoading(true)
    setError(null)
    setRechazo(null)
    setResultado(null)
    try {
      const res = await crearSolicitud(data)
      setResultado(res)
      return res
    } catch (err) {
      if (err.response?.status === 422) {
        // Cliente no es sujeto de crédito: detail = {error, elegibilidad}
        const d = err.response.data?.detail || {}
        setRechazo({ error: d.error || 'Cliente no es sujeto de crédito', elegibilidad: d.elegibilidad })
      } else {
        setError(detalleError(err, 'No se pudo crear la solicitud.'))
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  return { crear, resultado, rechazo, loading, error }
}

/**
 * Bandeja de tareas institucional: consume GET /creditos/solicitudes.
 * Filtro por estado y búsqueda son server-side (necesario porque hay miles de
 * solicitudes). Los KPIs usan GET /creditos/solicitudes/resumen (conteo global
 * exacto), rellenando con 0 los estados que el GROUP BY no devuelve.
 */
export function useBandeja() {
  const [items, setItems] = useState([])
  const [resumen, setResumen] = useState({ total: 0, porEstado: {} })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [estado, setEstado] = useState(null) // pksolicitudestado o null = todas
  const [search, setSearch] = useState('')
  const [fecIni, setFecIni] = useState('')
  const [fecFin, setFecFin] = useState('')
  const [limit, setLimit] = useState(100)

  const cargarLista = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listarSolicitudes({
        estado: estado ?? undefined,
        search: search || undefined,
        fecIni: fecIni || undefined,
        fecFin: fecFin || undefined,
        limit,
      })
      setItems(data.map((s) => ({ ...s, _cod: s.codsolicitud })))
    } catch (err) {
      setError(detalleError(err, 'No se pudieron cargar las solicitudes.'))
    } finally {
      setLoading(false)
    }
  }, [estado, search, fecIni, fecFin, limit])

  const cargarResumen = useCallback(async () => {
    try {
      const r = await getResumenSolicitudes()
      const porEstado = {}
      for (const e of r.por_estado || []) porEstado[e.pksolicitudestado] = e.n
      setResumen({ total: r.total || 0, porEstado })
    } catch {
      // El resumen es complementario; si falla, los KPIs quedan en 0.
      setResumen({ total: 0, porEstado: {} })
    }
  }, [])

  useEffect(() => {
    cargarLista()
  }, [cargarLista])

  useEffect(() => {
    cargarResumen()
  }, [cargarResumen])

  const recargar = () => {
    cargarLista()
    cargarResumen()
  }

  return {
    items,
    resumen,
    loading,
    error,
    recargar,
    estado,
    setEstado,
    search,
    setSearch,
    fecIni,
    setFecIni,
    fecFin,
    setFecFin,
    limit,
    setLimit,
  }
}

/**
 * Detalle de una solicitud + acciones del flujo (opinión, comité, resolución,
 * cronograma). Cada acción recarga el detalle al terminar.
 */
export function useSolicitud(codsolicitud) {
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [accionLoading, setAccionLoading] = useState(false)
  const [accionMsg, setAccionMsg] = useState(null) // {tipo:'ok'|'error', texto}

  const [cronograma, setCronograma] = useState(null)
  const [cronogramaError, setCronogramaError] = useState(null)

  const cargar = useCallback(async () => {
    if (!codsolicitud) return
    setLoading(true)
    setError(null)
    try {
      setSolicitud(await getSolicitud(codsolicitud))
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'Solicitud no encontrada.'
          : detalleError(err, 'Error al cargar la solicitud.'),
      )
    } finally {
      setLoading(false)
    }
  }, [codsolicitud])

  useEffect(() => {
    cargar()
  }, [cargar])

  // Envuelve una acción: ejecuta, muestra mensaje y recarga el detalle.
  async function ejecutar(fn, okTexto) {
    setAccionLoading(true)
    setAccionMsg(null)
    try {
      const res = await fn()
      setAccionMsg({ tipo: 'ok', texto: okTexto(res) })
      await cargar()
      return res
    } catch (err) {
      setAccionMsg({
        tipo: 'error',
        texto: detalleError(err, 'No se pudo completar la acción.'),
      })
      return null
    } finally {
      setAccionLoading(false)
    }
  }

  const opinar = (tipo, favorable, comentario) =>
    ejecutar(
      () => registrarOpinion(codsolicitud, { tipo, favorable, comentario }),
      (r) =>
        r?.resultado
          ? r.resultado
          : `Opinión "${tipo}" registrada (${favorable ? 'favorable' : 'desfavorable'}).`,
    )

  const aComite = (pkcomite) =>
    ejecutar(() => enviarComite(codsolicitud, pkcomite), () => 'Enviada a Comité.')

  const resolver = (decision, motivo, monto_aprobado) =>
    ejecutar(
      () => resolverSolicitud(codsolicitud, { decision, motivo, monto_aprobado }),
      (r) => `Resolución: ${r?.estado || decision}.`,
    )

  const registrarIngresos = (body) =>
    ejecutar(() => registrarIngreso(codsolicitud, body), () => 'Ingreso registrado.')

  const evaluar = (body) =>
    ejecutar(
      () => registrarEvaluacion(codsolicitud, body),
      (r) => `Evaluación registrada (excedente S/ ${r.excedente}).`,
    )

  const desembolsar = () =>
    ejecutar(
      () => desembolsarSolicitud(codsolicitud),
      (r) => `Desembolsado: ${r.codcuentacredito} por S/ ${r.monto_desembolsado}.`,
    )

  async function cargarCronograma() {
    setCronograma(null)
    setCronogramaError(null)
    try {
      setCronograma(await getCronogramaSolicitud(codsolicitud))
    } catch (err) {
      setCronogramaError(detalleError(err, 'No se pudo generar el cronograma.'))
    }
  }

  return {
    solicitud,
    loading,
    error,
    recargar: cargar,
    accionLoading,
    accionMsg,
    opinar,
    aComite,
    resolver,
    registrarIngresos,
    evaluar,
    desembolsar,
    cronograma,
    cronogramaError,
    cargarCronograma,
  }
}
