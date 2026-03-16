export interface DataProfile {
  fieldName: string;
  completeness: number;
  uniqueValues: number;
  outliers: number;
  min?: number;
  max?: number;
  mean?: number;
}

export interface DataQualityMetrics {
  totalRecords: number;
  completenessScore: number;
  uniquenessScore: number;
  fields: DataProfile[];
}

export interface DataRecord {
  [key: string]: string | number | null;
}