
import { supabase } from './client';
import { getCurrentUser } from './auth';
import type { Prediction } from './types';

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
