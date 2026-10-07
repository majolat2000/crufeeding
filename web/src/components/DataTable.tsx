import { FolderOpen } from 'lucide-react';

type Column<T> = { key: keyof T; header: string; render?: (row: T) => React.ReactNode };

/**
 * Minimal typed data table for Admin/Logs pages.
 */
export function DataTable<T extends { id: string }>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="text-left px-4 py-3.5 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-gray-50 rounded-full">
                      <FolderOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">No records found</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors duration-150 ease-in-out">
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {c.render ? c.render(row) : String(row[c.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
