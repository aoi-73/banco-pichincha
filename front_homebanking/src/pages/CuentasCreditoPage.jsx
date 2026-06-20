import { useNavigate } from 'react-router-dom'
import { CreditCard, ListChecks, RefreshCw, Receipt, FilePlus2 } from 'lucide-react'
import { useCreditos } from '../hooks/useCreditos.js'
import { formatDate, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import ActionPanel from '../components/ui/ActionPanel.jsx'
import Card from '../components/ui/Card.jsx'
import Tabla from '../components/ui/Tabla.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

export default function CuentasCreditoPage() {
  const { creditos, loading, error, recargar } = useCreditos()
  const navigate = useNavigate()

  const totalDeuda = creditos.reduce((s, c) => s + toNumber(c.pago_pendiente), 0)

  const acciones = [
    { icon: Receipt, label: 'Pago de crédito', to: '/operaciones/pago-credito' },
    { icon: FilePlus2, label: 'Solicitar préstamo', to: '/creditos/solicitar' },
  ]

  const columns = [
    { key: 'codcuentacredito', header: 'Tipo y número', render: (r) => (
      <div className="bbva-cell-prod"><strong>{r.codcuentacredito}</strong><small>CONSUMO</small></div>
    ) },
    { key: 'fecha_desembolso', header: 'Desembolso', render: (r) => formatDate(r.fecha_desembolso) },
    { key: 'saldo_capital', header: 'Saldo capital', align: 'right', render: (r) => <Money value={r.saldo_capital} /> },
    { key: 'pago_pendiente', header: 'Pago pendiente', align: 'right', render: (r) => <Money value={r.pago_pendiente} /> },
    { key: 'dias_atraso', header: 'Días atraso', align: 'center', render: (r) => (r.dias_atraso > 0 ? <Badge estado={`${r.dias_atraso}`} tone="red" /> : '0') },
    { key: 'calificacion', header: 'Calificación', render: (r) => <Badge estado={r.calificacion || 'Normal'} tone={r.dias_atraso > 0 ? 'red' : undefined} /> },
    { key: 'cuotas', header: '', align: 'center', render: (r) => (
      <button className="bbva-btn-ghost sm" onClick={() => navigate(`/cuentas/credito/${r.codcuentacredito}/cuotas`)}>
        <ListChecks size={14} /> Ver cuotas
      </button>
    ) },
  ]

  return (
    <PageLayout
      title="Préstamos"
      subtitle="Préstamos › Mis productos"
      actions={<button className="bbva-btn-ghost" onClick={recargar} disabled={loading}><RefreshCw size={14} /> Actualizar</button>}
      aside={<ActionPanel title="Operaciones" items={acciones} />}
    >
      {error && <Alert tipo="error">{error}</Alert>}

      <Card title="Mis créditos" icon={<CreditCard size={18} />}>
        {loading ? (
          <Loader text="Cargando créditos…" />
        ) : (
          <>
            <Tabla columns={columns} rows={creditos} rowKey={(r) => r.codcuentacredito}
              emptyText="No registra créditos vigentes." />
            {creditos.length > 0 && (
              <div className="bbva-prodlist-total">
                <span>Saldo pendiente total</span>
                <Money value={totalDeuda} className="bbva-money-strong" />
              </div>
            )}
          </>
        )}
      </Card>
    </PageLayout>
  )
}
