import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StockData } from '../types';

interface StockChartProps {
  historicalData: StockData[];
  predictedData: StockData[];
  symbol: string;
}

export const StockChart: React.FC<StockChartProps> = ({
  historicalData,
  predictedData,
  symbol,
}) => {
  // Combine historical and predicted data
  const chartData = [
    ...historicalData.map(d => ({
      date: d.date,
      historical: d.price,
      predicted: null,
    })),
    ...predictedData.map(d => ({
      date: d.date,
      historical: null,
      predicted: d.price,
    })),
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {symbol.toUpperCase()} Stock Price Prediction
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value, name) => [
              `$${value?.toFixed(2)}`,
              name === 'historical' ? 'Historical' : 'Predicted'
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            name="Historical"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Predicted"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};