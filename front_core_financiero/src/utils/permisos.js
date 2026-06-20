/**
 * Matriz de permisos del flujo de otorgamiento (espejo de cfg_roles.py §7).
 * El backend la valida vía requiere_rol/puede; aquí la replicamos solo para
 * habilitar/ocultar acciones en la UI. La fuente de verdad sigue siendo el backend.
 */
export const PERMISOS = {
  crear_solicitud: ['asesor', 'administrador'],
  opinion_admin: ['administrador'],
  opinion_jefe_reg: ['jefe_regional'],
  opinion_riesgos: ['riesgos', 'analista'],
  enviar_comite: ['asesor', 'administrador'],
  resolver_comite: ['comite', 'administrador', 'gerencia'],
  // Recuperaciones / mora (espejo de cfg_roles.py).
  consultar_mora: ['asesor', 'administrador', 'riesgos', 'gerencia', 'analista'],
  gestionar_cobranza: ['asesor', 'administrador'],
  derivar_judicial: ['administrador', 'gerencia'],
  castigar_credito: ['comite', 'gerencia'],
  // Captaciones/ahorros: el asesor de negocios NO accede; sí la administración.
  ver_ahorros: ['administrador', 'gerencia', 'operaciones'],
  // Productividad de asesores: solo jefaturas/gerencia (el asesor NO la ve).
  ver_productividad: ['administrador', 'jefe_regional', 'gerencia'],
  // Dashboard institucional (toda la cartera/desembolsos). El asesor ve solo SU cartera.
  ver_dashboard_institucional: ['administrador', 'jefe_regional', 'gerencia', 'operaciones'],
}

/** ¿El rol puede ejecutar la acción? */
export function puede(rol, accion) {
  return (PERMISOS[accion] || []).includes(rol)
}

// Estados de dsolicitud (espejo de rep_solicitudes).
export const ESTADO = {
  EN_EVALUACION: 1,
  APROBADO: 2,
  RECHAZADO: 3,
  DESEMBOLSADO: 4,
  ANULADO: 5,
  EN_COMITE: 6,
}

// Mapea estado → color de badge de semáforo (reutiliza clases existentes).
export const ESTADO_BADGE = {
  1: 'badge--amarillo', // En Evaluación
  2: 'badge--verde', // Aprobado
  3: 'badge--rojo', // Rechazado
  4: 'badge--verde', // Desembolsado
  5: 'badge--neutral', // Anulado
  6: 'badge--amarillo', // En Comité
}

// Tipos de opinión que existen, con su acción de permiso asociada.
export const OPINIONES = [
  { tipo: 'admin', accion: 'opinion_admin', label: 'Opinión de Administrador' },
  { tipo: 'jefe_reg', accion: 'opinion_jefe_reg', label: 'Opinión de Jefe Regional' },
  { tipo: 'riesgos', accion: 'opinion_riesgos', label: 'Opinión de Riesgos' },
]

// Bandas de mora (espejo de rep_recuperaciones). Orden de severidad creciente.
// `color` para KPIs/celdas; semáforo: preventiva amarillo claro → castigo negro.
export const BANDAS = [
  { cod: 'AL_DIA', label: 'Al día', color: '#16a34a' },
  { cod: 'PREVENTIVA', label: 'Preventiva', color: '#facc15' },
  { cod: 'TEMPRANA', label: 'Temprana', color: '#eab308' },
  { cod: 'TARDIA', label: 'Tardía', color: '#ea580c' },
  { cod: 'JUDICIAL', label: 'Judicial', color: '#dc2626' },
  { cod: 'CASTIGO', label: 'Castigo', color: '#334155' },
]

// Bandas gestionables (las que el backend acepta en el filtro ?banda=).
export const BANDAS_MORA = BANDAS.filter((b) => b.cod !== 'AL_DIA')

export const BANDA_INFO = Object.fromEntries(BANDAS.map((b) => [b.cod, b]))

// Umbrales de días de atraso para las transiciones de estado (espejo del backend).
export const UMBRAL_JUDICIAL = 121 // derivar a cobranza judicial: >= 121 días
export const UMBRAL_CASTIGO = 180 // castigo contable: > 180 días
