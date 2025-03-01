export type Shelter = {
  id: number;
  name: string;
  address: string;
  capacity: number;
  current_occupancy: number;
  contact_phone: string;
  last_updated: string;
  status: 'operational' | 'limited' | 'closed';
  created_at: string;
  user_id: string;
  resources_available?: string[];
};

export type Resource = {
  id: number;
  name: string;
  category: 'Food' | 'Water' | 'Medical' | 'Beds' | 'Power' | 'Other';
  total_amount: number;
  unit: string;
  shelter_id?: number;
  created_at: string;
  last_updated: string;
  alert_threshold: number;
  user_id: string;
};

export type Disaster = {
  id: number;
  type: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'active' | 'monitoring' | 'recovering' | 'resolved';
  started_at: string;
  ended_at?: string;
  details: string;
  created_at: string;
  user_id: string;
};

export type Prediction = {
  id: number;
  disaster_type: string;
  location: string;
  probability: number;
  severity: 'Low' | 'Medium' | 'High';
  timeframe: string;
  details: string;
  created_at: string;
  user_id: string;
};
