import { useState, useEffect, useCallback } from 'react'
import {
  getResumenMora,
  getCarteraMora,
  getTiposGestion,
  registrarGestion,
  getGestiones,
} from '../services/svc_recuperaciones.js'

function detalleError(err, fallback) {
  const d = err.response?.data?.detail
  if (typeof d === 'string') return d
  if (d?.error) return d.error
  return fallback
}

/** Resumen de mora (KPIs por banda). */
export function useResumenMora() {
  const [resumen, setResumen] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setResumen(await getResumenMora())
    } catch (err) {
      setError(detalleError(err, 'No se pudo cargar el resumen de mora.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { resumen, loading, error, recargar: cargar }
}

/** Cartera morosa filtrada por banda; setBanda recarga. */
export function useCarteraMora(bandaInicial = null) {
  const [banda, setBanda] = useState(bandaInicial)
  const [cartera, setCartera] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { limit: 300 }
      if (banda) params.banda = banda
      setCartera(await getCarteraMora(params))
    } catch (err) {
      setError(detalleError(err, 'No se pudo cargar la cartera en mora.'))
    } finally {
      setLoading(false)
    }
  }, [banda])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { cartera, banda, setBanda, loading, error, recargar: cargar }
}

/** Tipos de gestión (catálogo, se carga una vez por montaje). */
export function useTiposGestion() {
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    getTiposGestion()
      .then((t) => activo && setTipos(t))
      .catch(() => activo && setTipos([]))
      .finally(() => activo && setLoading(false))
    return () => {
      activo = false
    }
  }, [])

  return { tipos, loading }
}

/**
 * Historial de gestiones de un crédito + acción registrar(body) que recarga
 * el historial al terminar y expone un mensaje de confirmación.
 */
export function useGestiones(cod) {
  const [gestiones, setGestiones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accionLoading, setAccionLoading] = useState(false)
  const [accionMsg, setAccionMsg] = useState(null) // {tipo:'ok'|'error', texto}

  const cargar = useCallback(async () => {
    if (!cod) return
    setLoading(true)
    setError(null)
    try {
      setGestiones(await getGestiones(cod))
    } catch (err) {
      setError(detalleError(err, 'No se pudo cargar el historial de gestiones.'))
    } finally {
      setLoading(false)
    }
  }, [cod])

  useEffect(() => {
    cargar()
  }, [cargar])

  const registrar = useCallback(
    async (body) => {
      setAccionLoading(true)
      setAccionMsg(null)
      try {
        const res = await registrarGestion(cod, body)
        setAccionMsg({ tipo: 'ok', texto: 'Gestión registrada correctamente.' })
        await cargar()
        return res
      } catch (err) {
        setAccionMsg({ tipo: 'error', texto: detalleError(err, 'No se pudo registrar la gestión.') })
        return null
      } finally {
        setAccionLoading(false)
      }
    },
    [cod, cargar],
  )

  return { gestiones, loading, error, recargar: cargar, registrar, accionLoading, accionMsg }
}
