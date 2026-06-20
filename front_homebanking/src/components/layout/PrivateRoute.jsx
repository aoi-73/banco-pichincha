import { Navigate, useLocation } from 'react-router-dom'
import { useHBAuth } from '../../hooks/useHBAuth.js'

// Protege rutas: si no hay sesión, redirige a /login.
export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useHBAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
