/**
 * Tabla reutilizable.
 * Props:
 *   columns: [{ key, header, align?, render?(row) }]
 *   rows:    array de objetos
 *   rowKey:  fn(row, i) -> key
 *   emptyText
 */
export default function Tabla({ columns, rows, rowKey, emptyText = 'No hay registros para mostrar.' }) {
  return (
    <div className="hb-table-wrap">
      <table className="hb-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={c.align === 'right' ? { textAlign: 'right' } : c.align === 'center' ? { textAlign: 'center' } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="hb-table-empty" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={rowKey ? rowKey(row, i) : i}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={c.align === 'right' ? 'num' : undefined}
                    style={c.align === 'center' ? { textAlign: 'center' } : undefined}
                  >
                    {c.render ? c.render(row, i) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
