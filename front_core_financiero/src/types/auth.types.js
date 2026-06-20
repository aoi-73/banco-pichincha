/**
 * Contratos del módulo de autenticación. Espejo de sch_auth.py.
 *
 * @typedef {Object} LoginIn
 * @property {string} numerodni  DNI del personal.
 * @property {string} password   En desarrollo: igual al DNI.
 *
 * @typedef {Object} TokenOut
 * @property {string} access_token  JWT firmado (HS256).
 * @property {string} token_type    Habitualmente "bearer".
 * @property {number} codpersonal   Código del personal autenticado.
 * @property {string} nombre        Nombre del usuario.
 * @property {string} rol           Rol/cargo del usuario.
 * @property {string} codagencia    Agencia a la que pertenece.
 * @property {number} [pkasesor]    PK del asesor (null si no tiene cartera asignada).
 * @property {string} [codasesor]   Código de asesor (p. ej. AS0031).
 */
export {}
