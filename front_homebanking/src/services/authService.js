import hbApi, { TOKEN_KEY, USER_KEY } from './hb_api.js'

/**
 * Login del CLIENTE (Banca por Internet de Banco Andino, no del personal).
 * Backend: POST /auth/login {username, password}
 *   -> { access_token, token_type, expires_in_min, cliente: { codcliente, nombre, pkcliente } }
 * Devuelve { token, user } ya normalizado.
 */
export async function login(username, password) {
  const { data } = await hbApi.post('/auth/login', { username, password })
  const token = data.access_token
  const cliente = data.cliente || {}
  const user = {
    codcliente: cliente.codcliente ?? username,
    nombre: cliente.nombre ?? username,
    pkcliente: cliente.pkcliente,
  }
  return { token, user }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
