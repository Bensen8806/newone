const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];
  const supabase = createClient(url, key);
  
  const { data: updateData, error: updateError } = await supabase
    .from('clubs')
    .update({ logo_url: 'https://test.com/logo.png' })
    .eq('id', '6af0b1ae-62bf-4cb0-bc29-99665115da58');
    
  if (updateError) {
    console.log("Error updating logo_url:", updateError);
  } else {
    console.log("Successfully updated logo_url");
  }
}
run();
