import { useState } from 'react'
import { evaluarScoring } from '../services/svc_scoring.js'

/**
 * Maneja la evaluación de scoring crediticio.
 * Expone resultado, loading y error.
 */
export function useScoring() {
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function evaluar(solicitud) {
    setLoading(true)
    setError(null)
    setResultado(null)
    try {
      const data = await evaluarScoring(solicitud)
      setResultado(data)
      return data
    } catch (err) {
      setError(
        err.response?.data?.detail || 'No se pudo evaluar la solicitud.',
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResultado(null)
    setError(null)
  }

  return { resultado, loading, error, evaluar, reset }
}

export default useScoring
