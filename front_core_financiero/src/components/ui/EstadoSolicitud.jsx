import { ESTADO_BADGE } from '../../utils/permisos.js'

/**
 * Badge del estado de una solicitud (dsolicitudestado).
 * @param {{pkestado:number, texto:string}} props
 */
export default function EstadoSolicitud({ pkestado, texto }) {
  const clase = ESTADO_BADGE[pkestado] || 'badge--neutral'
  return <span className={`badge ${clase}`}>{texto || '—'}</span>
}
