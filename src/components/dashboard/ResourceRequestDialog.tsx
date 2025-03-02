
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getShelters } from '@/lib/supabase/shelters';
import { Shelter } from '@/lib/supabase/types';
import { Loader2, Send } from 'lucide-react';

type ResourceCategory = 'Food' | 'Water' | 'Medical' | 'Beds' | 'Power';

const ResourceRequestDialog: React.FC = () => {
  const [selectedResources, setSelectedResources] = useState<ResourceCategory[]>([]);
  const [selectedShelterId, setSelectedShelterId] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('medium');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSheltersLoading, setIsSheltersLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const fetchedShelters = await getShelters();
        setShelters(fetchedShelters);
      } catch (error) {
        console.error('Error fetching shelters:', error);
        toast.error('Failed to load shelters');
      } finally {
        setIsSheltersLoading(false);
      }
    };

    fetchShelters();
  }, []);

  const handleResourceToggle = (resource: ResourceCategory) => {
    if (selectedResources.includes(resource)) {
      setSelectedResources(selectedResources.filter(r => r !== resource));
    } else {
      setSelectedResources([...selectedResources, resource]);
    }
  };

  const handleSubmit = async () => {
    if (selectedResources.length === 0) {
      toast.error('Please select at least one resource type');
      return;
    }

    if (!selectedShelterId) {
      toast.error('Please select a shelter');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to FEMA
    try {
      // Artificial delay to simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedShelter = shelters.find(s => s.id.toString() === selectedShelterId);
      
      toast.success('Resource request submitted successfully', {
        description: `Resources will be allocated to ${selectedShelter?.name || 'the selected shelter'} soon.`
      });
      
      // Reset form
      setSelectedResources([]);
      setSelectedShelterId('');
      setUrgency('medium');
      setAdditionalDetails('');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableResources: ResourceCategory[] = ['Food', 'Water', 'Medical', 'Beds', 'Power'];

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Request Additional Resources</DialogTitle>
        <DialogDescription>
          Submit an emergency resource request to FEMA for distribution.
        </DialogDescription>
      </DialogHeader>

      {isSheltersLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2">Loading shelters...</span>
        </div>
      ) : (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="shelter">Allocate to Shelter</Label>
            <Select value={selectedShelterId} onValueChange={setSelectedShelterId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a shelter" />
              </SelectTrigger>
              <SelectContent>
                {shelters.map((shelter) => (
                  <SelectItem key={shelter.id} value={shelter.id.toString()}>
                    {shelter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Resource Types Needed</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableResources.map((resource) => (
                <div key={resource} className="flex items-center space-x-2">
                  <Checkbox
                    id={`resource-${resource}`}
                    checked={selectedResources.includes(resource)}
                    onCheckedChange={() => handleResourceToggle(resource)}
                  />
                  <Label
                    htmlFor={`resource-${resource}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {resource}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Within 72 hours</SelectItem>
                <SelectItem value="medium">Medium - Within 24 hours</SelectItem>
                <SelectItem value="high">High - Immediate need</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional Details</Label>
            <Textarea
              id="details"
              placeholder="Describe quantities needed and specific requirements..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}

      <DialogFooter className="mt-4">
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={isSubmitting || isSheltersLoading}
          className="bg-blue-600 hover:bg-blue-700 w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ResourceRequestDialog;
