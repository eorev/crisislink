
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

type Resource = 'Food' | 'Water' | 'Medical' | 'Beds' | 'Power';

type ResourcesSelectorProps = {
    shelterId: number;
    shelterName: string;
};

const availableResources: Resource[] = ['Food', 'Water', 'Medical', 'Beds', 'Power'];

const ResourcesSelector: React.FC<ResourcesSelectorProps> = ({ shelterId, shelterName }) => {
    const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
    const [quantities, setQuantities] = useState<Record<Resource, number>>({
        Food: 0,
        Water: 0,
        Medical: 0,
        Beds: 0,
        Power: 0
    });
    const [loading, setLoading] = useState(false);

    const handleResourceToggle = (resource: Resource) => {
        if (selectedResources.includes(resource)) {
            setSelectedResources(selectedResources.filter(r => r !== resource));
        } else {
            setSelectedResources([...selectedResources, resource]);
        }
    };

    const handleQuantityChange = (resource: Resource, value: string) => {
        const quantity = parseInt(value) || 0;
        setQuantities({
            ...quantities,
            [resource]: quantity
        });
    };

    const handleSubmit = async () => {
        if (selectedResources.length === 0) {
            toast.error("Please select at least one resource type");
            return;
        }

        // Check if any selected resource has a quantity of 0
        const hasZeroQuantity = selectedResources.some(resource => quantities[resource] === 0);
        if (hasZeroQuantity) {
            toast.error("Please specify a quantity for each selected resource");
            return;
        }

        setLoading(true);
        try {
            // This would be where you'd update the database with the selected resources
            // For now, just simulate a successful operation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show which resources were added with their quantities
            const resourceSummary = selectedResources
                .map(r => `${quantities[r]} ${r}`)
                .join(', ');
                
            toast.success(`Added ${resourceSummary} to ${shelterName}`);
            
            // Reset the form
            setSelectedResources([]);
            setQuantities({
                Food: 0,
                Water: 0,
                Medical: 0,
                Beds: 0,
                Power: 0
            });
        } catch (error) {
            console.error("Error adding resources:", error);
            toast.error("Failed to add resources");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add Resources to Shelter</DialogTitle>
                <DialogDescription>
                    Select resources to add to {shelterName}
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                {availableResources.map((resource) => (
                    <div key={resource} className="flex items-center space-x-2 gap-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`resource-${resource}`}
                                checked={selectedResources.includes(resource)}
                                onCheckedChange={() => handleResourceToggle(resource)}
                            />
                            <Label
                                htmlFor={`resource-${resource}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-20"
                            >
                                {resource}
                            </Label>
                        </div>
                        
                        <div className="flex-1">
                            <Input
                                type="number"
                                min="0"
                                value={quantities[resource] || ''}
                                onChange={(e) => handleQuantityChange(resource, e.target.value)}
                                disabled={!selectedResources.includes(resource)}
                                placeholder="Quantity"
                                className="w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            <DialogFooter>
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Adding..." : "Add Resources"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default ResourcesSelector;
