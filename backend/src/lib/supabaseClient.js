require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Use SERVICE_ROLE_KEY in backend to bypass RLS, fallback to ANON_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://your-project-ref.supabase.co') {
  console.warn('⚠️  Supabase credentials are not set. History features will not work.');
  console.warn('   Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON_KEY) to your .env file.');
  
  // Create a mock client so the app doesn't crash, but db operations will fail gracefully
  supabase = {
    from: () => ({
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      select: () => ({ order: () => ({ limit: async () => ({ data: [], error: { message: 'Supabase not configured' } }) }) }),
      delete: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) }),
    })
  };
} else {
  // Use a higher timeout and better configuration for the backend client
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

module.exports = supabase;
