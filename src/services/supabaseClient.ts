import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321'; // ou a URL do Supabase online
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'; // ou 'service_role' se necessário para escrita

export const supabase = createClient(supabaseUrl, supabaseKey);
