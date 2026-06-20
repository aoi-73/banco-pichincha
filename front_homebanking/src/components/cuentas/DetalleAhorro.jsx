import { CalendarClock, Lock, PiggyBank, Landmark } from 'lucide-react'
import { formatDate, formatTEA } from '../../utils/format.js'
import Money from '../ui/Money.jsx'
import Tabla from '../ui/Tabla.jsx'
import Loader from '../ui/Loader.jsx'
import Alert from '../ui/Alert.jsx'
import Badge from '../ui/Badge.jsx'

// Panel de detalle de una cuenta de ahorro, según codtipo: PF | CT (CTS) | AP | AC.
export default function DetalleAhorro({ detalle, loading, error }) {
  if (loading) return <Loader text="Cargando detalle…" />
  if (error) return <Alert tipo="error">{error}</Alert>
  if (!detalle) return null

  const { codtipo } = detalle

  // codtipo del backend: AC (corriente) · PF (plazo fijo) · CT (CTS) · AP (programado).
  if (codtipo === 'PF' && detalle.plazo_fijo) return <PlazoFijo d={detalle.plazo_fijo} />
  if (codtipo === 'CT' && detalle.cts) return <Cts d={detalle.cts} />
  if (codtipo === 'AP' && detalle.ahorro_programado) return <AhorroProgramado d={detalle.ahorro_programado} />

  // AC u otros: solo mensaje informativo.
  return (
    <div className="bbva-detalle">
      <p className="bbva-empty" style={{ margin: 0 }}>
        {detalle.mensaje || 'Esta cuenta no tiene detalle de subproducto adicional.'}
      </p>
    </div>
  )
}

function PlazoFijo({ d }) {
  return (
    <div className="bbva-detalle">
      <h4 className="bbva-detalle-title"><CalendarClock size={16} /> Depósito a Plazo Fijo</h4>
      <dl className="hb-dl">
        <div><dt>Vigencia</dt><dd>{formatDate(d.fecha_vigencia)}</dd></div>
        <div><dt>Plazo</dt><dd>{d.nro_dias_plazo} días</dd></div>
        <div><dt>Saldo capital</dt><dd><Money value={d.saldo_capital} /></dd></div>
        <div><dt>Tasa pagada</dt><dd>{formatTEA(d.tasa_pagada)}</dd></div>
        <div><dt>Interés pactado</dt><dd><Money value={d.interes_pactado} /></dd></div>
        <div><dt>Interés devengado</dt><dd><Money value={d.interes_devengado} /></dd></div>
        <div><dt>Interés pagado</dt><dd><Money value={d.interes_pagado} /></dd></div>
        <div><dt>Renovaciones</dt><dd>{d.nro_renovaciones}</dd></div>
      </dl>
    </div>
  )
}

function Cts({ d }) {
  return (
    <div className="bbva-detalle">
      <h4 className="bbva-detalle-title"><Lock size={16} /> Cuenta CTS</h4>
      <dl className="hb-dl">
        <div><dt>Capital</dt><dd><Money value={d.capital} /></dd></div>
        <div><dt>Interés</dt><dd><Money value={d.interes} /></dd></div>
        <div><dt>Capital intangible</dt><dd><Money value={d.capital_intangible} /></dd></div>
        <div><dt>Interés intangible</dt><dd><Money value={d.interes_intangible} /></dd></div>
      </dl>
      <div className="bbva-cts-disp">
        <span><Landmark size={16} /> Disponible para retiro (por ley)</span>
        <Money value={d.disponible} className="bbva-money-strong" />
      </div>
    </div>
  )
}

function AhorroProgramado({ d }) {
  const cols = [
    { key: 'coddeposito', header: 'Depósito' },
    { key: 'fecha_programada', header: 'Fecha programada', render: (r) => formatDate(r.fecha_programada) },
    { key: 'fecha_efectuada', header: 'Fecha efectuada', render: (r) => formatDate(r.fecha_efectuada) },
    { key: 'monto_cuota', header: 'Monto cuota', align: 'right', render: (r) => <Money value={r.monto_cuota} /> },
    { key: 'monto_amortizado', header: 'Amortizado', align: 'right', render: (r) => <Money value={r.monto_amortizado} /> },
    { key: 'dias_retraso', header: 'Días retraso', align: 'center', render: (r) => (r.dias_retraso > 0 ? <Badge estado={`${r.dias_retraso}`} tone="red" /> : '0') },
    { key: 'depositada', header: 'Estado', render: (r) => <Badge estado={r.depositada ? 'Depositada' : 'Pendiente'} /> },
  ]
  return (
    <div className="bbva-detalle">
      <h4 className="bbva-detalle-title"><PiggyBank size={16} /> Ahorro Programado</h4>
      <dl className="hb-dl">
        <div><dt>Capital acumulado</dt><dd><Money value={d.capital} /></dd></div>
        <div><dt>Cuota</dt><dd><Money value={d.monto_cuota} /></dd></div>
        <div><dt>N° de cuotas</dt><dd>{d.nro_cuotas}</dd></div>
        <div><dt>Tasa incentivo</dt><dd>{formatTEA(d.tasa_incentivo)}</dd></div>
        <div><dt>Vigencia</dt><dd>{formatDate(d.fecha_vigencia)}</dd></div>
      </dl>
      <h5 className="bbva-detalle-sub">Cronograma de depósitos</h5>
      <Tabla columns={cols} rows={d.cronograma || []} rowKey={(r) => r.coddeposito}
        emptyText="Sin cronograma de depósitos." />
    </div>
  )
}
