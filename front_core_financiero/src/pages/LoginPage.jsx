import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoginForm from '../components/forms/LoginForm.jsx'

export default function LoginPage() {
  const { isAuthenticated, loading, error, iniciarSesion } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-card__franja" />
        <h1>Banco Pichincha</h1>
        <p>Core Financiero — acceso del personal</p>
        <LoginForm onSubmit={iniciarSesion} loading={loading} error={error} />
      </div>
    </div>
  )
}
