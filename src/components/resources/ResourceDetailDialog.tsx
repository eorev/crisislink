
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createResource, updateResource } from '@/lib/supabase/resources';
import { getShelters } from '@/lib/supabase/shelters';
import { Resource } from '@/lib/supabase/types';
import { toast } from 'sonner';

interface ResourceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource;
  onResourceSaved: () => void;
}

const ResourceDetailDialog = ({
  open,
  onOpenChange,
  resource,
  onResourceSaved,
}: ResourceDetailDialogProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState('0');
  const [unit, setUnit] = useState('');
  const [shelterId, setShelterId] = useState<string>('');
  const [alertThreshold, setAlertThreshold] = useState('0');
  const [shelters, setShelters] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset form or populate with resource data
      if (resource) {
        setName(resource.name);
        setCategory(resource.category);
        setTotalAmount(resource.total_amount.toString());
        setUnit(resource.unit);
        setShelterId(resource.shelter_id?.toString() || '');
        setAlertThreshold(resource.alert_threshold.toString());
      } else {
        // Default values for new resource
        setName('');
        setCategory('Food');
        setTotalAmount('0');
        setUnit('');
        setShelterId('');
        setAlertThreshold('0');
      }

      // Fetch shelters for dropdown
      const fetchShelters = async () => {
        try {
          const fetchedShelters = await getShelters();
          setShelters(fetchedShelters.map(s => ({ id: s.id, name: s.name })));
        } catch (error) {
          console.error('Error fetching shelters:', error);
          toast.error('Failed to load shelters');
        }
      };

      fetchShelters();
    }
  }, [open, resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resourceData = {
        name,
        category: category as Resource['category'],
        total_amount: parseInt(totalAmount, 10),
        unit,
        shelter_id: shelterId ? parseInt(shelterId, 10) : undefined,
        alert_threshold: parseInt(alertThreshold, 10),
      };

      if (resource?.id) {
        await updateResource(resource.id, resourceData);
      } else {
        await createResource(resourceData);
      }

      onResourceSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{resource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Resource Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Water Bottles"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Water">Water</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Beds">Beds</SelectItem>
                  <SelectItem value="Power">Power</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalAmount">Amount</Label>
                <Input
                  id="totalAmount"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  type="number"
                  min="0"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., bottles, meals, kits"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shelter">Shelter (optional)</Label>
              <Select
                value={shelterId}
                onValueChange={setShelterId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a shelter or leave empty for central storage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Central Storage</SelectItem>
                  {shelters.map((shelter) => (
                    <SelectItem key={shelter.id} value={shelter.id.toString()}>
                      {shelter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="alertThreshold">Alert Threshold</Label>
              <Input
                id="alertThreshold"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                type="number"
                min="0"
                required
              />
              <p className="text-xs text-gray-500">
                You'll receive alerts when the resource falls below this threshold
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : resource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDetailDialog;
