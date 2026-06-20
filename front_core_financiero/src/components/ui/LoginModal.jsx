import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import LoginForm from '../forms/LoginForm.jsx'
import Logo from './Logo.jsx'

/**
 * Modal de inicio de sesión al Core. Reutiliza LoginForm + useAuth
 * (al autenticar, useAuth navega a /dashboard y el modal se desmonta).
 */
export default function LoginModal({ onClose }) {
  const { loading, error, iniciarSesion } = useAuth()

  // Cerrar con Escape.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <Logo size={46} />
        </div>
        <h2 style={{ margin: '0 0 4px', textAlign: 'center', fontSize: 20, color: 'var(--c-primary)' }}>
          Ingresar al Core
        </h2>
        <p style={{ margin: '0 0 22px', textAlign: 'center', color: 'var(--c-text-soft)', fontSize: 13 }}>
          Acceso exclusivo del personal · ingresa con tu DNI
        </p>

        <LoginForm onSubmit={iniciarSesion} loading={loading} error={error} />
      </div>
    </div>
  )
}
