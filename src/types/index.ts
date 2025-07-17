export interface User {
  id: string;
  email: string;
}

export interface StockData {
  date: string;
  price: number;
}

export interface Prediction {
  id: string;
  user_id: string;
  symbol: string;
  created_at: string;
  historical_data: StockData[];
  predicted_data: StockData[];
}

export interface PredictionRequest {
  symbol: string;
  historical_data: StockData[];
}

export interface PredictionResponse {
  symbol: string;
  predicted_data: StockData[];
}