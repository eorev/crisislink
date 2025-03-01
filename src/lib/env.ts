// Environment variables with type safety
export const env = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  GOOGLE_GENERATIVE_AI_API_KEY: import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '',
  // Add other environment variables as needed
}; 