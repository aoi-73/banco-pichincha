import { useState, useEffect, useCallback } from 'react'
import { pagarCuota, transferir, pagarServicio, getServicios } from '../services/operacionesService.js'
import { solicitarCredito } from '../services/creditosService.js'
import { extractError } from '../utils/format.js'

// Catálogo de servicios (GET /operaciones/servicios).
export function useServicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setLoading(true)
    getServicios()
      .then((data) => { if (activo) setServicios(data) })
      .catch((err) => { if (activo) setError(extractError(err, 'No se pudo cargar el catálogo de servicios.')) })
      .finally(() => { if (activo) setLoading(false) })
    return () => { activo = false }
  }, [])

  return { servicios, loading, error }
}

/**
 * Hook genérico para ejecutar una operación POST con estado de carga,
 * error y resultado (comprobante). Devuelve `run` que retorna el resultado
 * o lanza para que el caller pueda reaccionar si lo necesita.
 */
function useOperacion(fn, fallbackMsg) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const run = useCallback(
    async (payload) => {
      setLoading(true)
      setError(null)
      try {
        const data = await fn(payload)
        setResult(data)
        return data
      } catch (err) {
        setError(extractError(err, fallbackMsg))
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fn, fallbackMsg],
  )

  const reset = useCallback(() => {
    setError(null)
    setResult(null)
  }, [])

  return { run, loading, error, result, reset }
}

export function usePagoCuota() {
  return useOperacion(pagarCuota, 'No se pudo procesar el pago de la cuota.')
}

export function useTransferencia() {
  return useOperacion(transferir, 'No se pudo procesar la transferencia.')
}

export function usePagoServicio() {
  return useOperacion(pagarServicio, 'No se pudo procesar el pago del servicio.')
}

export function useSolicitudCredito() {
  return useOperacion(solicitarCredito, 'No se pudo registrar la solicitud de crédito.')
}

export default useOperacion
