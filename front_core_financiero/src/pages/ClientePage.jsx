import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCliente } from '../services/svc_clientes.js'
import Loader from '../components/ui/Loader.jsx'
import { money } from '../utils/format.js'

export default function ClientePage() {
  const { codcliente } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError(null)
    getCliente(codcliente)
      .then((data) => activo && setCliente(data))
      .catch((err) =>
        activo &&
        setError(
          err.response?.status === 404
            ? 'El cliente no existe.'
            : 'Error al cargar el cliente.',
        ),
      )
      .finally(() => activo && setLoading(false))
    return () => {
      activo = false
    }
  }, [codcliente])

  if (loading) {
    return (
      <div className="card">
        <Loader texto="Cargando cliente…" />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div className="alert alert--error" style={{ marginTop: 16 }}>
          {error}
        </div>
      </div>
    )
  }

  if (!cliente) return null

  // Renderiza dinámicamente los campos devueltos por ClienteOut.
  const entradas = Object.entries(cliente)

  return (
    <div>
      <button className="btn btn--ghost" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h1 className="page-title" style={{ marginTop: 16 }}>
        Ficha del cliente #{codcliente}
      </h1>

      <div className="card" style={{ maxWidth: 560 }}>
        <ul className="detalle-list">
          {entradas.map(([k, v]) => (
            <li key={k}>
              <span>{k}</span>
              <span>
                <strong>
                  {/montoingreso|saldo|ingreso/i.test(k) && !Number.isNaN(Number(v))
                    ? money(v)
                    : String(v ?? '—')}
                </strong>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
