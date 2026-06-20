import { useState, useEffect, useCallback } from 'react'
import {
  getResumenAgencia,
  getCuentasCliente,
} from '../services/svc_ahorros.js'

/**
 * Resumen de captaciones por tipo de cuenta para una agencia/período.
 */
export function useResumenAhorros(codagencia, periodomes) {
  const [resumen, setResumen] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!codagencia || !periodomes) return
    setLoading(true)
    setError(null)
    try {
      setResumen(await getResumenAgencia(codagencia, periodomes))
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar ahorros.')
    } finally {
      setLoading(false)
    }
  }, [codagencia, periodomes])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { resumen, loading, error, recargar: cargar }
}

/**
 * Cuentas de ahorro de un cliente.
 */
export function useCuentasCliente(codcliente, periodomes) {
  const [cuentas, setCuentas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const buscar = useCallback(async () => {
    if (!codcliente || !periodomes) return
    setLoading(true)
    setError(null)
    try {
      setCuentas(await getCuentasCliente(codcliente, periodomes))
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar cuentas.')
    } finally {
      setLoading(false)
    }
  }, [codcliente, periodomes])

  return { cuentas, loading, error, buscar }
}

export default useResumenAhorros
