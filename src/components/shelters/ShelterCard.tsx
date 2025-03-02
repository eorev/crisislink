
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Phone, Clock, Trash2, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ShelterWithResources } from '@/components/shelters/ShelterTypes';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ResourcesSelector from '@/components/dashboard/ResourcesSelector';

interface ShelterCardProps {
  shelter: ShelterWithResources;
  onDeleteClick: (shelterId: number) => void;
}

export const ShelterCard = ({ shelter, onDeleteClick }: ShelterCardProps) => {
  // Format the last_updated timestamp to a human-readable format
  const formatLastUpdated = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (err) {
      return 'Unknown';
    }
  };

  return (
    <Card className="relative overflow-hidden border border-gray-200 hover:border-crisisBlue-300 transition-all hover:shadow-md">
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">{shelter.name}</CardTitle>
            <CardDescription className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {shelter.address}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-red-500"
            onClick={() => onDeleteClick(shelter.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 mt-2"
              >
                <Package className="h-4 w-4" />
                Add Resources
              </Button>
            </DialogTrigger>
            <ResourcesSelector shelterId={shelter.id} shelterName={shelter.name} />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
