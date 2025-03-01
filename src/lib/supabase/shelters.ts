
import { supabase } from './client';
import { getCurrentUser } from './auth';
import type { Shelter } from './types';

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
