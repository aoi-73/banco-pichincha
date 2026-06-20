import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Receipt, RefreshCw } from 'lucide-react'
import { useCuotas } from '../hooks/useCreditos.js'
import { formatDate } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Tabla from '../components/ui/Tabla.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

export default function CuotasCreditoPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const { cuotas, loading, error, recargar } = useCuotas(cod)

  const proxima = cuotas.find((c) => !c.pagada)

  const columns = [
    { key: 'nrocuota', header: 'N° Cuota', render: (c) => <strong>{c.nrocuota}</strong> },
    { key: 'fecha_vencimiento', header: 'Vencimiento', render: (c) => formatDate(c.fecha_vencimiento) },
    { key: 'monto_cuota', header: 'Monto cuota', align: 'right', render: (c) => <Money value={c.monto_cuota} /> },
    { key: 'monto_saldo', header: 'Saldo', align: 'right', render: (c) => <Money value={c.monto_saldo} /> },
    { key: 'dias_atraso', header: 'Días atraso', align: 'center', render: (c) => (c.dias_atraso > 0 ? <Badge estado={`${c.dias_atraso}`} tone="red" /> : '0') },
    { key: 'estado', header: 'Estado', render: (c) => <Badge estado={c.pagada ? 'Pagada' : (c.estado === '02' ? 'Vencida' : 'Vigente')} /> },
  ]

  return (
    <PageLayout>
      <button className="hb-back" onClick={() => navigate('/cuentas/credito')}>
        <ArrowLeft size={16} /> Volver a Préstamos
      </button>

      <div className="bbva-page-head">
        <div>
          <h1 className="bbva-page-title">Cronograma de cuotas</h1>
          <p className="bbva-page-sub">Préstamos › Crédito {cod}</p>
        </div>
        <div className="bbva-page-actions">
          <button className="bbva-btn-ghost" onClick={recargar} disabled={loading}><RefreshCw size={14} /> Actualizar</button>
          <button className="bbva-btn" onClick={() => navigate(`/operaciones/pago-credito/${cod}`)} disabled={!proxima}>
            <Receipt size={14} /> Pagar próxima cuota
          </button>
        </div>
      </div>

      {error && <Alert tipo="error">{error}</Alert>}

      {proxima && (
        <Alert tipo="info">
          Próxima cuota pendiente: <strong>N° {proxima.nrocuota}</strong> · vence el{' '}
          <strong>{formatDate(proxima.fecha_vencimiento)}</strong> · monto <Money value={proxima.monto_cuota} />
        </Alert>
      )}

      <Card title="Cronograma" icon={<CalendarDays size={18} />}>
        {loading ? (
          <Loader text="Cargando cronograma…" />
        ) : (
          <Tabla columns={columns} rows={cuotas} rowKey={(c) => c.nrocuota}
            emptyText="Este crédito no tiene cuotas registradas o ya fue cancelado." />
        )}
      </Card>
    </PageLayout>
  )
}
