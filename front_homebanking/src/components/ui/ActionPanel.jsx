import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Panel lateral de accesos rápidos (patrón BBVA).
 * items: [{ icon, label, to?, onClick? }]
 * variant: 'list' (filas con chevron) | 'solid' (botones rellenos)
 */
export default function ActionPanel({ title, items = [], variant = 'list' }) {
  const navigate = useNavigate()
  const go = (it) => (it.onClick ? it.onClick() : it.to ? navigate(it.to) : null)

  return (
    <section className="bbva-actions">
      {title && <h3 className="bbva-actions-title">{title}</h3>}
      <div className={`bbva-actions-list ${variant}`}>
        {items.map((it, i) => {
          const Icon = it.icon
          return (
            <button key={i} className="bbva-action" onClick={() => go(it)}>
              <span className="bbva-action-ico">{Icon && <Icon size={18} />}</span>
              <span className="bbva-action-label">{it.label}</span>
              <ChevronRight size={16} className="bbva-action-chev" />
            </button>
          )
        })}
      </div>
    </section>
  )
}
