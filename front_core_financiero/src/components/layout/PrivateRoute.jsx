import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext.jsx'

/**
 * Envuelve rutas privadas.
 * - Si no hay token → redirige a /login (conservando la ruta de origen).
 * - Si se pasa `roles` y el rol del usuario no está incluido → redirige a /dashboard.
 *
 * @param {{children: React.ReactNode, roles?: string[]}} props
 */
export default function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthContext()
  const location = useLocation()

  if (!isAuthenticated) {
    // El acceso es vía el modal del inicio, así que enviamos a la página de inicio.
    return <Navigate to="/" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user?.rol)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
