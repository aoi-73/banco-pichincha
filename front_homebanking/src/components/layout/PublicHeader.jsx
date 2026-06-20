import { useNavigate } from 'react-router-dom'
import { Lock, Menu } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

// Cabecera del sitio público (home marketero). CTA destacado: Banca por Internet.
const NAV = [
  { label: 'Personas', href: '#productos' },
  { label: 'Cuentas', href: '#productos' },
  { label: 'Créditos', href: '#productos' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Ayuda', href: '#footer' },
]

export default function PublicHeader() {
  const navigate = useNavigate()
  return (
    <header className="lp-header">
      {/* <div className="hb-franja-top" /> */}
      <div className="lp-nav">
        <button className="lp-brand" onClick={() => navigate('/')} aria-label="Banco Andino — Inicio">
          <Logo size={38} variant="dark" subtitle="BANCA DIGITAL" />
        </button>

        <nav className="lp-nav-links">
          {NAV.map((n) => (
            <a key={n.label} href={n.href}>{n.label}</a>
          ))}
        </nav>

        <div className="lp-nav-actions">
          <button className="lp-cta" onClick={() => navigate('/login')}>
            <Lock size={16} /> Banca por Internet
          </button>
          <button className="lp-burger" aria-label="Menú" onClick={() => navigate('/login')}>
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}
