import React from 'react';
import classNames from 'classnames';

export default function PreviewTable({ data, errors, onConfirm, onCancel, loading }) {
  if (!data || data.length === 0) return null;

  let columns = Object.keys(data[0]);
  // If this is a course upload and 'program' is not present, add it as the first column
  if (data[0].code && data[0].name && !columns.includes('program')) {
    columns = ['program', ...columns];
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-accent">
          Preview ({data.length} {data[0].code ? 'courses' : 'students'})
        </h3>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-300 text-gray-700 rounded-xl px-6 py-2 font-semibold hover:bg-gray-400 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-accent text-white rounded-xl px-6 py-2 font-semibold hover:bg-pastelBlue hover:text-accent transition disabled:opacity-50"
          >
            {loading ? 'Importing...' : `Import ${data.length} ${data[0].code ? 'Courses' : 'Students'}`}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pastelBlue">
              <tr>
                {columns.map(column => (
                  <th key={column} className="px-4 py-3 text-left font-semibold text-accent">
                    {column}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold text-accent">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const rowErrors = errors.filter(error => error.row === index + 2);
                const hasErrors = rowErrors.length > 0;
                return (
                  <tr
                    key={index}
                    className={classNames('border-b', {
                      'bg-red-50': hasErrors,
                      'hover:bg-gray-50': !hasErrors
                    })}
                  >
                    {columns.map(column => (
                      <td key={column} className="px-4 py-3">
                        {row[column] || (column === 'program' ? '-' : '-')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      {hasErrors ? (
                        <div className="text-red-500 text-sm">
                          {rowErrors.map((error, i) => (
                            <div key={i}>{error.errors[0]?.message}</div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-500 text-sm">✓ Valid</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-semibold text-red-700 mb-2">
            {errors.length} row(s) have validation errors
          </h4>
          <div className="text-sm text-red-600">
            Please fix the errors before importing, or remove invalid rows.
          </div>
        </div>
      )}
    </div>
  );
} 