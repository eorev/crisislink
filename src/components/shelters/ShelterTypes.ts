
import type { Shelter } from '@/lib/supabase/types';

// Define a type that extends Shelter with resources
export type ShelterWithResources = Shelter & { resources: string[] };

// This is a fallback in case the database fetch fails
export const fallbackShelterData: ShelterWithResources[] = [
  {
    id: 1,
    name: 'Central Community Center',
    address: '123 Main St, Cityville',
    capacity: 150,
    current_occupancy: 87,
    contact_phone: '(555) 123-4567',
    last_updated: '2023-01-01T00:00:00Z',
    resources: ['Food', 'Water', 'Medical', 'Beds'],
    resources_available: ['Food', 'Water', 'Medical', 'Beds'],
    status: 'operational',
    created_at: '2023-01-01T00:00:00Z',
    user_id: '00000000-0000-0000-0000-000000000000'
  },
  {
    id: 2,
    name: 'Riverside Emergency Shelter',
    address: '456 River Rd, Townsburg',
    capacity: 200,
    current_occupancy: 178,
    contact_phone: '(555) 987-6543',
    last_updated: '2023-01-01T00:00:00Z',
    resources: ['Food', 'Water', 'Beds'],
    resources_available: ['Food', 'Water', 'Beds'],
    status: 'operational',
    created_at: '2023-01-01T00:00:00Z',
    user_id: '00000000-0000-0000-0000-000000000000'
  },
  {
    id: 3,
    name: 'Eastside High School',
    address: '789 East Ave, Villageton',
    capacity: 300,
    current_occupancy: 112,
    contact_phone: '(555) 456-7890',
    last_updated: '2023-01-01T00:00:00Z',
    resources: ['Food', 'Water', 'Medical', 'Beds', 'Power'],
    resources_available: ['Food', 'Water', 'Medical', 'Beds', 'Power'],
    status: 'operational',
    created_at: '2023-01-01T00:00:00Z',
    user_id: '00000000-0000-0000-0000-000000000000'
  },
  {
    id: 4,
    name: 'North District Armory',
    address: '321 North Blvd, Hamletville',
    capacity: 250,
    current_occupancy: 201,
    contact_phone: '(555) 321-7654',
    last_updated: '2023-01-01T00:00:00Z',
    resources: ['Water', 'Beds', 'Power'],
    resources_available: ['Water', 'Beds', 'Power'],
    status: 'limited',
    created_at: '2023-01-01T00:00:00Z',
    user_id: '00000000-0000-0000-0000-000000000000'
  }
];
