import { DataPoint, ForecastResult } from '../types';

// Simple moving average calculation
export const calculateMovingAverage = (data: DataPoint[], periods: number = 3): ForecastResult[] => {
  const results: ForecastResult[] = [];
  
  // Calculate moving average
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;
    
    // Look back 'periods' number of months
    for (let j = Math.max(0, i - periods + 1); j <= i; j++) {
      sum += data[j].demand;
      count++;
    }
    
    results.push({
      month: data[i].month,
      actual: data[i].demand,
      forecast: sum / count
    });
  }
  
  // Add one future forecast
  if (data.length > 0) {
    const lastPeriods = data.slice(-periods);
    const sum = lastPeriods.reduce((acc, curr) => acc + curr.demand, 0);
    results.push({
      month: 'Next Month',
      forecast: sum / periods
    });
  }
  
  return results;
};