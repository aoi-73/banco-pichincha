/**
 * Layout de página estilo BBVA: contenido principal a la izquierda y un panel
 * de acciones/accesos a la derecha. Si no se pasa `aside`, ocupa todo el ancho.
 */
export default function PageLayout({ title, subtitle, actions, aside, children }) {
  return (
    <div className="bbva-page">
      <div className="bbva-page-main">
        {(title || actions) && (
          <div className="bbva-page-head">
            <div>
              {title && <h1 className="bbva-page-title">{title}</h1>}
              {subtitle && <p className="bbva-page-sub">{subtitle}</p>}
            </div>
            {actions && <div className="bbva-page-actions">{actions}</div>}
          </div>
        )}
        {children}
      </div>
      {aside && <aside className="bbva-page-aside">{aside}</aside>}
    </div>
  )
}
