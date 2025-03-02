
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { getShelters, deleteShelter } from '@/lib/supabase/shelters';
import { initializeShelters } from '@/lib/supabase/initialData';
import { toast } from "sonner";
import AddShelterDialog from '@/components/dashboard/AddShelterDialog';
import { ShelterList } from '@/components/shelters/ShelterList';
import { DeleteShelterDialog } from '@/components/shelters/DeleteShelterDialog';
import { getRandomResources } from '@/components/shelters/ShelterUtils';
import { fallbackShelterData, type ShelterWithResources } from '@/components/shelters/ShelterTypes';

const Shelters = () => {
  const [shelters, setShelters] = useState<ShelterWithResources[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shelterToDelete, setShelterToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchShelters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const shelterData = await getShelters();

      // If no shelters exist and we haven't initialized yet, create initial data
      if (shelterData.length === 0 && !isInitialized) {
        setIsInitialized(true);
        toast.info("Initializing shelter database with sample data...");
        await initializeShelters();
        // Fetch again after initialization
        const initializedData = await getShelters();
        const sheltersWithResources = initializedData.map(shelter => ({
          ...shelter,
          resources: shelter.resources_available || getRandomResources(),
        }));
        setShelters(sheltersWithResources);
      } else {
        // Map the shelters to include resources from resources_available
        const sheltersWithResources = shelterData.map(shelter => ({
          ...shelter,
          resources: shelter.resources_available || getRandomResources(),
        }));
        setShelters(sheltersWithResources);
      }
    } catch (err) {
      console.error('Error fetching shelters:', err);
      setError('Failed to load shelters. Using fallback data.');
      setShelters(fallbackShelterData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleShelterAdded = () => {
    fetchShelters();
  };

  const handleDeleteClick = (shelterId: number) => {
    setShelterToDelete(shelterId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!shelterToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteShelter(shelterToDelete);
      toast.success("Shelter deleted successfully");
      fetchShelters();
    } catch (err) {
      console.error("Error deleting shelter:", err);
      toast.error("Failed to delete shelter");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setShelterToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setShelterToDelete(null);
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

        <ShelterList
          shelters={shelters}
          isLoading={isLoading}
          error={error}
          onShelterAdded={handleShelterAdded}
          onDeleteClick={handleDeleteClick}
        />
        
        <DeleteShelterDialog
          isOpen={isDeleteDialogOpen}
          isDeleting={isDeleting}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </Layout>
  );
};

export default Shelters;
