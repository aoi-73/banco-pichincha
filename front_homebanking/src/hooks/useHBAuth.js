import { useContext } from 'react'
import { HBAuthContext } from '../context/HBAuthContext.jsx'

// Acceso al contexto de autenticación: { user, token, isAuthenticated, login, logout }.
export function useHBAuth() {
  const ctx = useContext(HBAuthContext)
  if (!ctx) {
    throw new Error('useHBAuth debe usarse dentro de <HBAuthProvider>')
  }
  return ctx
}

export default useHBAuth
