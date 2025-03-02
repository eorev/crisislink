
import React from 'react';
import { ShelterCard } from './ShelterCard';
import AddShelterDialog from '@/components/dashboard/AddShelterDialog';
import type { ShelterWithResources } from './ShelterTypes';

interface ShelterListProps {
  shelters: ShelterWithResources[];
  isLoading: boolean;
  error: string | null;
  onShelterAdded: () => void;
  onDeleteClick: (shelterId: number) => void;
}

export const ShelterList = ({ 
  shelters, 
  isLoading, 
  error, 
  onShelterAdded, 
  onDeleteClick 
}: ShelterListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading shelters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
        <p className="text-amber-800">{error}</p>
      </div>
    );
  }

  if (shelters.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No shelters found</h3>
        <p className="text-gray-600 mb-6">Get started by adding your first shelter</p>
        <AddShelterDialog onShelterAdded={onShelterAdded} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shelters.map((shelter) => (
        <ShelterCard
          key={shelter.id}
          shelter={shelter}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};
