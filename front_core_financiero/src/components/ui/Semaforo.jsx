/**
 * Badge de semáforo VERDE / AMARILLO / ROJO.
 * Espeja la lógica de cumplimiento de metas del backend.
 */
const MAP = {
  VERDE: { clase: 'badge--verde', txt: 'VERDE' },
  AMARILLO: { clase: 'badge--amarillo', txt: 'AMARILLO' },
  ROJO: { clase: 'badge--rojo', txt: 'ROJO' },
}

export default function Semaforo({ estado }) {
  const cfg = MAP[estado] || { clase: 'badge--neutral', txt: estado || '—' }
  return <span className={`badge ${cfg.clase}`}>{cfg.txt}</span>
}
