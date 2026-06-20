/**
 * Contratos del motor de scoring. Espejo de sch_scoring.py.
 *
 * @typedef {Object} ScoringIn
 * @property {string} codcliente
 * @property {number} montosolicitud
 * @property {number} plazo                 Plazo en meses.
 * @property {('ME'|'PE'|'CO')} codtipocredito
 * @property {number} montoingresoneto
 * @property {string} codactividadeconomica CIIU.
 * @property {string} codasesor
 *
 * @typedef {Object} DetalleScore  cada factor es un objeto con su .puntaje
 * @property {{puntaje:number, cuota_estimada:number, ratio_cuota_ingreso:number}} capacidad_pago  máx 40
 * @property {{puntaje:number}} historial          máx 30
 * @property {{puntaje:number, codactividad:string}} sector_economico  máx 20
 * @property {{puntaje:number, meses:number}} plazo  máx 10
 * @property {number} score_total
 *
 * @typedef {Object} ScoringOut
 * @property {number} codcliente
 * @property {number} score                       0–100
 * @property {('APROBADO'|'OBSERVADO'|'RECHAZADO')} decision
 * @property {number} tea_sugerida
 * @property {number} cuota_estimada
 * @property {string[]} observaciones
 * @property {DetalleScore} detalle_score
 */
export {}
