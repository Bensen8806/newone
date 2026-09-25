const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' });
  try {
    await client.connect();
    console.log("Connected to local Postgres");
    await client.query('ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS logo_url text;');
    console.log("Added logo_url to clubs");
    await client.end();
  } catch (e) {
    console.log("Failed to connect:", e.message);
  }
}
run();
