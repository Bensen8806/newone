const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('clubs').select('*').limit(1);
  if (error) {
    console.log("Error querying clubs:", error);
  } else {
    console.log("Clubs data:", data);
  }
}
run();
