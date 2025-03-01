
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS table is handled by Supabase Auth

-- Create SHELTERS table
CREATE TABLE IF NOT EXISTS shelters (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  contact_phone VARCHAR(20) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('operational', 'limited', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index on shelter status for efficient filtering
CREATE INDEX shelters_status_idx ON shelters(status);
CREATE INDEX shelters_user_id_idx ON shelters(user_id);

-- Create RESOURCES table
CREATE TABLE IF NOT EXISTS resources (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('Food', 'Water', 'Medical', 'Beds', 'Power', 'Other')),
  total_amount NUMERIC NOT NULL,
  unit VARCHAR(50) NOT NULL,
  shelter_id BIGINT REFERENCES shelters(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  alert_threshold NUMERIC NOT NULL DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for resources for efficient lookup and filtering
CREATE INDEX resources_category_idx ON resources(category);
CREATE INDEX resources_shelter_id_idx ON resources(shelter_id);
CREATE INDEX resources_user_id_idx ON resources(user_id);

-- Create DISASTERS table
CREATE TABLE IF NOT EXISTS disasters (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  location TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'monitoring', 'recovering', 'resolved')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for disasters for efficient filtering
CREATE INDEX disasters_status_idx ON disasters(status);
CREATE INDEX disasters_type_idx ON disasters(type);
CREATE INDEX disasters_started_at_idx ON disasters(started_at);
CREATE INDEX disasters_user_id_idx ON disasters(user_id);

-- Create PREDICTIONS table
CREATE TABLE IF NOT EXISTS predictions (
  id BIGSERIAL PRIMARY KEY,
  disaster_type VARCHAR(50) NOT NULL,
  location TEXT NOT NULL,
  probability NUMERIC NOT NULL CHECK (probability >= 0 AND probability <= 1),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  timeframe VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for predictions
CREATE INDEX predictions_disaster_type_idx ON predictions(disaster_type);
CREATE INDEX predictions_probability_idx ON predictions(probability);
CREATE INDEX predictions_user_id_idx ON predictions(user_id);

-- Create SHELTER_RESOURCES view for easy querying of shelter resources
CREATE OR REPLACE VIEW shelter_resources AS
SELECT 
  s.id AS shelter_id,
  s.name AS shelter_name,
  s.status AS shelter_status,
  r.id AS resource_id,
  r.name AS resource_name,
  r.category AS resource_category,
  r.total_amount,
  r.unit,
  r.alert_threshold
FROM shelters s
LEFT JOIN resources r ON s.id = r.shelter_id;

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE disasters ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Create policies for shelters
CREATE POLICY "Users can view all shelters" 
  ON shelters FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own shelters" 
  ON shelters FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shelters" 
  ON shelters FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shelters" 
  ON shelters FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for resources
CREATE POLICY "Users can view all resources" 
  ON resources FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own resources" 
  ON resources FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resources" 
  ON resources FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resources" 
  ON resources FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for disasters
CREATE POLICY "Users can view all disasters" 
  ON disasters FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own disasters" 
  ON disasters FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disasters" 
  ON disasters FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disasters" 
  ON disasters FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for predictions
CREATE POLICY "Users can view all predictions" 
  ON predictions FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own predictions" 
  ON predictions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions" 
  ON predictions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" 
  ON predictions FOR DELETE 
  USING (auth.uid() = user_id);

-- Add functions for getting counts
CREATE OR REPLACE FUNCTION get_total_shelter_capacity()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COALESCE(SUM(capacity), 0) FROM shelters WHERE status != 'closed');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_total_shelter_occupancy()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COALESCE(SUM(current_occupancy), 0) FROM shelters WHERE status != 'closed');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_active_disaster_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM disasters WHERE status IN ('active', 'monitoring'));
END;
$$ LANGUAGE plpgsql;

-- Add function to check resources below threshold
CREATE OR REPLACE FUNCTION get_resources_below_threshold()
RETURNS TABLE (
  resource_id BIGINT,
  resource_name VARCHAR(255),
  shelter_id BIGINT,
  shelter_name VARCHAR(255),
  current_amount NUMERIC,
  threshold NUMERIC,
  unit VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id AS resource_id,
    r.name AS resource_name,
    s.id AS shelter_id,
    s.name AS shelter_name,
    r.total_amount AS current_amount,
    r.alert_threshold AS threshold,
    r.unit
  FROM resources r
  JOIN shelters s ON r.shelter_id = s.id
  WHERE r.total_amount <= r.alert_threshold;
END;
$$ LANGUAGE plpgsql;
