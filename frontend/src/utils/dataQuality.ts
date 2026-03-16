import { DataQualityMetrics, DataRecord, DataProfile } from '../types';

export function calculateDataQualityMetrics(data: DataRecord[]): DataQualityMetrics {
  if (!data.length) {
    return {
      totalRecords: 0,
      completenessScore: 0,
      uniquenessScore: 0,
      fields: [],
    };
  }

  const fields = Object.keys(data[0]);
  const totalRecords = data.length;

  const fieldProfiles = fields.map((field): DataProfile => {
    const values = data.map(record => record[field]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const numericValues = nonNullValues
      .map(v => typeof v === 'string' ? parseFloat(v) : v)
      .filter(v => !isNaN(v as number)) as number[];

    const uniqueValues = new Set(values).size;
    const completeness = (nonNullValues.length / totalRecords) * 100;

    // Calculate statistics for numeric fields
    const stats = numericValues.length ? {
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
    } : {};

    // Simple outlier detection using IQR method for numeric fields
    let outliers = 0;
    if (numericValues.length) {
      const sorted = [...numericValues].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length / 4)];
      const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      outliers = numericValues.filter(v => v < lowerBound || v > upperBound).length;
    }

    return {
      fieldName: field,
      completeness,
      uniqueValues,
      outliers,
      ...stats,
    };
  });

  const avgCompleteness = fieldProfiles.reduce((sum, field) => sum + field.completeness, 0) / fields.length;
  const avgUniqueness = fieldProfiles.reduce((sum, field) => 
    sum + (field.uniqueValues / totalRecords) * 100, 0) / fields.length;

  return {
    totalRecords,
    completenessScore: avgCompleteness,
    uniquenessScore: avgUniqueness,
    fields: fieldProfiles,
  };
}