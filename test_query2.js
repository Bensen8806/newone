const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];
  const supabase = createClient(url, key);
  
  const { data, error } = await supabase.from('users').select('id, name, email, role');
  console.log("All users (service role):", JSON.stringify(data, null, 2));
}
run();
