import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet, ListChecks, ChevronDown, RefreshCw,
  Send, Receipt, FileText, PiggyBank,
} from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { useDetalleAhorro } from '../hooks/useMovimientos.js'
import { simboloMoneda, formatTEA, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import ActionPanel from '../components/ui/ActionPanel.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import DetalleAhorro from '../components/cuentas/DetalleAhorro.jsx'

export default function CuentasAhorroPage() {
  const { cuentas, loading, error, recargar } = useCuentas('ahorro')
  const navigate = useNavigate()
  const [abierta, setAbierta] = useState(null) // codcuentaahorro con detalle abierto

  const total = cuentas.reduce((s, c) => s + toNumber(c.saldo), 0)

  const acciones = [
    { icon: Send, label: 'Transferencias propias', to: '/operaciones/transferencia' },
    { icon: Receipt, label: 'Pago de crédito', to: '/operaciones/pago-credito' },
    { icon: FileText, label: 'Pago de servicios', to: '/operaciones/pago-servicios' },
  ]

  return (
    <PageLayout
      title="Cuentas de Ahorro"
      subtitle="Cuentas › Mis productos"
      actions={
        <button className="bbva-btn-ghost" onClick={recargar} disabled={loading}>
          <RefreshCw size={14} /> Actualizar
        </button>
      }
      aside={<ActionPanel title="Operaciones" items={acciones} />}
    >
      {error && <Alert tipo="error">{error}</Alert>}

      <Card title="Cuentas" icon={<Wallet size={18} />}>
        {loading ? (
          <Loader text="Cargando cuentas de ahorro…" />
        ) : cuentas.length === 0 ? (
          <p className="bbva-empty">No registra cuentas de ahorro asociadas a su cliente.</p>
        ) : (
          <div className="bbva-acc-list">
            {cuentas.map((c) => (
              <CuentaItem
                key={c.codcuentaahorro}
                cuenta={c}
                abierta={abierta === c.codcuentaahorro}
                onToggle={() => setAbierta(abierta === c.codcuentaahorro ? null : c.codcuentaahorro)}
                onMovimientos={() => navigate(`/cuentas/ahorro/${c.codcuentaahorro}/movimientos`)}
              />
            ))}
            <div className="bbva-prodlist-total">
              <span>Saldo disponible total</span>
              <Money value={total} className="bbva-money-strong" />
            </div>
          </div>
        )}
      </Card>
    </PageLayout>
  )
}

function CuentaItem({ cuenta, abierta, onToggle, onMovimientos }) {
  const simbolo = simboloMoneda(cuenta.moneda)
  // Carga perezosa del detalle solo cuando se expande.
  const { detalle, loading, error } = useDetalleAhorro(abierta ? cuenta.codcuentaahorro : null)

  return (
    <div className={`bbva-acc ${abierta ? 'open' : ''}`}>
      <div className="bbva-acc-head">
        <div className="bbva-acc-main">
          <span className="bbva-acc-ico"><PiggyBank size={20} /></span>
          <div>
            <strong>{cuenta.codcuentaahorro}</strong>
            <small>{cuenta.tipo} · {cuenta.moneda} · TEA {formatTEA(cuenta.tea)}</small>
          </div>
        </div>
        <div className="bbva-acc-right">
          <div className="bbva-acc-saldo">
            <Money value={cuenta.saldo} simbolo={simbolo} />
            <Badge estado={cuenta.estado} />
          </div>
          <div className="bbva-acc-btns">
            <button className="bbva-btn-ghost sm" onClick={onMovimientos}>
              <ListChecks size={14} /> Movimientos
            </button>
            <button className="bbva-btn-ghost sm" onClick={onToggle}>
              Ver detalle <ChevronDown size={14} className={`bbva-chev ${abierta ? 'up' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      {abierta && <DetalleAhorro detalle={detalle} loading={loading} error={error} />}
    </div>
  )
}
