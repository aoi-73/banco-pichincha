/**
 * Contratos del módulo de ahorros (campos reales del backend).
 * Nota: el parámetro de período es una fecha yyyymmdd (ej. 20251231).
 *
 * @typedef {Object} ResumenAhorroTipo  GET /ahorros/resumen-agencia/{codagencia}
 * @property {string} tipo          código de tipo de cuenta de ahorro
 * @property {number} n_cuentas
 * @property {number} saldo_total   suma de montosaldocapitaltotal
 *
 * @typedef {Object} CuentaAhorro  GET /ahorros/cliente/{codcliente} | /ahorros/{cod}
 * @property {string} codcuentaahorro
 * @property {string} nomcliente
 * @property {string} [numerodocumentoidentidad]
 * @property {string} tipo_cuenta
 * @property {number} montosaldocapitaltotal
 * @property {number} montosaldointerestotal
 * @property {number} tasaefectivaanual
 * @property {string} fechaaperturacuenta
 */
export {}
