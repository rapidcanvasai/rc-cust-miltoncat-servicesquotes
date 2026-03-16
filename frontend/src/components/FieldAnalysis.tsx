import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';
import { DataRecord } from '../types';

interface FieldAnalysisProps {
  data: DataRecord[];
  fieldName: string;
}

interface FieldStats {
  distinct: number;
  nullCount: number;
  patterns: { [key: string]: number };
  numericalStats?: {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
  };
}

export default function FieldAnalysis({ data, fieldName }: FieldAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateFieldStats = (): FieldStats => {
    const values = data.map(record => record[fieldName]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const numericalValues = nonNullValues
      .map(v => typeof v === 'string' ? parseFloat(v) : v)
      .filter(v => !isNaN(v as number)) as number[];

    const patterns: { [key: string]: number } = {};
    nonNullValues.forEach(value => {
      const pattern = typeof value === 'string' 
        ? value.replace(/[A-Z]/g, 'A')
          .replace(/[a-z]/g, 'a')
          .replace(/[0-9]/g, '9')
        : typeof value;
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    });

    const stats: FieldStats = {
      distinct: new Set(values).size,
      nullCount: values.length - nonNullValues.length,
      patterns,
    };

    if (numericalValues.length > 0) {
      const sorted = [...numericalValues].sort((a, b) => a - b);
      const mean = numericalValues.reduce((a, b) => a + b, 0) / numericalValues.length;
      const median = sorted[Math.floor(sorted.length / 2)];
      const variance = numericalValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numericalValues.length;

      stats.numericalStats = {
        min: Math.min(...numericalValues),
        max: Math.max(...numericalValues),
        mean,
        median,
        stdDev: Math.sqrt(variance),
      };
    }

    return stats;
  };

  const stats = calculateFieldStats();
  const distributionData = Object.entries(stats.patterns)
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">{fieldName}</h3>
          {stats.nullCount > 0 && (
            <div className="flex items-center text-yellow-500" title={`${stats.nullCount} null values`}>
              <AlertCircle size={16} />
            </div>
          )}
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-3">Basic Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Values</span>
                  <span className="font-medium">{data.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distinct Values</span>
                  <span className="font-medium">{stats.distinct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Missing Values</span>
                  <span className="font-medium">{stats.nullCount}</span>
                </div>
                {stats.numericalStats && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min</span>
                      <span className="font-medium">{stats.numericalStats.min.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max</span>
                      <span className="font-medium">{stats.numericalStats.max.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mean</span>
                      <span className="font-medium">{stats.numericalStats.mean.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Median</span>
                      <span className="font-medium">{stats.numericalStats.median.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard Deviation</span>
                      <span className="font-medium">{stats.numericalStats.stdDev.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <h4 className="text-sm font-semibold text-gray-600">Pattern Distribution</h4>
                <div className="group relative">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                    A: uppercase letter<br />
                    a: lowercase letter<br />
                    9: digit<br />
                    Other characters shown as is
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="pattern" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}