import { supabase } from './client';
import { getCurrentUser } from './auth';
import type { Resource, Shelter } from './types';
import { toast } from 'sonner';

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
      last_updated: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Resource;
};

export const updateResource = async (id: number, updates: Partial<Omit<Resource, 'id' | 'created_at' | 'user_id'>>) => {
  try {
    // First check if the resource exists
    const { data: existingResource, error: checkError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();
    
    if (checkError) {
      throw new Error(`Resource not found: ${checkError.message}`);
    }
    
    // Now update the resource
    const { data, error } = await supabase
      .from('resources')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Resource;
  } catch (error) {
    console.error('Error in updateResource:', error);
    throw error;
  }
};

export const deleteResource = async (id: number) => {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
  
  return true;
};

export const allocateResource = async (
  resourceId: number, 
  shelterId: number, 
  amount: number
) => {
  // First, get the current resource to check availability
  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .single();
  
  if (resourceError) {
    throw resourceError;
  }
  
  if (!resource) {
    throw new Error("Resource not found");
  }
  
  // Check if enough resources are available
  if (resource.total_amount < amount) {
    throw new Error(`Not enough ${resource.name} available (${resource.total_amount} ${resource.unit})`);
  }
  
  // Begin a transaction to update resources
  // 1. Reduce the total from source
  const { error: updateError } = await supabase
    .from('resources')
    .update({
      total_amount: resource.total_amount - amount,
      last_updated: new Date().toISOString()
    })
    .eq('id', resourceId);
  
  if (updateError) {
    throw updateError;
  }
  
  // 2. Check if a record already exists at the shelter for this resource type
  const { data: existingAtShelter, error: existingError } = await supabase
    .from('resources')
    .select('*')
    .eq('shelter_id', shelterId)
    .eq('category', resource.category)
    .single();
  
  if (existingError && existingError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw existingError;
  }
  
  if (existingAtShelter) {
    // Update existing record
    const { error: shelterUpdateError } = await supabase
      .from('resources')
      .update({
        total_amount: (existingAtShelter.total_amount || 0) + amount,
        last_updated: new Date().toISOString()
      })
      .eq('id', existingAtShelter.id);
      
    if (shelterUpdateError) {
      // If this fails, we should try to roll back the first update
      try {
        await supabase
          .from('resources')
          .update({
            total_amount: resource.total_amount,
            last_updated: resource.last_updated
          })
          .eq('id', resourceId);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
      
      throw shelterUpdateError;
    }
  } else {
    // Create new resource record for this shelter
    const user = await getCurrentUser();
    
    const { error: insertError } = await supabase
      .from('resources')
      .insert({
        name: resource.name,
        category: resource.category,
        total_amount: amount,
        unit: resource.unit,
        shelter_id: shelterId,
        alert_threshold: Math.floor(amount * 0.2), // Set a default threshold at 20%
        user_id: user?.id,
        last_updated: new Date().toISOString()
      });
      
    if (insertError) {
      // Try to roll back the first update
      try {
        await supabase
          .from('resources')
          .update({
            total_amount: resource.total_amount,
            last_updated: resource.last_updated
          })
          .eq('id', resourceId);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
      
      throw insertError;
    }
  }
  
  return true;
};

export const getShelterById = async (id: number): Promise<Shelter> => {
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
