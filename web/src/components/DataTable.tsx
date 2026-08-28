type Column<T> = { key: keyof T; header: string; render?: (row: T) => React.ReactNode };

/**
 * Minimal typed data table for Admin/Logs pages.
 */
export function DataTable<T extends { id: string }>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="text-left px-4 py-3 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3 text-gray-700">
                    {c.render ? c.render(row) : String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
