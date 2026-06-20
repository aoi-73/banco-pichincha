import { formatMoney, toNumber } from '../../utils/format.js'
import { useUI } from '../../context/UIContext.jsx'

/**
 * Muestra un monto formateado como "S/ 1,234.56".
 * - `simbolo` permite cambiar a "US$".
 * - `signo` (de movimientos) colorea y antepone signo. El backend usa
 *   "E"=Egreso/débito y "I"=Ingreso/crédito; también se aceptan +/-, D/H, C.
 * - `colored` colorea positivo/negativo aunque no se pase signo explícito.
 */
export default function Money({ value, simbolo = 'S/', signo, colored = false, className = '', mask = true }) {
  const { hideAmounts } = useUI()
  const n = toNumber(value)
  let isNeg = n < 0
  let prefix = ''

  // Toggle "Ocultar importes": enmascara el monto manteniendo el símbolo.
  if (hideAmounts && mask) {
    return <span className={`hb-money ${className}`}>{simbolo} ••••••</span>
  }

  if (signo !== undefined && signo !== null && signo !== '') {
    const s = String(signo).trim().toUpperCase()
    if (s === '-' || s === 'E' || s === 'D' || s === 'DEBITO' || s === 'DÉBITO' || s === 'EGRESO') {
      isNeg = true
      prefix = '- '
    } else if (s === '+' || s === 'I' || s === 'H' || s === 'C' || s === 'CREDITO' || s === 'CRÉDITO' || s === 'INGRESO') {
      isNeg = false
      prefix = '+ '
    }
  }

  const colorClass = (colored || prefix)
    ? isNeg
      ? 'hb-money-neg'
      : 'hb-money-pos'
    : ''

  const absText = formatMoney(Math.abs(n), { simbolo })
  return <span className={`hb-money ${colorClass} ${className}`}>{prefix}{absText}</span>
}
