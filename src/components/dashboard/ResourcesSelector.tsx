import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type Resource = 'Food' | 'Water' | 'Medical' | 'Beds' | 'Power' | 'Other';

type ResourcesSelectorProps = {
    selectedResources: Resource[];
    onChange: (resources: Resource[]) => void;
};

const availableResources: Resource[] = ['Food', 'Water', 'Medical', 'Beds', 'Power', 'Other'];

const ResourcesSelector: React.FC<ResourcesSelectorProps> = ({ selectedResources, onChange }) => {
    const handleResourceToggle = (resource: Resource) => {
        if (selectedResources.includes(resource)) {
            onChange(selectedResources.filter(r => r !== resource));
        } else {
            onChange([...selectedResources, resource]);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
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
    );
};

export default ResourcesSelector;
