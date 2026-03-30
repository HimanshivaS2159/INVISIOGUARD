import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  r => r,
  error => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    console.error('[API Error]', message);
    return Promise.reject(error);
  }
);

/* ─── Predict ─────────────────────────────────────────────── */
export interface PredictPayload {
  amount: number;
  is_night: number;
  new_location: number;
  new_device: number;
  user_id?: string;
  merchant_category?: string;
}

export interface PredictResponse {
  result: 'FRAUD' | 'SAFE';
  risk_score: number;
  risk_tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  analysis: {
    ml_model: { probability: number; prediction: string; score: number; processing_time_ms: number };
    behavioral: { score: number; reasons: string[]; transaction_count_24h: number; amount_velocity: number };
    location: { score: number; reason: string; ip_address: string };
    merchant: { category: string; risk_boost: number };
  };
  reasons: string[];
  feature_explanations: Record<string, string>;
  transaction_data: { amount: number; currency: string; merchant_category: string; timestamp: string; user_id: string };
  metadata: { model_version: string; analysis_timestamp: string; processing_time_ms: number };
}

export const predictFraud = (data: PredictPayload) =>
  api.post<PredictResponse>('/predict', data);

/* ─── Health ───────────────────────────────────────────────── */
export const healthCheck = () => api.get('/health');

/* ─── Model Info ───────────────────────────────────────────── */
export interface ModelInfo {
  model_status: string;
  model_type: string;
  features: string[];
  feature_importance: Record<string, number>;
  model_version: string;
  n_estimators: number;
  training_samples: number;
  accuracy: number;
  false_positive_rate: number;
}

export const getModelInfo = () => api.get<ModelInfo>('/model/info');

/* ─── User Profile ─────────────────────────────────────────── */
export interface UserProfile {
  user_id: string;
  total_transactions: number;
  avg_risk_score: number;
  average_transaction_amount?: number;
  risk_level: string;
  unique_locations?: number;
  unique_devices?: number;
  transactions_last_24h?: number;
  frequency_score?: number;
  last_transaction?: string | null;
  recent_transactions?: Array<{
    amount: number; risk_score: number; result: string;
    timestamp: string; reasons: string[]; merchant_category?: string;
  }>;
  transactions?: Array<{
    amount: number; risk_score: number; result: string;
    timestamp: string; reasons: string[]; merchant_category?: string;
  }>;
  behavioral_patterns?: string[];
}

export const getUserProfile = (userId: string) =>
  api.get<UserProfile>(`/user/${userId}/profile`);

/* ─── Analytics ────────────────────────────────────────────── */
export interface AnalyticsSummary {
  total_transactions: number;
  fraud_count: number;
  fraudulent_transactions: number;
  safe_count: number;
  safe_transactions: number;
  fraud_rate: number;
  avg_risk_score: number;
  average_risk_score: number;
  recent_transactions: Array<{
    user_id: string; amount: number; risk_score: number;
    result: string; timestamp: string; reasons: string[];
    merchant_category?: string; risk_tier?: string;
  }>;
  risk_distribution: Record<string, number>;
  hourly_trend: Array<{ hour: number; count: number; fraud: number }>;
  top_risk_factors?: Array<{ factor: string; count: number }>;
  last_updated?: string;
}

export const getAnalyticsSummary = () =>
  api.get<AnalyticsSummary>('/analytics/summary');

/* ─── Realtime Stats ───────────────────────────────────────── */
export interface RealtimeStats {
  total_transactions: number;
  fraud_detected: number;
  safe_transactions: number;
  fraud_rate: number;
  avg_risk_score: number;
  transactions_last_hour: number;
  fraud_last_hour: number;
  transactions_last_24h: number;
  risk_tier_distribution: { LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number };
  false_positives_saved: number;
  timestamp: string;
}

export const getRealtimeStats = () =>
  api.get<RealtimeStats>('/stats/realtime');

/* ─── Simulate ─────────────────────────────────────────────── */
export const simulateTransaction = (scenario: 'fraud' | 'safe' | 'random') =>
  api.post('/simulate', { scenario });

export default api;
