
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Phone, Clock, Plus } from 'lucide-react';

const shelterData = [
  {
    id: 1,
    name: 'Central Community Center',
    address: '123 Main St, Cityville',
    capacity: 150,
    currentOccupancy: 87,
    contactPhone: '(555) 123-4567',
    lastUpdated: '10 minutes ago',
    resources: ['Food', 'Water', 'Medical', 'Beds'],
    status: 'operational'
  },
  {
    id: 2,
    name: 'Riverside Emergency Shelter',
    address: '456 River Rd, Townsburg',
    capacity: 200,
    currentOccupancy: 178,
    contactPhone: '(555) 987-6543',
    lastUpdated: '25 minutes ago',
    resources: ['Food', 'Water', 'Beds'],
    status: 'operational'
  },
  {
    id: 3,
    name: 'Eastside High School',
    address: '789 East Ave, Villageton',
    capacity: 300,
    currentOccupancy: 112,
    contactPhone: '(555) 456-7890',
    lastUpdated: '1 hour ago',
    resources: ['Food', 'Water', 'Medical', 'Beds', 'Power'],
    status: 'operational'
  },
  {
    id: 4,
    name: 'North District Armory',
    address: '321 North Blvd, Hamletville',
    capacity: 250,
    currentOccupancy: 201,
    contactPhone: '(555) 321-7654',
    lastUpdated: '45 minutes ago',
    resources: ['Water', 'Beds', 'Power'],
    status: 'limited'
  }
];

const Shelters = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disaster Relief Shelters</h1>
            <p className="text-gray-600 mt-2">Monitoring and managing active shelter locations</p>
          </div>
          <Button className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Shelter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelterData.map((shelter) => (
            <Card key={shelter.id} className="relative overflow-hidden border border-gray-200 hover:border-crisisBlue-300 transition-all hover:shadow-md">
              {shelter.status === 'limited' && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-xs font-medium">
                  Limited Resources
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
                          className={`h-2 rounded-full ${
                            shelter.currentOccupancy / shelter.capacity > 0.9 
                              ? 'bg-red-500' 
                              : shelter.currentOccupancy / shelter.capacity > 0.7 
                                ? 'bg-amber-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${(shelter.currentOccupancy / shelter.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs font-medium text-gray-600">{shelter.currentOccupancy} people</span>
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
                      <span>{shelter.contactPhone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Updated {shelter.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Shelters;
