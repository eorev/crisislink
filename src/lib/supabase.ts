
import { createClient } from '@supabase/supabase-js';

// Using the provided Supabase credentials
const supabaseUrl = 'https://yvwyvysjjqlgybvsuroe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3l2eXNqanFsZ3lidnN1cm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDcwODYsImV4cCI6MjA1NjQyMzA4Nn0.yd7b8CxKP8sHKVf1AV9Z-3FTDax70z67OFQehbUwtv4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AuthError = {
  message: string;
};

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// Database types
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

// Shelters API
export const getShelters = async () => {
  const { data, error } = await supabase
    .from('shelters')
    .select('*')
    .order('name');
  
  if (error) {
    throw error;
  }
  
  return data as Shelter[];
};

export const getShelterById = async (id: number) => {
  const { data, error } = await supabase
    .from('shelters')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Shelter;
};

export const createShelter = async (shelter: Omit<Shelter, 'id' | 'created_at' | 'user_id'>) => {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('shelters')
    .insert({
      ...shelter,
      user_id: user?.id,
    })
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Shelter;
};

export const updateShelter = async (id: number, updates: Partial<Omit<Shelter, 'id' | 'created_at' | 'user_id'>>) => {
  const { data, error } = await supabase
    .from('shelters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Shelter;
};

// Resources API
export const getResources = async () => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('name');
  
  if (error) {
    throw error;
  }
  
  return data as Resource[];
};

export const getResourcesByShelter = async (shelterId: number) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('shelter_id', shelterId)
    .order('name');
  
  if (error) {
    throw error;
  }
  
  return data as Resource[];
};

export const createResource = async (resource: Omit<Resource, 'id' | 'created_at' | 'user_id'>) => {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('resources')
    .insert({
      ...resource,
      user_id: user?.id,
    })
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Resource;
};

export const updateResource = async (id: number, updates: Partial<Omit<Resource, 'id' | 'created_at' | 'user_id'>>) => {
  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Resource;
};

// Disasters API
export const getDisasters = async () => {
  const { data, error } = await supabase
    .from('disasters')
    .select('*')
    .order('started_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data as Disaster[];
};

export const getActiveDisasters = async () => {
  const { data, error } = await supabase
    .from('disasters')
    .select('*')
    .in('status', ['active', 'monitoring'])
    .order('started_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data as Disaster[];
};

export const createDisaster = async (disaster: Omit<Disaster, 'id' | 'created_at' | 'user_id'>) => {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('disasters')
    .insert({
      ...disaster,
      user_id: user?.id,
    })
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Disaster;
};

// Predictions API
export const getPredictions = async () => {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('probability', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data as Prediction[];
};

export const createPrediction = async (prediction: Omit<Prediction, 'id' | 'created_at' | 'user_id'>) => {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('predictions')
    .insert({
      ...prediction,
      user_id: user?.id,
    })
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Prediction;
};
