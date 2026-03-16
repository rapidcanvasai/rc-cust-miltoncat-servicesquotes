import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { DataPoint } from '../types';

interface DataInputProps {
  data: DataPoint[];
  onDataChange: (data: DataPoint[]) => void;
}

export default function DataInput({ data, onDataChange }: DataInputProps) {
  const [month, setMonth] = useState('');
  const [demand, setDemand] = useState('');

  const handleAdd = () => {
    if (month && demand) {
      onDataChange([...data, { month, demand: Number(demand) }]);
      setMonth('');
      setDemand('');
    }
  };

  const handleRemove = (index: number) => {
    onDataChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Historical Data Input</h2>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <input
              id="month"
              type="text"
              placeholder="e.g., Jan 2024"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="demand" className="block text-sm font-medium text-gray-700 mb-1">
              Demand
            </label>
            <input
              id="demand"
              type="number"
              placeholder="Enter value"
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <PlusCircle size={20} />
          Add Data Point
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Month</th>
              <th className="px-4 py-2 text-left">Demand</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.month}</td>
                <td className="px-4 py-2">{item.demand}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}