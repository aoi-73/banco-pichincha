import { useState, useEffect, useCallback } from 'react'
import {
  getCartera,
  getCreditoDetalle,
  getCronograma,
} from '../services/svc_creditos.js'

/**
 * Carga la cartera de un asesor para un período.
 * Recarga automáticamente cuando cambian los parámetros.
 */
export function useCartera(pkasesor, periodomes) {
  const [cartera, setCartera] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!pkasesor || !periodomes) return
    setLoading(true)
    setError(null)
    try {
      setCartera(await getCartera(pkasesor, periodomes))
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar la cartera.')
    } finally {
      setLoading(false)
    }
  }, [pkasesor, periodomes])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { cartera, loading, error, recargar: cargar }
}

/**
 * Carga el detalle de un crédito y su cronograma.
 */
export function useCreditoDetalle(codcuentacredito) {
  const [detalle, setDetalle] = useState(null)
  const [cronograma, setCronograma] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!codcuentacredito) return
    let activo = true
    setLoading(true)
    setError(null)
    Promise.all([
      getCreditoDetalle(codcuentacredito),
      getCronograma(codcuentacredito),
    ])
      .then(([det, cron]) => {
        if (!activo) return
        setDetalle(det)
        setCronograma(cron)
      })
      .catch((err) => {
        if (!activo) return
        setError(
          err.response?.status === 404
            ? 'El crédito no existe.'
            : 'Error al cargar el crédito.',
        )
      })
      .finally(() => activo && setLoading(false))
    return () => {
      activo = false
    }
  }, [codcuentacredito])

  return { detalle, cronograma, loading, error }
}

export default useCartera
