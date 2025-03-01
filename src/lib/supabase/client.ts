
import { createClient } from '@supabase/supabase-js';

// Using the provided Supabase credentials
const supabaseUrl = 'https://yvwyvysjjqlgybvsuroe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3l2eXNqanFsZ3lidnN1cm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDcwODYsImV4cCI6MjA1NjQyMzA4Nn0.yd7b8CxKP8sHKVf1AV9Z-3FTDax70z67OFQehbUwtv4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define AuthError as a type
export type AuthError = {
  message: string;
};
