import { useState, useEffect, useCallback } from 'react'
import { getCuentasAhorro, getCuentasCredito } from '../services/cuentasService.js'
import { extractError } from '../utils/format.js'

// Hook para cargar cuentas de ahorro o de crédito.
// tipo: 'ahorro' | 'credito'
export function useCuentas(tipo = 'ahorro') {
  const [cuentas, setCuentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetcher = tipo === 'credito' ? getCuentasCredito : getCuentasAhorro

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetcher()
      setCuentas(data)
    } catch (err) {
      setError(extractError(err, 'No se pudieron cargar las cuentas.'))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { cuentas, loading, error, recargar: cargar }
}

export default useCuentas
