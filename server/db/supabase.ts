import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://sqgtpmwynzwprjzurocj.supabase.co';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ3RwbXd5bnp3cHJqenVyb2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODgzMzgsImV4cCI6MjEwODE2NDMzOH0.XLWiyo1ObSPK4xVJPxyyAmCYn4U2EuAEzUXvW38AEvU';

export const supabaseServer: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket,
  },
});
