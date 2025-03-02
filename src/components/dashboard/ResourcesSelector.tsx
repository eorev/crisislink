
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getResources, allocateResource } from '@/lib/supabase/resources';
import { Resource } from '@/lib/supabase/types';

type ResourceCategory = 'Food' | 'Water' | 'Medical' | 'Beds' | 'Power';

type ResourcesSelectorProps = {
    shelterId: number;
    shelterName: string;
    onResourcesUpdated?: () => void; // Add callback for parent components
};

const availableResources: ResourceCategory[] = ['Food', 'Water', 'Medical', 'Beds', 'Power'];

const ResourcesSelector: React.FC<ResourcesSelectorProps> = ({ 
    shelterId, 
    shelterName,
    onResourcesUpdated 
}) => {
    const [selectedResources, setSelectedResources] = useState<ResourceCategory[]>([]);
    const [quantities, setQuantities] = useState<Record<ResourceCategory, number>>({
        Food: 0,
        Water: 0,
        Medical: 0,
        Beds: 0,
        Power: 0
    });
    const [loading, setLoading] = useState(false);
    const [centralResources, setCentralResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch central resources (where shelter_id is null)
    useEffect(() => {
        fetchCentralResources();
    }, []);

    const fetchCentralResources = async () => {
        try {
            setIsLoading(true);
            const resources = await getResources();
            const central = resources.filter(r => r.shelter_id === null);
            setCentralResources(central);
        } catch (error) {
            console.error("Error fetching central resources:", error);
            toast.error("Failed to load central resources");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResourceToggle = (resource: ResourceCategory) => {
        if (selectedResources.includes(resource)) {
            setSelectedResources(selectedResources.filter(r => r !== resource));
        } else {
            setSelectedResources([...selectedResources, resource]);
        }
    };

    const handleQuantityChange = (resource: ResourceCategory, value: string) => {
        const quantity = parseInt(value) || 0;
        setQuantities({
            ...quantities,
            [resource]: quantity
        });
    };

    const getResourceForCategory = (category: ResourceCategory) => {
        return centralResources.find(r => r.category === category);
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

        // Check if we have enough resources for each selected category
        for (const category of selectedResources) {
            const resource = getResourceForCategory(category);
            if (!resource) {
                toast.error(`No central ${category} resources available`);
                return;
            }
            
            if (resource.total_amount < quantities[category]) {
                toast.error(`Not enough ${category} available (${resource.total_amount} ${resource.unit})`);
                return;
            }
        }

        setLoading(true);
        try {
            // Allocate each selected resource to the shelter
            for (const category of selectedResources) {
                const resource = getResourceForCategory(category);
                if (resource) {
                    await allocateResource(
                        resource.id,
                        shelterId,
                        quantities[category]
                    );
                }
            }
            
            // Show which resources were added with their quantities
            const resourceSummary = selectedResources
                .map(r => {
                    const resource = getResourceForCategory(r);
                    return `${quantities[r]} ${resource?.unit || ''} of ${r}`;
                })
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
            
            // Refresh the central resources
            await fetchCentralResources();
            
            // Notify parent component about the update
            if (onResourcesUpdated) {
                onResourcesUpdated();
            }
        } catch (error) {
            console.error("Error adding resources:", error);
            toast.error("Failed to add resources");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <DialogContent className="sm:max-w-md">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading resources...</span>
                </div>
            </DialogContent>
        );
    }

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add Resources to Shelter</DialogTitle>
                <DialogDescription>
                    Select resources to add to {shelterName}
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                {availableResources.map((resource) => {
                    const centralResource = getResourceForCategory(resource);
                    const available = centralResource ? centralResource.total_amount : 0;
                    const unit = centralResource ? centralResource.unit : '';
                    
                    return (
                        <div key={resource} className="flex items-center space-x-2 gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={`resource-${resource}`}
                                    checked={selectedResources.includes(resource)}
                                    onCheckedChange={() => handleResourceToggle(resource)}
                                    disabled={!centralResource || available === 0}
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
                                    max={available}
                                    value={quantities[resource] || ''}
                                    onChange={(e) => handleQuantityChange(resource, e.target.value)}
                                    disabled={!selectedResources.includes(resource)}
                                    placeholder="Quantity"
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="text-xs text-gray-500 w-20">
                                {available} {unit} available
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <DialogFooter>
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading || selectedResources.length === 0}
                    className="w-full"
                >
                    {loading ? "Adding..." : "Add Resources"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default ResourcesSelector;
