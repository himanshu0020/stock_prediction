/*
  # Create predictions table

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `symbol` (text, stock symbol)
      - `created_at` (timestamp)
      - `historical_data` (jsonb, historical stock data)
      - `predicted_data` (jsonb, predicted stock data)

  2. Security
    - Enable RLS on `predictions` table
    - Add policy for authenticated users to manage their own predictions
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  created_at timestamptz DEFAULT now(),
  historical_data jsonb NOT NULL,
  predicted_data jsonb NOT NULL
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own predictions
CREATE POLICY "Users can manage own predictions" ON predictions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS predictions_user_id_idx ON predictions(user_id);
CREATE INDEX IF NOT EXISTS predictions_symbol_idx ON predictions(symbol);
CREATE INDEX IF NOT EXISTS predictions_created_at_idx ON predictions(created_at);