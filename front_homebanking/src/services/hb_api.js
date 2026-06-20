import axios from 'axios'

export const TOKEN_KEY = 'hb_token'
export const USER_KEY = 'hb_user'

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8002'

// Instancia central de axios para todo el Homebanking.
const hbApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

// --- Request: inyecta el Bearer token en cada petición ---
hbApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response: ante 401 limpia la sesión y redirige a /login ---
hbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      const enLogin = window.location.pathname.startsWith('/login')
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      // No redirigimos si el propio intento de login fue el que devolvió 401
      // (para que LoginPage muestre el mensaje "Credenciales inválidas").
      if (!enLogin) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default hbApi
