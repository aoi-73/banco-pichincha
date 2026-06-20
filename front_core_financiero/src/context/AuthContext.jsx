import { createContext, useContext, useState, useCallback } from 'react'
import { login as loginService } from '../services/svc_auth.js'
import { TOKEN_KEY } from '../services/svc_api.js'

const USER_KEY = 'core_user'

const AuthContext = createContext(null)

/**
 * Provee el estado de sesión a toda la app.
 * El token se persiste en localStorage y el interceptor de svc_api
 * lo inyecta automáticamente en cada request.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const login = useCallback(async (numerodni, password) => {
    const data = await loginService({ numerodni, password })
    const usuario = {
      codpersonal: data.codpersonal,
      nombre: data.nombre,
      rol: data.rol,
      codagencia: data.codagencia,
      pkasesor: data.pkasesor ?? null,
      codasesor: data.codasesor ?? null,
    }
    localStorage.setItem(TOKEN_KEY, data.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(usuario))
    setToken(data.access_token)
    setUser(usuario)
    return usuario
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook de acceso al contexto de autenticación. */
export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext debe usarse dentro de <AuthProvider>')
  }
  return ctx
}

export default AuthContext
