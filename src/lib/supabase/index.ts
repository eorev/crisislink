
// Re-export client
export * from './client';

// Re-export auth functions
export * from './auth';

// Re-export types
export * from './types';

// Re-export shelter operations
export * from './shelters';

// Re-export resource operations - explicitly avoiding the getShelterById conflict
export {
  getResources,
  getResourcesByShelter,
  createResource,
  updateResource,
  deleteResource,
  allocateResource
} from './resources';

// Re-export disaster operations
export * from './disasters';

// Re-export prediction operations
export * from './predictions';

// Re-export profile operations
export * from './profiles';
