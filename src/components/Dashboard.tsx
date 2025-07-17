import React, { useState } from 'react';
import { Search, LogOut, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { stockService } from '../services/stockService';
import { supabase } from '../lib/supabase';
import { StockChart } from './StockChart';
import { PredictionHistory } from './PredictionHistory';
import { StockData } from '../types';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [predictedData, setPredictedData] = useState<StockData[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState('');

  const handlePrediction = async () => {
    if (!symbol.trim()) return;

    setLoading(true);
    try {
      // Get historical data
      const historical = await stockService.getHistoricalData(symbol);
      
      // Get prediction
      const prediction = await stockService.getPrediction({
        symbol,
        historical_data: historical,
      });

      setHistoricalData(historical);
      setPredictedData(prediction.predicted_data);
      setCurrentSymbol(symbol);

      // Save prediction to database
      await supabase.from('predictions').insert({
        user_id: user?.id,
        symbol: symbol.toUpperCase(),
        historical_data: historical,
        predicted_data: prediction.predicted_data,
      });

    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePrediction();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">StockPredict AI</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stock Price Prediction
          </h2>
          
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <button
              onClick={handlePrediction}
              disabled={loading || !symbol.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Get Prediction'}
            </button>
          </div>
        </div>

        {/* Chart Section */}
        {currentSymbol && (
          <div className="mb-8">
            <StockChart
              historicalData={historicalData}
              predictedData={predictedData}
              symbol={currentSymbol}
            />
          </div>
        )}

        {/* Prediction History */}
        <PredictionHistory />
      </main>
    </div>
  );
};