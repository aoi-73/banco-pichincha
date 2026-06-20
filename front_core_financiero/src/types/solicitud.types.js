/**
 * Contratos del flujo de solicitudes de crédito (MPR-003-CRE).
 * Espejo de sch_creditos.py + respuestas de ctl_creditos.
 *
 * @typedef {Object} SolicitudIn  POST /creditos/solicitudes
 * @property {string} codcliente
 * @property {number} montosolicitud
 * @property {number} plazo                 meses
 * @property {('ME'|'PE'|'CO')} codtipocredito
 * @property {string} codactividadeconomica
 * @property {number} montoingresoneto
 * @property {string} codasesor
 * @property {number} [endeudamiento_global]       deuda en el sistema financiero
 * @property {number} [cuotas_sistema_financiero]  cuotas mensuales en otras entidades
 * @property {number} [n_entidades]                n.º de entidades (incl. La Caja)
 * @property {number} [gastos_familiares]          egresos familiares mensuales
 * @property {boolean} [es_recurrente]             cliente recurrente
 *
 * @typedef {Object} Elegibilidad
 * @property {('APTO'|'NO_APTO'|'REQUIERE_OPINION_RIESGOS')} resultado
 * @property {string} calificacion
 * @property {string[]} motivos
 * @property {boolean} requiere_opinion_riesgos
 * @property {boolean} [observado]
 *
 * @typedef {Object} RatioRds
 * @property {number} [valor_pct]
 * @property {number} [valor_veces]
 * @property {number} [valor]
 * @property {number} apetito
 * @property {number} tolerancia
 * @property {('VERDE'|'AMARILLO'|'ROJO')} semaforo
 *
 * @typedef {Object} Rds
 * @property {string} tipo_evaluado
 * @property {number} excedente
 * @property {number} cuota_total
 * @property {Record<string,RatioRds>} ratios
 * @property {('VERDE'|'AMARILLO'|'ROJO')} semaforo_global
 * @property {boolean} expuesto_rds
 *
 * @typedef {Object} RutaAprobacion
 * @property {number} monto_propuesto
 * @property {boolean} requiere_opinion_admin
 * @property {boolean} requiere_opinion_jefe_regional
 * @property {boolean} requiere_opinion_riesgos
 * @property {string[]} pasos
 *
 * @typedef {Object} SolicitudCreada  respuesta de POST /creditos/solicitudes
 * @property {string} codsolicitud
 * @property {string} estado
 * @property {boolean} observada
 * @property {string} creado_por
 * @property {Elegibilidad} elegibilidad
 * @property {import('./scoring.types.js').ScoringOut} scoring
 * @property {Rds} rds
 * @property {{codigo:string, descripcion:string}} nivel_aprobacion
 * @property {RutaAprobacion} ruta_aprobacion
 *
 * @typedef {Object} SolicitudDetalle  GET /creditos/solicitudes/{cod}
 * @property {number} pksolicitud
 * @property {string} codsolicitud
 * @property {string} nomcliente
 * @property {number} montosolicitudcredito
 * @property {number} plazosolicitudcredito
 * @property {string} codtiposolicitud
 * @property {number} pksolicitudestado
 * @property {string} dessolicitudestado
 * @property {string} desnivelaprobacion
 * @property {number} montoaprobadocredito
 * @property {string} fechaaprobacioncredito
 * @property {string} desmotivosolicitud
 * @property {string} fechasolicitudcredito
 */
export {}
