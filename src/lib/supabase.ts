import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aialmrvcmljtltrtkeej.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpYWxtcnZjbWxqdGx0cnRrZWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDY1MTcsImV4cCI6MjA4NTYyMjUxN30.2-rpiH75gjVIuZ1IIepEMhgBHSOIZROYFnqyYkMLvjI';

// Create Supabase client with any type to avoid strict type checking issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any, 'public', any> = createClient(supabaseUrl, supabaseAnonKey);
