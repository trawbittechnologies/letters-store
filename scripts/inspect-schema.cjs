const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

sql(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position`)
  .then(r => { console.log('Products columns:'); r.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`)); process.exit(0); })
  .catch(e => { console.error('Error:', e.message); process.exit(1); });
