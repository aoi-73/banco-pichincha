import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { CreditCard, Fingerprint, Lock, LogIn, ArrowLeft } from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { extractError } from '../utils/format.js'
import Alert from '../components/ui/Alert.jsx'
import Logo from '../components/ui/Logo.jsx'

export default function LoginPage() {
  const { login, isAuthenticated } = useHBAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Número de tarjeta / usuario que pudo venir desde el landing.
  const [tarjeta, setTarjeta] = useState(location.state?.tarjeta || '')
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Si ya hay sesión, va directo a la banca.
  useEffect(() => {
    if (isAuthenticated) navigate('/inicio', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // El DNI se valida en el front (dato de verificación del titular).
    if (!/^\d{8}$/.test(dni.trim())) {
      setError('Ingresa un DNI válido de 8 dígitos.')
      return
    }

    setLoading(true)
    try {
      // El backend autentica con la tarjeta/usuario (codcliente) + la clave.
      await login(tarjeta.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(extractError(err, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hb-login-bg">
      <div className="hb-login-card">
        <div className="hb-login-franja" />
        <div className="hb-login-head" style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <Logo size={48} variant="dark" subtitle="BANCA POR INTERNET" />
        </div>
        <p style={{ textAlign: 'center', color: 'var(--hb-muted)', fontSize: 13, margin: '0 0 22px' }}>
          Ingresa con el número de tu tarjeta de ahorros
        </p>

        <Alert tipo="error">{error}</Alert>

        <form onSubmit={onSubmit}>
          <div className="hb-field">
            <label htmlFor="tarjeta">N° de tarjeta de ahorros</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={18} style={iconStyle} />
              <input
                id="tarjeta"
                className="hb-input"
                style={{ paddingLeft: 40 }}
                placeholder="Ej. cli000001"
                autoComplete="username"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="hb-field">
            <label htmlFor="dni">DNI</label>
            <div style={{ position: 'relative' }}>
              <Fingerprint size={18} style={iconStyle} />
              <input
                id="dni"
                className="hb-input"
                style={{ paddingLeft: 40 }}
                placeholder="8 dígitos"
                inputMode="numeric"
                maxLength={8}
                autoComplete="off"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
          </div>

          <div className="hb-field">
            <label htmlFor="password">Clave de Internet</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={iconStyle} />
              <input
                id="password"
                type="password"
                className="hb-input"
                style={{ paddingLeft: 40 }}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="hb-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="hb-login-hint">
          Prueba: tarjeta <strong>cli000001</strong> · DNI <strong>12345678</strong> · clave <strong>demo1234</strong>
        </p>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--hb-muted)', fontSize: 13 }}>
            <ArrowLeft size={15} /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

const iconStyle = {
  position: 'absolute',
  left: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#9ca3af',
  pointerEvents: 'none',
}
