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
  const { data } = await supabase.from('events').select('title, start_time, end_time');
  console.log(JSON.stringify(data, null, 2));
}
run();
