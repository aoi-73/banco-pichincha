/**
 * Logo de marca de Banco Andino.
 * Isotipo: flor andina multicolor — pétalos con los colores del textil
 * (magenta, naranja, amarillo, verde, turquesa, morado) y centro cálido.
 *
 * @param {Object} props
 * @param {number}  [props.size=44]          Tamaño del isotipo en px.
 * @param {boolean} [props.wordmark=true]    Mostrar el texto "Banco Andino".
 * @param {'dark'|'light'} [props.variant='dark'] Color del texto.
 * @param {string}  [props.subtitle='BANCA POR INTERNET] Texto secundario bajo el nombre.
 */

// Pétalos: ángulo de rotación + color (paleta de la manta andina).
const PETALOS = [
  { a: 0, c: '#e6398b' }, // magenta
  { a: 60, c: '#f7941e' }, // naranja
  { a: 120, c: '#fbc02d' }, // amarillo
  { a: 180, c: '#4caf50' }, // verde
  { a: 240, c: '#00a9a5' }, // turquesa
  { a: 300, c: '#8e24aa' }, // morado
]

export default function Logo({
  size = 44,
  wordmark = true,
  variant = 'dark',
  subtitle = 'BANCA POR INTERNET',
}) {
  const nameSize = Math.round(size * 0.5)
  const subSize = Math.max(9, Math.round(size * 0.23))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <img src="/logo-pch.svg" height={size} alt="Banco Pichincha" style={{ display: 'block' }} />
    </span>
  )
}
