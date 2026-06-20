import { useState, useEffect, useCallback } from 'react'
import { getCuentasCredito, getCuotas } from '../services/cuentasService.js'
import { extractError } from '../utils/format.js'

// Lista de créditos del cliente.
export function useCreditos() {
  const [creditos, setCreditos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCreditos(await getCuentasCredito())
    } catch (err) {
      setError(extractError(err, 'No se pudieron cargar los créditos.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { creditos, loading, error, recargar: cargar }
}

// Cronograma de cuotas de un crédito.
export function useCuotas(codcuentacredito) {
  const [cuotas, setCuotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!codcuentacredito) return
    setLoading(true)
    setError(null)
    try {
      setCuotas(await getCuotas(codcuentacredito))
    } catch (err) {
      setError(extractError(err, 'No se pudo cargar el cronograma de cuotas.'))
    } finally {
      setLoading(false)
    }
  }, [codcuentacredito])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { cuotas, loading, error, recargar: cargar }
}

export default useCreditos
