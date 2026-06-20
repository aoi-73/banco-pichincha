import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext.jsx'

/**
 * Lógica de login/logout para las páginas.
 * Expone el estado de carga y error del proceso de autenticación.
 */
export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function iniciarSesion(numerodni, password) {
    setLoading(true)
    setError(null)
    try {
      await login(numerodni, password)
      navigate('/dashboard')
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? 'DNI o contraseña incorrectos.'
          : 'No se pudo conectar con el servidor.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function cerrarSesion() {
    logout()
    navigate('/') // vuelve a la página de inicio
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    iniciarSesion,
    cerrarSesion,
  }
}

export default useAuth
