import { createShelter } from './shelters';
import { createResource } from './resources';

// Sample shelter data for initial database population
const initialShelters = [
  {
    name: 'Central Community Center',
    address: '123 Main St, Cityville',
    capacity: 150,
    current_occupancy: 87,
    contact_phone: '(555) 123-4567',
    status: 'operational' as const,
    resources_available: ['Food', 'Water', 'Medical', 'Beds']
  },
  {
    name: 'Riverside Emergency Shelter',
    address: '456 River Rd, Townsburg',
    capacity: 200,
    current_occupancy: 178,
    contact_phone: '(555) 987-6543',
    status: 'operational' as const,
    resources_available: ['Food', 'Water', 'Beds']
  },
  {
    name: 'Eastside High School',
    address: '789 East Ave, Villageton',
    capacity: 300,
    current_occupancy: 112,
    contact_phone: '(555) 456-7890',
    status: 'operational' as const,
    resources_available: ['Food', 'Water', 'Medical', 'Beds', 'Power']
  },
  {
    name: 'North District Armory',
    address: '321 North Blvd, Hamletville',
    capacity: 250,
    current_occupancy: 201,
    contact_phone: '(555) 321-7654',
    status: 'limited' as const,
    resources_available: ['Water', 'Beds', 'Power']
  },
  {
    name: 'South Community College',
    address: '555 College Dr, Southtown',
    capacity: 400,
    current_occupancy: 215,
    contact_phone: '(555) 555-1212',
    status: 'operational' as const,
    resources_available: ['Food', 'Water', 'Medical', 'Beds']
  },
  {
    name: 'West End Convention Center',
    address: '888 Convention Way, Westville',
    capacity: 500,
    current_occupancy: 325,
    contact_phone: '(555) 888-9999',
    status: 'operational' as const,
    resources_available: ['Food', 'Water', 'Medical', 'Beds', 'Power']
  },
  {
    name: 'Downtown Civic Arena',
    address: '100 Civic Center Plaza, Downtown',
    capacity: 650,
    current_occupancy: 488,
    contact_phone: '(555) 100-2000',
    status: 'limited' as const,
    resources_available: ['Food', 'Water', 'Beds']
  }
];

// Initial resources per category with quantities for each shelter
const initialResourceDistribution = {
  'Food': { amount: 2500, unit: 'meals' },
  'Water': { amount: 5000, unit: 'gallons' },
  'Medical': { amount: 500, unit: 'kits' },
  'Beds': { amount: 150, unit: 'units' },
  'Power': { amount: 10, unit: 'generators' },
};

/**
 * Initialize the database with starter shelters if they don't exist
 */
export const initializeShelters = async () => {
  try {
    for (const shelter of initialShelters) {
      try {
        // Add last_updated field
        const shelterWithTimestamp = {
          ...shelter,
          last_updated: new Date().toISOString()
        };
        
        // Create the shelter
        const newShelter = await createShelter(shelterWithTimestamp);
        console.log(`Created shelter: ${newShelter.name}`);
        
        // Create resources for this shelter
        if (newShelter.resources_available && newShelter.resources_available.length > 0) {
          for (const resourceType of newShelter.resources_available) {
            if (resourceType in initialResourceDistribution) {
              const { amount, unit } = initialResourceDistribution[resourceType as keyof typeof initialResourceDistribution];
              
              // Adjust amount based on shelter capacity (larger shelters get more resources)
              const adjustedAmount = Math.round(amount * (newShelter.capacity / 300));
              
              try {
                await createResource({
                  name: `${resourceType} Supplies`,
                  category: resourceType as 'Food' | 'Water' | 'Medical' | 'Beds' | 'Power' | 'Other',
                  total_amount: adjustedAmount,
                  unit: unit,
                  shelter_id: newShelter.id,
                  alert_threshold: Math.round(adjustedAmount * 0.2), // 20% of total as alert threshold
                  last_updated: new Date().toISOString()
                });
                console.log(`Added ${adjustedAmount} ${unit} of ${resourceType} to ${newShelter.name}`);
              } catch (resourceError) {
                console.error(`Failed to create resource for ${newShelter.name}:`, resourceError);
              }
            }
          }
        }
      } catch (shelterError) {
        // Skip if shelter with same name already exists (we'll get a constraint error)
        console.log(`Shelter may already exist or couldn't be created:`, shelterError);
      }
    }
    return true;
  } catch (error) {
    console.error("Error initializing shelters:", error);
    return false;
  }
};

/**
 * Initialize the database with starter resources if they don't exist
 */
export const initializeResources = async () => {
  try {
    // First ensure we have shelters
    await initializeShelters();
    
    // Then add central/unallocated resources if needed
    const centralResources = [
      {
        name: 'Emergency Food Supplies',
        category: 'Food' as const,
        total_amount: 5000,
        unit: 'meals',
        alert_threshold: 1000,
        last_updated: new Date().toISOString()
      },
      {
        name: 'Bottled Water',
        category: 'Water' as const,
        total_amount: 10000,
        unit: 'bottles',
        alert_threshold: 2000,
        last_updated: new Date().toISOString()
      },
      {
        name: 'First Aid Kits',
        category: 'Medical' as const,
        total_amount: 800,
        unit: 'kits',
        alert_threshold: 150,
        last_updated: new Date().toISOString()
      },
      {
        name: 'Portable Generators',
        category: 'Power' as const,
        total_amount: 25,
        unit: 'units',
        alert_threshold: 5,
        last_updated: new Date().toISOString()
      }
    ];
    
    for (const resource of centralResources) {
      try {
        await createResource(resource);
        console.log(`Created central resource: ${resource.name}`);
      } catch (error) {
        console.error(`Failed to create resource ${resource.name}:`, error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing resources:", error);
    return false;
  }
};
