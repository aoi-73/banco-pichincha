import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Gauge,
  FilePlus2,
  Users,
  BadgeCheck,
  AlertTriangle,
  PiggyBank,
} from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext.jsx'
import { puede } from '../../utils/permisos.js'

// Menú estructurado según el flujo de otorgamiento MPR-003-CRE.
// Cada sección puede declarar `accion`: solo se muestra si el rol tiene permiso.
const SECCIONES = [
  {
    titulo: 'Principal',
    items: [{ to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard }],
  },
  {
    titulo: 'Otorgamiento de créditos',
    items: [
      { to: '/solicitudes', label: 'Bandeja de solicitudes', Icon: Inbox },
      { to: '/scoring', label: '1. Pre-solicitud', Icon: Gauge },
      { to: '/solicitudes/nueva', label: '2. Registro de solicitud', Icon: FilePlus2 },
      { to: '/solicitudes?estado=6', label: '3. Propuesta y comité', Icon: Users, estado: '6' },
      { to: '/solicitudes?estado=2', label: '4. Aprobación y desembolso', Icon: BadgeCheck, estado: '2' },
      { to: '/cartera', label: '5. Mora y recuperación', Icon: AlertTriangle },
    ],
  },
  {
    titulo: 'Recuperaciones',
    accion: 'consultar_mora', // asesor/administrador/riesgos/gerencia/analista
    items: [{ to: '/recuperaciones', label: 'Bandeja de mora', Icon: AlertTriangle }],
  },
  {
    titulo: 'Captaciones',
    accion: 'ver_ahorros', // solo administración (no asesores)
    items: [{ to: '/ahorros', label: 'Ahorros', Icon: PiggyBank }],
  },
]

// Determina si un ítem está activo (considerando el filtro de estado en la URL).
function esActivo(item, location) {
  const estado = new URLSearchParams(location.search).get('estado')
  if (item.estado) {
    return location.pathname === '/solicitudes' && estado === item.estado
  }
  if (item.to === '/solicitudes') {
    return location.pathname === '/solicitudes' && !estado
  }
  return location.pathname === item.to
}

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuthContext()

  // Oculta secciones cuyo permiso (accion) no tenga el rol del usuario.
  const visibles = SECCIONES.filter((sec) => !sec.accion || puede(user?.rol, sec.accion))

  return (
    <nav className="sidebar">
      {visibles.map((sec) => (
        <div className="sidebar__section" key={sec.titulo}>
          <p className="sidebar__title">{sec.titulo}</p>
          {sec.items.map(({ to, label, Icon, estado }) => (
            <Link
              key={label}
              to={to}
              className={'sidebar__link' + (esActivo({ to, estado }, location) ? ' active' : '')}
            >
              <Icon size={18} strokeWidth={2.2} />
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  )
}
