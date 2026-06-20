import { useState, useMemo } from 'react'
import { useDashboard, useDesembolsos } from '../hooks/useDashboard.js'
import { useAuth } from '../hooks/useAuth.js'
import { puede } from '../utils/permisos.js'
import KpiCard from '../components/ui/KpiCard.jsx'
import Semaforo from '../components/ui/Semaforo.jsx'
import GraficoBarras from '../components/ui/GraficoBarras.jsx'
import GraficoTorta from '../components/ui/GraficoTorta.jsx'
import GraficoLinea from '../components/ui/GraficoLinea.jsx'
import Loader from '../components/ui/Loader.jsx'
import MiCarteraDashboard from './MiCarteraDashboard.jsx'
import { money, num, pct } from '../utils/format.js'

const PERIODO_DEFAULT = '202512'

// Color del nivel de mora (referencia de los reportes: <5 ok, 5–10 medio, >10 alto).
function colorMora(r) {
  if (r > 10) return '#dc2626'
  if (r >= 5) return '#d97706'
  return '#16a34a'
}

function DashboardInstitucional() {
  const { user } = useAuth()
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT)
  const { kpis, productividad, historico, loading, errores } = useDashboard(
    periodomes,
    user?.codagencia,
  )

  const verProductividad = puede(user?.rol, 'ver_productividad')

  // Desembolsos: endpoint independiente con su propio período (datos 202501–202506).
  const [desemPeriodo, setDesemPeriodo] = useState('202506')
  const { desembolsos, loading: loadingDes, error: errorDes } = useDesembolsos(desemPeriodo)
  const maxOfic = Math.max(1, ...(desembolsos?.por_oficina || []).map((o) => o.volumen))
  const maxZona = Math.max(1, ...(desembolsos?.por_zona || []).map((z) => z.volumen))

  const dataMora = kpis
    ? [
        { name: 'Vigente', value: Number(kpis.cartera_vigente || 0) },
        { name: 'Vencida', value: Number(kpis.cartera_vencida || 0) },
      ]
    : []

  // Agregaciones desde la evolución histórica (real, ratiomora_real por período/tipo).
  const { moraPorPeriodo, colocPorPeriodo, moraPorTipo } = useMemo(() => {
    const porPeriodo = {}
    const colocPer = {}
    for (const r of historico) {
      const p = r.periodomes
      if (!porPeriodo[p]) porPeriodo[p] = { suma: 0, n: 0 }
      porPeriodo[p].suma += Number(r.ratiomora_real || 0)
      porPeriodo[p].n += 1
      if (!colocPer[p]) colocPer[p] = { periodomes: p, real: 0, meta: 0 }
      colocPer[p].real += Number(r.saldocolocaciones_real || 0)
      colocPer[p].meta += Number(r.saldocolocaciones_meta || 0)
    }
    const moraPorPeriodo = Object.keys(porPeriodo)
      .sort()
      .map((p) => ({ periodomes: String(p), ratio: +(porPeriodo[p].suma / porPeriodo[p].n).toFixed(2) }))
    const colocPorPeriodo = Object.values(colocPer).sort((a, b) =>
      String(a.periodomes).localeCompare(String(b.periodomes)),
    )
    // Mora por tipo en el último período disponible.
    const periodos = Object.keys(porPeriodo).sort()
    const ultimo = periodos[periodos.length - 1]
    const moraPorTipo = historico
      .filter((r) => String(r.periodomes) === String(ultimo))
      .map((r) => ({ tipo: r.codtipocredito, ratio: Number(r.ratiomora_real || 0) }))
      .sort((a, b) => b.ratio - a.ratio)
    return { moraPorPeriodo, colocPorPeriodo, moraPorTipo }
  }, [historico])

  const maxMoraTipo = Math.max(10, ...moraPorTipo.map((m) => m.ratio))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Dashboard institucional</h1>
          <p className="page-subtitle">
            Cartera, mora y colocaciones {verProductividad && '· productividad de asesores'}.
          </p>
        </div>
        <div className="field" style={{ maxWidth: 180 }}>
          <label>Período (AAAAMM)</label>
          <input type="text" value={periodomes} onChange={(e) => setPeriodomes(e.target.value)} />
        </div>
      </div>

      {loading && (
        <div className="card">
          <Loader texto="Cargando indicadores…" />
        </div>
      )}

      {!loading && (
        <>
          {/* KPIs de cartera */}
          {kpis ? (
            <div className="grid grid-kpi" style={{ marginBottom: 20 }}>
              <KpiCard label="Cartera total" valor={money(kpis.cartera_total)} />
              <KpiCard label="Cartera vigente" valor={money(kpis.cartera_vigente)} color="var(--c-verde)" />
              <KpiCard label="Cartera vencida" valor={money(kpis.cartera_vencida)} color="var(--c-rojo)" />
              <KpiCard label="Ratio de mora" valor={pct(kpis.ratio_mora)} color="var(--c-amarillo)" />
              <KpiCard label="Créditos activos" valor={num(kpis.n_creditos_activos)} />
              <KpiCard label="Clientes deudores" valor={num(kpis.n_clientes_deudores)} />
            </div>
          ) : (
            errores.kpis && (
              <div className="alert alert--error">
                <strong>KPIs de cartera</strong> (<code>/dashboard/kpis</code>): {errores.kpis}
              </div>
            )
          )}

          {/* Composición de cartera + Evolución del ratio de mora */}
          <div className="grid grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Composición de cartera</h3>
              {kpis ? <GraficoTorta data={dataMora} /> : <p className="page-subtitle">Sin datos de cartera.</p>}
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Evolución del ratio de mora</h3>
              {errores.historico ? (
                <div className="alert alert--error">
                  <code>/dashboard/evolucion-historica</code>: {errores.historico}
                </div>
              ) : (
                <GraficoLinea data={moraPorPeriodo} xKey="periodomes" yKey="ratio" color="#dc2626" refY={10} refLabel="Límite 10%" sufijo="%" />
              )}
            </div>
          </div>

          {/* Evolución de colocaciones + Mora por tipo */}
          <div className="grid grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Evolución de colocaciones</h3>
              <p className="page-subtitle" style={{ marginTop: -6 }}>Saldo real vs. meta por período.</p>
              {errores.historico ? (
                <div className="alert alert--error">{errores.historico}</div>
              ) : (
                <GraficoBarras
                  data={colocPorPeriodo}
                  xKey="periodomes"
                  barras={[
                    { key: 'real', label: 'Saldo real', color: '#0F265C' },
                    { key: 'meta', label: 'Meta', color: '#FFDD00' },
                  ]}
                />
              )}
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Mora por tipo de crédito</h3>
              <p className="page-subtitle" style={{ marginTop: -6 }}>Ratio de mora del último período.</p>
              {moraPorTipo.length === 0 ? (
                <p className="page-subtitle">Sin datos.</p>
              ) : (
                <div className="barlist">
                  {moraPorTipo.map((m) => (
                    <div className="barlist__row" key={m.tipo}>
                      <span className="barlist__label">{m.tipo}</span>
                      <div className="barlist__track">
                        <div
                          className="barlist__fill"
                          style={{ width: `${Math.min((m.ratio / maxMoraTipo) * 100, 100)}%`, background: colorMora(m.ratio) }}
                        />
                      </div>
                      <span className="barlist__val" style={{ color: colorMora(m.ratio) }}>
                        {pct(m.ratio)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desembolsos */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ marginTop: 0 }}>Desembolsos</h3>
                <p className="page-subtitle" style={{ marginTop: -6 }}>
                  Volumen del mes y acumulado anual · por oficina y zona.
                </p>
              </div>
              <div className="field" style={{ maxWidth: 170 }}>
                <label>Mes (AAAAMM)</label>
                <input type="text" value={desemPeriodo} onChange={(e) => setDesemPeriodo(e.target.value)} placeholder="Ej. 202506" />
              </div>
            </div>

            {loadingDes && <Loader texto="Cargando desembolsos…" />}
            {errorDes && <div className="alert alert--error"><code>/dashboard/desembolsos</code>: {errorDes}</div>}

            {!loadingDes && !errorDes && desembolsos && (
              <>
                <div className="grid grid-kpi" style={{ margin: '10px 0 18px' }}>
                  <KpiCard label="Desembolsos del mes" valor={money(desembolsos.mes.volumen)} color="#0F265C" />
                  <KpiCard label="N° créditos (mes)" valor={num(desembolsos.mes.n_creditos)} />
                  <KpiCard label="Ticket promedio" valor={money(desembolsos.mes.ticket_promedio)} color="var(--c-magenta)" />
                  <KpiCard label={`Desembolsos del año ${desembolsos.anio}`} valor={money(desembolsos.anual.volumen)} color="var(--c-verde)" />
                </div>

                {desembolsos.mes.n_creditos === 0 ? (
                  <p className="page-subtitle">Sin desembolsos en este mes. (Datos de ejemplo: 202501–202506.)</p>
                ) : (
                  <div className="grid grid-2">
                    <div>
                      <h4 style={{ margin: '0 0 12px' }}>Por oficina</h4>
                      <div className="barlist">
                        {desembolsos.por_oficina.map((o) => (
                          <div className="barlist__row" style={{ gridTemplateColumns: '150px 1fr 110px' }} key={o.codagencia}>
                            <span className="barlist__label">{o.desagencia}</span>
                            <div className="barlist__track">
                              <div className="barlist__fill" style={{ width: `${(o.volumen / maxOfic) * 100}%`, background: '#0F265C' }} />
                            </div>
                            <span className="barlist__val">{money(o.volumen)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 12px' }}>Por zona</h4>
                      <div className="barlist">
                        {desembolsos.por_zona.map((z) => (
                          <div className="barlist__row" style={{ gridTemplateColumns: '150px 1fr 110px' }} key={z.codzonacomercial}>
                            <span className="barlist__label">{z.deszonacomercial}</span>
                            <div className="barlist__track">
                              <div className="barlist__fill" style={{ width: `${(z.volumen / maxZona) * 100}%`, background: '#E8C496' }} />
                            </div>
                            <span className="barlist__val">{money(z.volumen)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Productividad de asesores — solo jefaturas/gerencia */}
          {verProductividad && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Productividad de asesores</h3>
              {errores.productividad ? (
                <div className="alert alert--error">
                  <code>/dashboard/productividad-asesores</code>: {errores.productividad}
                </div>
              ) : productividad.length === 0 ? (
                <p className="page-subtitle">Sin datos de productividad.</p>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Asesor</th>
                      <th className="num">Saldo real</th>
                      <th className="num">Meta</th>
                      <th className="num">Cumplimiento</th>
                      <th>Semáforo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productividad.map((p) => (
                      <tr key={p.codasesor}>
                        <td>{p.nomasesor}</td>
                        <td className="num">{money(p.saldo_real)}</td>
                        <td className="num">{money(p.saldo_meta)}</td>
                        <td className="num">{pct(p.cumplimiento_pct)}</td>
                        <td>
                          <Semaforo estado={p.semaforo} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Selector por rol:
 *  - jefaturas/gerencia/operaciones → dashboard institucional (toda la cartera).
 *  - asesor (u otros) → dashboard de su propia cartera.
 */
export default function DashboardPage() {
  const { user } = useAuth()
  return puede(user?.rol, 'ver_dashboard_institucional') ? (
    <DashboardInstitucional />
  ) : (
    <MiCarteraDashboard />
  )
}
