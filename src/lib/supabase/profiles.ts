import { supabase } from './client';
import { UserProfile } from './types';
import { getCurrentUser } from './auth';

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Call the get_or_create_profile function to ensure a profile exists
    const { data, error } = await supabase
      .rpc('get_or_create_profile', { user_id: user.id })
      .single();

    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  updates: Partial<Pick<UserProfile, 'area_code' | 'display_name'>>
): Promise<UserProfile | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // First ensure the profile exists
    await getUserProfile();

    // Then update it
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
}; 