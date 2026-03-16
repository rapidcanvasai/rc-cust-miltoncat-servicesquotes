import React from 'react';
import { DataProfile } from '../types';
import { AlertCircle } from 'lucide-react';

interface FieldProfileTableProps {
  fields: DataProfile[];
}

export default function FieldProfileTable({ fields }: FieldProfileTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Field Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completeness
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unique Values
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outliers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistics
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field) => (
              <tr key={field.fieldName}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {field.fieldName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-16">{field.completeness.toFixed(1)}%</div>
                    {field.completeness < 90 && (
                      <AlertCircle className="w-4 h-4 text-yellow-500 ml-2" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {field.uniqueValues}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-16">{field.outliers}</div>
                    {field.outliers > 0 && (
                      <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {field.min !== undefined && (
                    <div>
                      Min: {field.min.toFixed(2)}<br />
                      Max: {field.max?.toFixed(2)}<br />
                      Mean: {field.mean?.toFixed(2)}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}