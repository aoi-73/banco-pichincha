import { useState, useEffect, useCallback } from 'react'
import {
  getKpis,
  getProductividad,
  getEvolucionHistorica,
  getDesembolsos,
} from '../services/svc_dashboard.js'

// Extrae un mensaje legible del error de axios.
function msgError(err) {
  if (err.response) {
    const d = err.response.data?.detail
    return `HTTP ${err.response.status}: ${
      typeof d === 'string' ? d : JSON.stringify(d) || err.response.statusText
    }`
  }
  return err.message || 'Error de red'
}

/**
 * Orquesta la carga de los tres bloques del dashboard de forma
 * independiente (Promise.allSettled): si uno falla, los demás igual
 * se muestran y se reporta el error específico de cada bloque.
 */
export function useDashboard(periodomes, codagencia) {
  const [kpis, setKpis] = useState(null)
  const [productividad, setProductividad] = useState([])
  const [historico, setHistorico] = useState([])
  const [loading, setLoading] = useState(false)
  /** @type {[Record<string,string>, Function]} errores por bloque */
  const [errores, setErrores] = useState({})

  const cargar = useCallback(async () => {
    if (!periodomes) return
    setLoading(true)
    setErrores({})

    const [rkpis, rprod, rhist] = await Promise.allSettled([
      getKpis(periodomes),
      getProductividad(periodomes, codagencia),
      getEvolucionHistorica(),
    ])

    const errs = {}

    if (rkpis.status === 'fulfilled') setKpis(rkpis.value)
    else errs.kpis = msgError(rkpis.reason)

    if (rprod.status === 'fulfilled') setProductividad(rprod.value)
    else errs.productividad = msgError(rprod.reason)

    if (rhist.status === 'fulfilled') setHistorico(rhist.value)
    else errs.historico = msgError(rhist.reason)

    setErrores(errs)
    setLoading(false)
  }, [periodomes, codagencia])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { kpis, productividad, historico, loading, errores, recargar: cargar }
}

/**
 * Carga los KPIs de desembolsos (endpoint independiente, con su propio período;
 * los datos de ejemplo van de 202501 a 202506).
 */
export function useDesembolsos(periodomes) {
  const [desembolsos, setDesembolsos] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!periodomes) return undefined
    let activo = true
    setLoading(true)
    setError(null)
    getDesembolsos(periodomes)
      .then((d) => activo && setDesembolsos(d))
      .catch((err) => activo && setError(msgError(err)))
      .finally(() => activo && setLoading(false))
    return () => {
      activo = false
    }
  }, [periodomes])

  return { desembolsos, loading, error }
}

export default useDashboard
