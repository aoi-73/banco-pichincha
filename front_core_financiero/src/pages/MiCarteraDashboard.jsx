import { useState, useMemo } from 'react'
import { useCartera } from '../hooks/useCreditos.js'
import { useAuth } from '../hooks/useAuth.js'
import KpiCard from '../components/ui/KpiCard.jsx'
import GraficoTorta from '../components/ui/GraficoTorta.jsx'
import Gauge from '../components/ui/Gauge.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num, pct } from '../utils/format.js'

// Tipos de producto (código → nombre y color). Solo 2 productos: Empresarial
// (Microempresa + Pequeña empresa) y Consumo. El fallback prodInfo cubre cualquier
// código heredado que pudiera quedar en cartera.
const PRODUCTO = {
  ME: { nombre: 'Microempresa', color: '#0F265C' },
  PE: { nombre: 'Pequeña empresa', color: '#E8C496' },
  CO: { nombre: 'Consumo', color: '#FFDD00' },
}
const prodInfo = (cod) => PRODUCTO[cod] || { nombre: String(cod ?? '—'), color: '#64748b' }

const PERIODO_DEFAULT = '202512'

// Calificación crediticia: código → nombre y color.
const CALIF = {
  0: { nombre: 'Normal', color: '#16a34a' },
  1: { nombre: 'CPP', color: '#d97706' },
  2: { nombre: 'Deficiente', color: '#dc2626' },
  3: { nombre: 'Dudoso', color: '#b91c1c' },
  4: { nombre: 'Pérdida', color: '#7a0d18' },
}
const califInfo = (cod) => CALIF[cod] || { nombre: String(cod ?? '—'), color: '#64748b' }

/**
 * Dashboard del asesor: indicadores calculados SOLO sobre la cartera que
 * gestiona (endpoint /creditos/cartera), no datos institucionales.
 */
export default function MiCarteraDashboard() {
  const { user } = useAuth()
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT)
  const [meta, setMeta] = useState('') // meta de colocaciones que asigna el asesor
  // El pkasesor viene del login (JWT); el asesor ya no lo ingresa manualmente.
  const { cartera, loading, error } = useCartera(user?.pkasesor, periodomes)

  const kpis = useMemo(() => {
    let total = 0
    let vigente = 0
    let vencida = 0
    let enMora = 0
    const clientes = new Set()
    for (const c of cartera) {
      total += Number(c.montosaldocapital || 0)
      vigente += Number(c.car_vig_capital || 0)
      vencida += Number(c.car_ven_capital || 0)
      if (Number(c.diasatrasocredito || 0) > 0) enMora += 1
      clientes.add(c.numerodocumentoidentidad || c.nomcliente)
    }
    return {
      total,
      vigente,
      vencida,
      ratio: total > 0 ? (vencida / total) * 100 : 0,
      nCreditos: cartera.length,
      nClientes: clientes.size,
      enMora,
    }
  }, [cartera])

  const porCalif = useMemo(() => {
    const m = {}
    for (const c of cartera) {
      const k = c.calificacion ?? '—'
      m[k] = (m[k] || 0) + Number(c.montosaldocapital || 0)
    }
    return Object.entries(m)
      .map(([cod, monto]) => ({ cod, monto }))
      .sort((a, b) => b.monto - a.monto)
  }, [cartera])
  const maxCalif = Math.max(1, ...porCalif.map((x) => x.monto))

  // Cartera vencida por tipo de producto (requiere codtipocredito en la cartera).
  const porProducto = useMemo(() => {
    const m = {}
    for (const c of cartera) {
      const k = c.codtipocredito ?? '—'
      m[k] = (m[k] || 0) + Number(c.car_ven_capital || 0)
    }
    return Object.entries(m)
      .map(([cod, monto]) => ({ cod, monto }))
      .sort((a, b) => b.monto - a.monto)
  }, [cartera])
  const maxProd = Math.max(1, ...porProducto.map((x) => x.monto))
  const hayTipoProducto = porProducto.some((p) => p.cod && p.cod !== '—')

  const dataComposicion = [
    { name: 'Vigente', value: kpis.vigente },
    { name: 'Vencida', value: kpis.vencida },
  ]

  // Cumplimiento de meta (medidor): saldo colocado vs. meta asignada.
  const metaNum = Number(meta) || 0
  const cumplimiento = metaNum > 0 ? (kpis.total / metaNum) * 100 : 0

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Mi cartera</h1>
          <p className="page-subtitle">
            Indicadores de la cartera que gestionas
            {user?.codasesor && ` · Asesor ${user.codasesor}`}.
          </p>
        </div>
        <div className="field" style={{ maxWidth: 150 }}>
          <label>Período (AAAAMM)</label>
          <input type="text" value={periodomes} onChange={(e) => setPeriodomes(e.target.value)} />
        </div>
      </div>

      {/* Usuario sin asesor asignado → no aplica "Mi cartera" */}
      {!user?.pkasesor && (
        <div className="alert alert--info">
          Tu usuario no tiene una cartera de asesor asignada, por lo que no hay indicadores de cartera personal.
        </div>
      )}

      {user?.pkasesor && loading && (
        <div className="card">
          <Loader texto="Cargando mi cartera…" />
        </div>
      )}
      {user?.pkasesor && error && <div className="alert alert--error">{error}</div>}

      {user?.pkasesor && !loading && !error && (
        <>
          <div className="grid grid-kpi" style={{ marginBottom: 20 }}>
            <KpiCard label="Mi cartera total" valor={money(kpis.total)} />
            <KpiCard label="Vigente" valor={money(kpis.vigente)} color="var(--c-verde)" />
            <KpiCard label="Vencida" valor={money(kpis.vencida)} color="var(--c-rojo)" />
            <KpiCard label="Ratio de mora" valor={pct(kpis.ratio)} color="var(--c-amarillo)" />
            <KpiCard label="N° créditos" valor={num(kpis.nCreditos)} />
            <KpiCard label="Clientes" valor={num(kpis.nClientes)} />
          </div>

          {/* Composición + Medidor de meta */}
          <div className="grid grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Composición de mi cartera</h3>
              {kpis.total > 0 ? (
                <GraficoTorta data={dataComposicion} />
              ) : (
                <p className="page-subtitle">Sin saldos en la cartera.</p>
              )}
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Cumplimiento de meta</h3>
              <div className="field" style={{ maxWidth: 240 }}>
                <label>Meta de colocaciones (S/)</label>
                <input type="number" value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="Ej. 6000000" />
              </div>
              {metaNum > 0 ? (
                <Gauge value={cumplimiento} sublabel={`Colocado ${money(kpis.total)} de ${money(metaNum)}`} />
              ) : (
                <p className="page-subtitle" style={{ marginTop: 14 }}>
                  Asigna tu meta de colocaciones para ver el avance.
                </p>
              )}
            </div>
          </div>

          {/* Calificación + Cartera vencida por tipo de producto */}
          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Cartera por calificación</h3>
              {porCalif.length === 0 ? (
                <p className="page-subtitle">Sin datos.</p>
              ) : (
                <div className="barlist">
                  {porCalif.map((x) => {
                    const info = califInfo(x.cod)
                    return (
                      <div className="barlist__row" style={{ gridTemplateColumns: '120px 1fr 110px' }} key={x.cod}>
                        <span className="barlist__label">{info.nombre}</span>
                        <div className="barlist__track">
                          <div className="barlist__fill" style={{ width: `${(x.monto / maxCalif) * 100}%`, background: info.color }} />
                        </div>
                        <span className="barlist__val">{money(x.monto)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Cartera vencida por tipo de producto</h3>
              {!hayTipoProducto ? (
                <p className="page-subtitle">
                  Requiere el campo <code>codtipocredito</code> en <code>/creditos/cartera</code> (pendiente en el backend).
                </p>
              ) : (
                <div className="barlist">
                  {porProducto.map((x) => {
                    const info = prodInfo(x.cod)
                    return (
                      <div className="barlist__row" style={{ gridTemplateColumns: '140px 1fr 110px' }} key={x.cod}>
                        <span className="barlist__label">{info.nombre}</span>
                        <div className="barlist__track">
                          <div className="barlist__fill" style={{ width: `${(x.monto / maxProd) * 100}%`, background: info.color }} />
                        </div>
                        <span className="barlist__val">{money(x.monto)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
