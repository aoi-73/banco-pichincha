import api from './svc_api.js'

/**
 * POST /auth/login
 * @param {import('../types/auth.types.js').LoginIn} credenciales
 * @returns {Promise<import('../types/auth.types.js').TokenOut>}
 */
export async function login(credenciales) {
  const { data } = await api.post('/auth/login', credenciales)
  return data
}
