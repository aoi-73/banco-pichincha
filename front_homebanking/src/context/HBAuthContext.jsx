import { createContext, useState, useCallback, useMemo } from 'react'
import * as authService from '../services/authService.js'

// Context de autenticación del cliente del Homebanking.
export const HBAuthContext = createContext(null)

export function HBAuthProvider({ children }) {
  const [token, setToken] = useState(() => authService.getStoredToken())
  const [user, setUser] = useState(() => authService.getStoredUser())

  const login = useCallback(async (username, password) => {
    const { token: newToken, user: newUser } = await authService.login(username, password)
    authService.saveSession(newToken, newUser)
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    authService.clearSession()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, login, logout],
  )

  return <HBAuthContext.Provider value={value}>{children}</HBAuthContext.Provider>
}
