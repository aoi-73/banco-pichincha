// Indicador de carga centrado.
export default function Loader({ text = 'Cargando…' }) {
  return (
    <div className="hb-loader">
      <div className="hb-spinner" />
      <span>{text}</span>
    </div>
  )
}
