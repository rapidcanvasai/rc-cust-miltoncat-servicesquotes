import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForecastResult } from '../types';

interface ForecastChartProps {
  data: ForecastResult[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Forecast Visualization</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#8884d8" 
              name="Actual Demand"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#82ca9d" 
              name="Forecast"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}