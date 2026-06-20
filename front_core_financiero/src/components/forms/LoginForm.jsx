import { useState } from 'react'

/**
 * Formulario de login. En desarrollo, password = numerodni.
 */
export default function LoginForm({ onSubmit, loading, error }) {
  const [numerodni, setNumerodni] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(numerodni.trim(), password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="dni">Número de DNI</label>
        <input
          id="dni"
          type="text"
          value={numerodni}
          onChange={(e) => setNumerodni(e.target.value)}
          placeholder="Ej. 12345678"
          autoFocus
          required
        />
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="pwd">Contraseña</label>
        <input
          id="pwd"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="(en desarrollo: tu DNI)"
          required
        />
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <button
        className="btn"
        type="submit"
        disabled={loading}
        style={{ width: '100%', marginTop: 20 }}
      >
        {loading ? 'Ingresando…' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
