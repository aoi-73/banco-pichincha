import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ListChecks, RefreshCw } from 'lucide-react'
import { useMovimientos } from '../hooks/useMovimientos.js'
import { useCuentas } from '../hooks/useCuentas.js'
import { simboloMoneda, formatTEA, formatDate } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Tabla from '../components/ui/Tabla.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

export default function MovimientosPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const { movimientos, loading, error, recargar } = useMovimientos(cod, 50)
  const { cuentas } = useCuentas('ahorro')

  const cuenta = cuentas.find((c) => c.codcuentaahorro === cod)
  const simbolo = cuenta ? simboloMoneda(cuenta.moneda) : 'S/'

  const columns = [
    { key: 'fecha', header: 'Fecha', render: (m) => formatDate(m.fecha) },
    { key: 'canal', header: 'Canal', render: (m) => m.canal || m.medio || '—' },
    { key: 'concepto', header: 'Operación', render: (m) => m.concepto || '—' },
    {
      key: 'monto',
      header: 'Monto',
      align: 'right',
      render: (m) => <Money value={m.monto} simbolo={simbolo} signo={m.signo} />,
    },
  ]

  return (
    <PageLayout>
      <button className="hb-back" onClick={() => navigate('/cuentas/ahorro')}>
        <ArrowLeft size={16} /> Volver a Cuentas de Ahorro
      </button>

      <div className="bbva-page-head">
        <div>
          <h1 className="bbva-page-title">Movimientos de la cuenta</h1>
          <p className="bbva-page-sub">Cuentas › Movimientos</p>
        </div>
        <button className="bbva-btn-ghost" onClick={recargar} disabled={loading}>
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      <Card>
        <dl className="hb-dl">
          <div><dt>Producto</dt><dd>{cuenta?.tipo || '—'}</dd></div>
          <div><dt>N° de cuenta</dt><dd>{cod}</dd></div>
          <div><dt>Saldo</dt><dd>{cuenta ? <Money value={cuenta.saldo} simbolo={simbolo} /> : '—'}</dd></div>
          <div><dt>TEA</dt><dd>{formatTEA(cuenta?.tea)}</dd></div>
          <div><dt>Estado</dt><dd>{cuenta ? <Badge estado={cuenta.estado} /> : '—'}</dd></div>
        </dl>
      </Card>

      {error && <Alert tipo="error">{error}</Alert>}

      <Card title="Últimos movimientos" icon={<ListChecks size={18} />}>
        {loading ? (
          <Loader text="Cargando movimientos…" />
        ) : (
          <Tabla
            columns={columns}
            rows={movimientos}
            rowKey={(m, i) => `${m.fecha}-${i}`}
            emptyText="Esta cuenta no registra movimientos en el periodo consultado."
          />
        )}
      </Card>
    </PageLayout>
  )
}
