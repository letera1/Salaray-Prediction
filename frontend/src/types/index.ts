export interface PredictionRequest {
  experience: number;
  test_score: number;
  department: string;
  education_level: string;
  location?: string;
}

export interface PredictionResult {
  predicted_salary_etb: number;
  predicted_salary_usd: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  model_info: {
    model_type: string;
    features_used: string[];
    accuracy: string;
  };
  timestamp: string;
}

export interface DataStats {
  total_records: number;
  salary_range_etb: {
    min: number;
    max: number;
    mean: number;
    median: number;
  };
  salary_range_usd: {
    min: number;
    max: number;
    mean: number;
    median: number;
  };
  departments: string[];
  education_levels: string[];
  locations: string[];
  average_experience: number;
}

export interface SalaryInsights {
  by_department: Record<string, { mean: number; count: number }>;
  by_education: Record<string, { mean: number; count: number }>;
  by_location: Record<string, { mean: number; count: number }>;
  experience_correlation: number;
  top_paying_cities: Record<string, number>;
  salary_distribution: {
    percentiles: {
      '25th': number;
      '50th': number;
      '75th': number;
      '90th': number;
    };
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface FormData {
  experience: string;
  test_score: string;
  department: string;
  education_level: string;
  location: string;
}