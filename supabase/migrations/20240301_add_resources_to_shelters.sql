-- Add resources_available column to shelters table
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS resources_available TEXT[] DEFAULT '{}';

-- Create a function to update the last_updated timestamp automatically
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_updated = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the last_updated column when a shelter is updated
DROP TRIGGER IF EXISTS update_shelters_last_updated ON shelters;
CREATE TRIGGER update_shelters_last_updated
BEFORE UPDATE ON shelters
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

-- Create a function to get shelters with their resources
CREATE OR REPLACE FUNCTION get_shelters_with_resources()
RETURNS TABLE (
  id BIGINT,
  name VARCHAR(255),
  address TEXT,
  capacity INTEGER,
  current_occupancy INTEGER,
  contact_phone VARCHAR(20),
  last_updated TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  resources_available TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.address,
    s.capacity,
    s.current_occupancy,
    s.contact_phone,
    s.last_updated,
    s.status,
    s.created_at,
    s.user_id,
    s.resources_available
  FROM shelters s
  ORDER BY s.name;
END;
$$ LANGUAGE plpgsql; 