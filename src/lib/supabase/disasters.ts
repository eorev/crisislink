
import { supabase } from './client';
import { getCurrentUser } from './auth';
import type { Disaster } from './types';

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
