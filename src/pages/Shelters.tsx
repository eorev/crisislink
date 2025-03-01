import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Phone, Clock, Plus } from 'lucide-react';
import AddShelterDialog from '@/components/dashboard/AddShelterDialog';
import { getShelters } from '@/lib/supabase/shelters';
import type { Shelter } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';

// Define a type that extends Shelter with resources
type ShelterWithResources = Shelter & { resources: string[] };

// This is a fallback in case the database fetch fails
const fallbackShelterData: ShelterWithResources[] = [
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

const Shelters = () => {
  const [shelters, setShelters] = useState<ShelterWithResources[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShelters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const shelterData = await getShelters();

      // Map the shelters to include resources from resources_available
      const sheltersWithResources = shelterData.map(shelter => ({
        ...shelter,
        resources: shelter.resources_available || getRandomResources(),
      }));

      setShelters(sheltersWithResources);
    } catch (err) {
      console.error('Error fetching shelters:', err);
      setError('Failed to load shelters. Using fallback data.');
      setShelters(fallbackShelterData);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate random resources for demo purposes
  // Only used as a fallback if resources_available is not set
  const getRandomResources = () => {
    const allResources = ['Food', 'Water', 'Medical', 'Beds', 'Power'];
    const numResources = Math.floor(Math.random() * 5) + 1; // 1 to 5 resources
    const shuffled = [...allResources].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numResources);
  };

  // Format the last_updated timestamp to a human-readable format
  const formatLastUpdated = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (err) {
      return 'Unknown';
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleShelterAdded = () => {
    fetchShelters();
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disaster Relief Shelters</h1>
            <p className="text-gray-600 mt-2">Monitoring and managing active shelter locations</p>
          </div>
          <AddShelterDialog onShelterAdded={handleShelterAdded} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading shelters...</p>
          </div>
        ) : error ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <p className="text-amber-800">{error}</p>
          </div>
        ) : shelters.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shelters found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first shelter</p>
            <AddShelterDialog onShelterAdded={handleShelterAdded} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shelters.map((shelter) => (
              <Card key={shelter.id} className="relative overflow-hidden border border-gray-200 hover:border-crisisBlue-300 transition-all hover:shadow-md">
                {shelter.status === 'limited' && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-xs font-medium">
                    Limited Resources
                  </div>
                )}
                {shelter.status === 'closed' && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-medium">
                    Closed
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-gray-900">{shelter.name}</CardTitle>
                  <CardDescription className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {shelter.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Occupancy</p>
                      <div className="relative pt-1">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${shelter.current_occupancy / shelter.capacity > 0.9
                              ? 'bg-red-500'
                              : shelter.current_occupancy / shelter.capacity > 0.7
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                              }`}
                            style={{ width: `${(shelter.current_occupancy / shelter.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs font-medium text-gray-600">{shelter.current_occupancy} people</span>
                          <span className="text-xs font-medium text-gray-600">Capacity: {shelter.capacity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {shelter.resources.map((resource, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-crisisBlue-100 text-crisisBlue-800">
                          {resource}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{shelter.contact_phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Updated {formatLastUpdated(shelter.last_updated)}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-2">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shelters;
