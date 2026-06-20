/**
 * Logo de marca de Banco Pichincha.
 * Isotipo: flor andina multicolor — pétalos con los colores del textil
 * (magenta, naranja, amarillo, verde, turquesa, morado) y centro cálido.
 *
 * @param {Object} props
 * @param {number} [props.size=44]      Tamaño del isotipo en px.
 * @param {boolean} [props.wordmark=true] Mostrar el texto "Banco Pichincha".
 * @param {'dark'|'light'} [props.variant='dark'] Color del texto.
 */

// Pétalos: ángulo de rotación + color (paleta de Banco Pichincha).
const PETALOS = [
  { a: 0, c: '#0F265C' },
  { a: 60, c: '#FFDD00' },
  { a: 120, c: '#E8C496' },
  { a: 180, c: '#0F265C' },
  { a: 240, c: '#FFDD00' },
  { a: 300, c: '#E8C496' },
]

export default function Logo({ size = 44, wordmark = true, variant = 'dark' }) {
  const textColor = variant === 'light' ? '#ffffff' : '#0F265C'
  const subColor = variant === 'light' ? 'rgba(255,255,255,.8)' : '#64748b'
  // El texto escala con el tamaño del isotipo.
  const nameSize = Math.round(size * 0.5)
  const subSize = Math.max(9, Math.round(size * 0.23))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <img src="../../../public/logo-pch.svg" />
    </span>
  )
}
