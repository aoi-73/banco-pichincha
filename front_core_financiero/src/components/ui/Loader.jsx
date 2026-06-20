export default function Loader({ texto = 'Cargando…' }) {
  return (
    <div className="loader">
      <span className="loader__spinner" />
      <span>{texto}</span>
    </div>
  )
}
