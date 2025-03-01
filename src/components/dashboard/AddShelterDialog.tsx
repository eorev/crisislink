import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createShelter } from '@/lib/supabase/shelters';
import { toast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import ResourcesSelector from './ResourcesSelector';

type Resource = 'Food' | 'Water' | 'Medical' | 'Beds' | 'Power' | 'Other';

type AddShelterDialogProps = {
    onShelterAdded: () => void;
};

const AddShelterDialog: React.FC<AddShelterDialogProps> = ({ onShelterAdded }) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        capacity: '',
        current_occupancy: '',
        contact_phone: '',
        status: 'operational' as 'operational' | 'limited' | 'closed',
    });
    const [selectedResources, setSelectedResources] = useState<Resource[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            status: value as 'operational' | 'limited' | 'closed'
        }));
    };

    const handleResourcesChange = (resources: Resource[]) => {
        setSelectedResources(resources);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Convert string numeric values to numbers for the API
            const numericFormData = {
                ...formData,
                capacity: parseInt(formData.capacity) || 0,
                current_occupancy: parseInt(formData.current_occupancy) || 0,
            };

            // Create the shelter in the database with resources_available
            await createShelter({
                ...numericFormData,
                last_updated: new Date().toISOString(),
                resources_available: selectedResources,
            });

            toast({
                title: "Success",
                description: "Shelter has been added successfully.",
            });

            setOpen(false);
            onShelterAdded();

            // Reset form
            setFormData({
                name: '',
                address: '',
                capacity: '',
                current_occupancy: '',
                contact_phone: '',
                status: 'operational',
            });
            setSelectedResources([]);
        } catch (error) {
            console.error('Error adding shelter:', error);
            toast({
                title: "Error",
                description: "Failed to add shelter. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Shelter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Shelter</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new disaster relief shelter.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="capacity" className="text-right">
                                Capacity
                            </Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="0"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="current_occupancy" className="text-right">
                                Current Occupancy
                            </Label>
                            <Input
                                id="current_occupancy"
                                name="current_occupancy"
                                type="number"
                                min="0"
                                max={formData.capacity ? parseInt(formData.capacity) : undefined}
                                value={formData.current_occupancy}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contact_phone" className="text-right">
                                Contact Phone
                            </Label>
                            <Input
                                id="contact_phone"
                                name="contact_phone"
                                value={formData.contact_phone}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="operational">Operational</SelectItem>
                                    <SelectItem value="limited">Limited</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">
                                Resources
                            </Label>
                            <div className="col-span-3">
                                <ResourcesSelector
                                    selectedResources={selectedResources}
                                    onChange={handleResourcesChange}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Shelter'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddShelterDialog;
