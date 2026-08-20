import { neon } from '@neondatabase/serverless';

const url = 'postgresql://neondb_owner:npg_L1lHQxBaGCP4@ep-fragrant-sunset-azuxd04n-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(url);

try {
  const rows = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position`;
  console.log('=== products table columns ===');
  rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
} catch(e) {
  console.error('products error:', e.message);
}

try {
  const rows2 = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories' ORDER BY ordinal_position`;
  console.log('=== categories table columns ===');
  rows2.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
} catch(e) {
  console.error('categories error:', e.message);
}
