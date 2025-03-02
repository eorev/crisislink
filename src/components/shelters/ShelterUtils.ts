
// Helper function to generate random resources for demo purposes
// Only used as a fallback if resources_available is not set
export const getRandomResources = () => {
  const allResources = ['Food', 'Water', 'Medical', 'Beds', 'Power'];
  const numResources = Math.floor(Math.random() * 5) + 1; // 1 to 5 resources
  const shuffled = [...allResources].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numResources);
};
