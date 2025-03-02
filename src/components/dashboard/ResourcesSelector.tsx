
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
    const [loading, setLoading] = useState(false);

    const handleResourceToggle = (resource: Resource) => {
        if (selectedResources.includes(resource)) {
            setSelectedResources(selectedResources.filter(r => r !== resource));
        } else {
            setSelectedResources([...selectedResources, resource]);
        }
    };

    const handleSubmit = async () => {
        if (selectedResources.length === 0) {
            toast.error("Please select at least one resource type");
            return;
        }

        setLoading(true);
        try {
            // This would be where you'd update the database with the selected resources
            // For now, just simulate a successful operation
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Resources added to ${shelterName}`);
            setSelectedResources([]);
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
            
            <div className="grid grid-cols-2 gap-4 py-4">
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
