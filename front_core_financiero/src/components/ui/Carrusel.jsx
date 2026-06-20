import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Carrusel de comunicados. Cada slide trae su ilustración SVG de fondo
 * + texto superpuesto. Auto-avanza y permite navegación manual.
 *
 * @param {{slides: Array<{badge?:string, titulo:string, subtitulo:string, svg:React.ReactNode}>, intervalo?:number}} props
 */
export default function Carrusel({ slides, intervalo = 5000, fill = false }) {
  const [i, setI] = useState(0)
  const n = slides.length

  const ir = useCallback((idx) => setI(((idx % n) + n) % n), [n])

  useEffect(() => {
    if (n <= 1) return undefined
    const t = setInterval(() => setI((p) => (p + 1) % n), intervalo)
    return () => clearInterval(t)
  }, [n, intervalo])

  return (
    <div className={'carrusel' + (fill ? ' carrusel--fill' : '')}>
      <div className="carrusel__track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, idx) => (
          <div className="carrusel__slide" key={idx} aria-hidden={idx !== i}>
            {s.svg}
            <div className="carrusel__content">
              {s.badge && <span className="carrusel__badge">{s.badge}</span>}
              <h2 className="carrusel__title">{s.titulo}</h2>
              {s.subtitulo && <p className="carrusel__sub">{s.subtitulo}</p>}
              {s.extra}
            </div>
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button className="carrusel__arrow carrusel__arrow--prev" onClick={() => ir(i - 1)} aria-label="Anterior">
            <ChevronLeft size={22} />
          </button>
          <button className="carrusel__arrow carrusel__arrow--next" onClick={() => ir(i + 1)} aria-label="Siguiente">
            <ChevronRight size={22} />
          </button>
          <div className="carrusel__dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={'carrusel__dot' + (idx === i ? ' active' : '')}
                onClick={() => ir(idx)}
                aria-label={`Ir al comunicado ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
