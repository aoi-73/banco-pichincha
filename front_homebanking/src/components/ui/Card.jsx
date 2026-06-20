// Tarjeta blanca con borde redondeado y sombra suave.
export default function Card({ title, icon, actions, children, className = '' }) {
  return (
    <section className={`hb-card ${className}`}>
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title && (
            <h2 className="hb-card-title">
              {icon}
              {title}
            </h2>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
