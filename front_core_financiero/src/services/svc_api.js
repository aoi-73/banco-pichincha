import axios from 'axios'

/**
 * Instancia axios central. Todas las llamadas al backend FastAPI
 * pasan por aquí. Inyecta el JWT desde localStorage en cada request.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8001',
  headers: { 'Content-Type': 'application/json' },
})

export const TOKEN_KEY = 'core_token'

// Request interceptor → agrega Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor → ante 401, limpia sesión y redirige a /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('core_user')
      // Sesión inválida/expirada → regresa a la página de inicio.
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  },
)

export default api
