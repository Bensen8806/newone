const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
  const anonKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1];
  const serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];
  
  // Use Anon Key but simulate auth (we can't without a token, so we'll just test if service key vs anon key matters)
  // Actually, since we can't auth easily in Node without email/pass, we'll just check if the admin client can update it.
  const supabase = createClient(url, serviceKey);
  
  // Let's check what the current logo_url is for the club
  const { data: fetch1 } = await supabase.from('clubs').select('*').limit(1).single();
  console.log("Current logo_url before update:", fetch1.logo_url);
  
  const testUrl = 'https://example.com/new_logo.png';
  
  const clubData = {
    name: fetch1.name,
    type: fetch1.type,
    logo_url: testUrl,
    faculty_advisor_id: fetch1.faculty_advisor_id,
    department_id: fetch1.department_id,
    head_user_id: fetch1.head_user_id
  };
  
  const { data, error } = await supabase.from('clubs').update(clubData).eq('id', fetch1.id).select();
  
  if (error) {
    console.error("Update failed:", error);
  } else {
    console.log("Update succeeded. New data:", data);
  }
}
run();
