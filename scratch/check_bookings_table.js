import { pgPool } from '../server/src/config/db.js';

async function main() {
  try {
    const res = await pgPool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'bookings'
    `);
    console.log('Bookings table columns:');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pgPool.end();
  }
}

main();
