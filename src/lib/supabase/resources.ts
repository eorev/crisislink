
import { supabase } from './client';
import { getCurrentUser } from './auth';
import type { Resource } from './types';

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
