/**
 * Contratos del dashboard (campos reales del backend).
 *
 * @typedef {Object} KpisOut  GET /dashboard/kpis
 * @property {number} periodo
 * @property {number} cartera_total
 * @property {number} cartera_vigente
 * @property {number} cartera_vencida
 * @property {number} ratio_mora
 * @property {number} n_creditos_activos
 * @property {number} n_clientes_deudores
 * @property {number} captaciones_total   placeholder = 0
 * @property {number} captaciones_ac
 * @property {number} captaciones_pf
 * @property {number} captaciones_cts
 *
 * @typedef {Object} ProductividadAsesor  GET /dashboard/productividad-asesores
 * @property {string} codasesor
 * @property {string} nomasesor
 * @property {number} saldo_real
 * @property {number} saldo_meta
 * @property {number} cumplimiento_pct
 * @property {number} nroclientes_real
 * @property {number} nroclientes_meta
 * @property {number} ratiomora_real
 * @property {('VERDE'|'AMARILLO'|'ROJO')} semaforo
 *
 * @typedef {Object} EvolucionHistorica  GET /dashboard/evolucion-historica
 * @property {number} periodomes
 * @property {string} codtipocredito
 * @property {number} saldocolocaciones_real
 * @property {number} saldocolocaciones_meta
 * @property {number} ratiomora_real
 */
export {}
