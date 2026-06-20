import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import Logo from '../ui/Logo.jsx'

export default function Navbar() {
  const { user, cerrarSesion } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Logo size={36} variant="light" />
      </div>
      <div className="navbar__user">
        {user && (
          <span>
            {user.nombre} · <strong>{user.rol}</strong> · Ag. {user.codagencia}
          </span>
        )}
        <button className="navbar__logout" onClick={cerrarSesion}>
          <LogOut size={15} strokeWidth={2.4} style={{ verticalAlign: '-2px' }} /> Cerrar sesión
        </button>
      </div>
    </header>
  )
}
