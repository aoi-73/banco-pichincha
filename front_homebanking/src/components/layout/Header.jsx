import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, UserCog, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useHBAuth } from '../../hooks/useHBAuth.js'
import { useUI } from '../../context/UIContext.jsx'
import Logo from '../ui/Logo.jsx'

// Pestañas principales (patrón BBVA): Inicio · Cuentas · Préstamos · Operaciones.
const TABS = [
  { label: 'Inicio', to: '/inicio', match: ['/inicio'] },
  { label: 'Cuentas', to: '/cuentas/ahorro', match: ['/cuentas/ahorro'] },
  { label: 'Préstamos', to: '/cuentas/credito', match: ['/cuentas/credito'] },
  { label: 'Operaciones', to: '/operaciones', match: ['/operaciones', '/creditos/solicitar'] },
]

export default function Header() {
  const { user, logout } = useHBAuth()
  const { hideAmounts, toggleHideAmounts } = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuUser, setMenuUser] = useState(false)

  useEffect(() => { setMenuUser(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const iniciales = (user?.nombre || 'C')
    .split(/[\s,]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase()

  const isActive = (tab) => tab.match.some((m) => location.pathname.startsWith(m))

  return (
    <header>
      {/* <div className="hb-franja-top" /> */}

      {/* Barra superior oscura */}
      <div className="bbva-topbar">
        <div className="bbva-topbar-inner">
          <button className="bbva-brand" onClick={() => navigate('/inicio')} aria-label="Inicio">
            <Logo size={36} variant="light" subtitle="BANCA POR INTERNET" />
          </button>

          <div className="bbva-topbar-right">
            <button className="bbva-hide-toggle" onClick={toggleHideAmounts} title="Ocultar importes">
              {hideAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>Ocultar importes</span>
              <span className={`bbva-switch ${hideAmounts ? 'on' : ''}`}>
                <span className="bbva-switch-dot" />
              </span>
            </button>

            <div className="bbva-user-wrap">
              <button className="bbva-user" onClick={() => setMenuUser((v) => !v)}>
                <span className="bbva-avatar">{iniciales}</span>
                <span className="bbva-user-text">
                  <strong>{user?.nombre || 'Cliente'}</strong>
                  <small>{user?.codcliente}</small>
                </span>
                <ChevronDown size={16} />
              </button>
              {menuUser && (
                <div className="bbva-user-menu">
                  <button onClick={() => navigate('/inicio')}>
                    <UserCog size={16} /> Actualiza tus datos
                  </button>
                  <button onClick={handleLogout}>
                    <LogOut size={16} /> Salir
                  </button>
                </div>
              )}
            </div>

            <button className="bbva-salir" onClick={handleLogout}>
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </div>

      {/* Barra de pestañas roja */}
      <nav className="bbva-tabs">
        <div className="bbva-tabs-inner">
          {TABS.map((t) => (
            <button
              key={t.to}
              className={`bbva-tab ${isActive(t) ? 'active' : ''}`}
              onClick={() => navigate(t.to)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
