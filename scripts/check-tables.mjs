import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://sqgtpmwynzwprjzurocj.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    transport: WebSocket
  }
});

async function checkTables() {
  const tables = [
    'users',
    'user_roles',
    'institutions',
    'journals',
    'journal_editors',
    'submissions',
    'submission_authors',
    'submission_files',
    'submission_status_history',
    'review_assignments',
    'review_reports',
    'editorial_decisions',
    'revision_responses',
    'journal_issues',
    'published_articles',
    'notifications',
    'audit_logs'
  ];

  console.log('--- Checking tables in Supabase ---');
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`❌ ${table}: ${error.code} - ${error.message}`);
    } else {
      console.log(`✅ ${table}: table exists! (found ${data?.length} row(s))`);
    }
  }
}

checkTables();
