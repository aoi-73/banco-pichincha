/**
 * Contratos del módulo de créditos (campos reales del backend).
 *
 * @typedef {Object} CreditoCartera  GET /creditos/cartera
 * @property {string} codcuentacredito
 * @property {string} nomcliente
 * @property {string} numerodocumentoidentidad
 * @property {number} montosaldocapital
 * @property {number} diasatrasocredito
 * @property {number} car_vig_capital   capital vigente
 * @property {number} car_ven_capital   capital vencido
 * @property {number} saldoprovisiones
 * @property {string} calificacion
 *
 * @typedef {Object} CreditoDetalle  GET /creditos/{codcuentacredito}
 * @property {string} codcuentacredito
 * @property {string} nomcliente
 * @property {string} numerodocumentoidentidad
 * @property {number} montoaprobadocredito
 * @property {number} nrocuotaaprobado
 * @property {number} tasainterescompensatoria
 * @property {string} fechaaprobacioncredito
 * @property {number} montosaldocapital
 * @property {number} montosaldointeres
 * @property {number} diasatrasocredito
 * @property {number} montosaldocliente
 *
 * @typedef {Object} CuotaCronograma  GET /creditos/{codcuentacredito}/cronograma
 * @property {number} nrocuota
 * @property {string} fechavencimientopagocuota
 * @property {number} montocapitalprogramado
 * @property {number} montointeresprogramado
 * @property {number} montocuota
 * @property {number} montosaldo
 * @property {string} codestadocuota
 */
export {}
