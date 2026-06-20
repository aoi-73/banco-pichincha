import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

// Mensaje de alerta. tipo: 'error' | 'success' | 'info' | 'warn'
const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warn: AlertTriangle,
}

export default function Alert({ tipo = 'info', children }) {
  if (!children) return null
  const Icon = ICONS[tipo] || Info
  return (
    <div className={`hb-alert hb-alert-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <Icon size={18} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>{children}</div>
    </div>
  )
}
