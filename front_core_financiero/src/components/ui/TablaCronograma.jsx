import { money } from '../../utils/format.js'

/**
 * Plan de pagos (cuotas) de un crédito — endpoint /creditos/{cod}/cronograma.
 * Datos de fplanpagomes, ordenados por número de cuota.
 */
export default function TablaCronograma({ cronograma = [] }) {
  if (!cronograma.length) {
    return <p className="page-subtitle">Sin cronograma disponible.</p>
  }

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Vencimiento</th>
          <th className="num">Capital</th>
          <th className="num">Interés</th>
          <th className="num">Cuota</th>
          <th className="num">Saldo</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {cronograma.map((q) => (
          <tr key={q.nrocuota}>
            <td>{q.nrocuota}</td>
            <td>{q.fechavencimientopagocuota}</td>
            <td className="num">{money(q.montocapitalprogramado)}</td>
            <td className="num">{money(q.montointeresprogramado)}</td>
            <td className="num">{money(q.montocuota)}</td>
            <td className="num">{money(q.montosaldo)}</td>
            <td>{q.codestadocuota ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
