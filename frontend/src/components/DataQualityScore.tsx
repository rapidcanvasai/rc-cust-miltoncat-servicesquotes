import React from 'react';
import { CheckCircle as CircleCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface ScoreProps {
  label: string;
  score: number;
}

export default function DataQualityScore({ label, score }: ScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CircleCheck className="w-8 h-8" />;
    if (score >= 70) return <AlertTriangle className="w-8 h-8" />;
    return <AlertCircle className="w-8 h-8" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
        <div className={getScoreColor(score)}>
          {getScoreIcon(score)}
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className={`text-3xl font-semibold ${getScoreColor(score)}`}>
              {score.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
          <div
            style={{ width: `${score}%` }}
            className={`shadow-none flex flex-col whitespace-nowrap text-white justify-center ${
              getScoreColor(score).replace('text-', 'bg-')
            }`}
          />
        </div>
      </div>
    </div>
  );
}