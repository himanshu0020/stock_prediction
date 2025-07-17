import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Prediction } from '../types';
import { useAuth } from '../hooks/useAuth';

export const PredictionHistory: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPredictions();
    }
  }, [user]);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Predictions</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Predictions</h3>
      
      {predictions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No predictions yet. Make your first prediction above!
        </p>
      ) : (
        <div className="space-y-4">
          {predictions.map((prediction) => {
            const lastHistorical = prediction.historical_data[prediction.historical_data.length - 1];
            const firstPredicted = prediction.predicted_data[0];
            const isUpward = firstPredicted.price > lastHistorical.price;

            return (
              <div
                key={prediction.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg text-gray-900">
                      {prediction.symbol.toUpperCase()}
                    </span>
                    {isUpward ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(prediction.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Price:</span>
                    <span className="ml-2 font-medium">
                      ${lastHistorical.price.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Day Prediction:</span>
                    <span className={`ml-2 font-medium ${isUpward ? 'text-green-600' : 'text-red-600'}`}>
                      ${firstPredicted.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};