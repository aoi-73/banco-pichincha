import { useState, useEffect, useCallback } from 'react'
import { getMovimientos, getDetalleAhorro } from '../services/cuentasService.js'
import { extractError } from '../utils/format.js'

// Detalle de una cuenta de ahorro (PF / CTS / AP / AC).
export function useDetalleAhorro(codcuentaahorro) {
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!codcuentaahorro) return
    setLoading(true)
    setError(null)
    try {
      setDetalle(await getDetalleAhorro(codcuentaahorro))
    } catch (err) {
      setError(extractError(err, 'No se pudo cargar el detalle de la cuenta.'))
    } finally {
      setLoading(false)
    }
  }, [codcuentaahorro])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { detalle, loading, error, recargar: cargar }
}

// Hook para cargar los movimientos de una cuenta de ahorro.
export function useMovimientos(codcuentaahorro, limit = 50) {
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!codcuentaahorro) return
    setLoading(true)
    setError(null)
    try {
      const data = await getMovimientos(codcuentaahorro, limit)
      setMovimientos(data)
    } catch (err) {
      setError(extractError(err, 'No se pudieron cargar los movimientos.'))
    } finally {
      setLoading(false)
    }
  }, [codcuentaahorro, limit])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { movimientos, loading, error, recargar: cargar }
}

export default useMovimientos
