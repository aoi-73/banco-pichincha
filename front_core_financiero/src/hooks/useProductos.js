import { useState, useEffect } from 'react'
import { getProductos } from '../services/svc_creditos.js'

/**
 * Caché a nivel de módulo: el catálogo de productos cambia muy rara vez, así que
 * lo cargamos una sola vez y compartimos el resultado entre todos los formularios.
 * Se guarda la promesa en vuelo para que llamadas simultáneas no disparen N fetches.
 */
let cacheProductos = null
let cachePromise = null

/**
 * Devuelve el catálogo de tipos de crédito (ME/PE/CO) desde GET /creditos/productos.
 * Carga una única vez (cacheado); no recarga en cada render.
 * @returns {{productos:{codtipocredito:string, descripcion:string, segmento:string}[], loading:boolean}}
 */
export function useProductos() {
  const [productos, setProductos] = useState(cacheProductos || [])
  const [loading, setLoading] = useState(cacheProductos === null)

  useEffect(() => {
    // Ya disponible en caché: nada que cargar.
    if (cacheProductos !== null) {
      setProductos(cacheProductos)
      setLoading(false)
      return
    }

    let activo = true
    // Reutiliza la promesa en vuelo si otro componente ya inició la carga.
    if (!cachePromise) {
      cachePromise = getProductos()
        .then((data) => {
          cacheProductos = data?.productos || []
          return cacheProductos
        })
        .catch((err) => {
          // Ante error no cacheamos: se reintentará en el próximo montaje.
          cachePromise = null
          throw err
        })
    }

    cachePromise
      .then((lista) => {
        if (activo) {
          setProductos(lista)
          setLoading(false)
        }
      })
      .catch(() => {
        if (activo) {
          setProductos([])
          setLoading(false)
        }
      })

    return () => {
      activo = false
    }
  }, [])

  return { productos, loading }
}

export default useProductos
