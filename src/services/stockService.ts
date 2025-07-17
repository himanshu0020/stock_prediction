import { StockData, PredictionRequest, PredictionResponse } from '../types';

// Mock historical data generator
const generateMockHistoricalData = (symbol: string): StockData[] => {
  const data: StockData[] = [];
  const basePrice = Math.random() * 200 + 50; // Random base price between 50-250
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const randomChange = (Math.random() - 0.5) * 10; // ±5% change
    const price = Math.max(basePrice + randomChange * (i / 30), 10);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }
  
  return data;
};

// Mock OpenAI prediction (replace with actual API call)
const generateMockPrediction = (historicalData: StockData[]): StockData[] => {
  const lastPrice = historicalData[historicalData.length - 1].price;
  const predictions: StockData[] = [];
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Generate prediction with slight upward bias
    const change = (Math.random() - 0.4) * 5; // Slightly bullish bias
    const price = Math.max(lastPrice + change, 10);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }
  
  return predictions;
};

export const stockService = {
  async getHistoricalData(symbol: string): Promise<StockData[]> {
    // In a real app, this would call a stock API like Alpha Vantage
    return generateMockHistoricalData(symbol);
  },

  async getPrediction(request: PredictionRequest): Promise<PredictionResponse> {
    // In a real app, this would call OpenAI API
    // For now, we'll use mock data
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const predicted_data = generateMockPrediction(request.historical_data);
      
      return {
        symbol: request.symbol,
        predicted_data
      };
    } catch (error) {
      throw new Error('Failed to generate prediction');
    }
  }
};