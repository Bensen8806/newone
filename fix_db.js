const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envs = fs.readFileSync('.env.local', 'utf8').split('\n');
let SUPABASE_URL = '';
let SUPABASE_KEY = '';
envs.forEach(env => {
  if (env.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = env.split('=')[1];
  if (env.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) SUPABASE_KEY = env.split('=')[1];
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const { data } = await supabase.from('events').update({ end_time: '2026-09-25T10:00:00+00:00' }).eq('title', 'Magazine Day').select();
  console.log(data);
}
run();
