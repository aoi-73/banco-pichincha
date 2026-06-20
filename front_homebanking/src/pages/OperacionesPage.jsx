import { useNavigate } from 'react-router-dom'
import { Send, Receipt, FileText, FilePlus2, ChevronRight } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout.jsx'

const OPERACIONES = [
  {
    icon: Send, color: '#0F265C',
    titulo: 'Transferencias propias',
    desc: 'Mueve dinero entre tus cuentas de ahorro al instante.',
    to: '/operaciones/transferencia',
  },
  {
    icon: Receipt, color: '#2a4c9b',
    titulo: 'Pago de crédito',
    desc: 'Paga la cuota de tu préstamo debitando una cuenta de ahorro.',
    to: '/operaciones/pago-credito',
  },
  {
    icon: FileText, color: '#d0a675',
    titulo: 'Pago de servicios',
    desc: 'Paga luz, agua, telefonía y más desde tu cuenta.',
    to: '/operaciones/pago-servicios',
  },
  {
    icon: FilePlus2, color: '#d97706',
    titulo: 'Solicitar préstamo',
    desc: 'Pide tu crédito de consumo o microempresa 100% en línea.',
    to: '/creditos/solicitar',
  },
]

export default function OperacionesPage() {
  const navigate = useNavigate()
  return (
    <PageLayout title="Operaciones en línea" subtitle="Operaciones › Selecciona una operación">
      <div className="bbva-op-grid">
        {OPERACIONES.map((o) => {
          const Icon = o.icon
          return (
            <button key={o.to} className="bbva-op-card" onClick={() => navigate(o.to)}>
              <span className="bbva-op-ico" style={{ background: `${o.color}1a`, color: o.color }}>
                <Icon size={26} />
              </span>
              <span className="bbva-op-body">
                <strong>{o.titulo}</strong>
                <small>{o.desc}</small>
              </span>
              <ChevronRight size={20} className="bbva-op-chev" />
            </button>
          )
        })}
      </div>
    </PageLayout>
  )
}
