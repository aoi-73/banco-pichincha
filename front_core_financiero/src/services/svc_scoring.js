import api from './svc_api.js'

/**
 * POST /scoring/evaluar
 * @param {import('../types/scoring.types.js').ScoringIn} solicitud
 * @returns {Promise<import('../types/scoring.types.js').ScoringOut>}
 */
export async function evaluarScoring(solicitud) {
  const { data } = await api.post('/scoring/evaluar', solicitud)
  return data
}
