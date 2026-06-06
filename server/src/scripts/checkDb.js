import { pgPool } from '../config/db.js';

async function main() {
  try {
    // Check columns of the reviews table
    const tableInfo = await pgPool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reviews'
    `);
    console.log('Columns in reviews table:', tableInfo.rows);

    const hasReply = tableInfo.rows.some(r => r.column_name === 'admin_reply');
    const hasRepliedAt = tableInfo.rows.some(r => r.column_name === 'replied_at');

    if (!hasReply) {
      console.log('Adding column admin_reply...');
      await pgPool.query('ALTER TABLE reviews ADD COLUMN admin_reply TEXT;');
    } else {
      console.log('admin_reply column already exists.');
    }

    if (!hasRepliedAt) {
      console.log('Adding column replied_at...');
      await pgPool.query('ALTER TABLE reviews ADD COLUMN replied_at TIMESTAMP;');
    } else {
      console.log('replied_at column already exists.');
    }

    // Verify after update
    const updatedTableInfo = await pgPool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reviews'
    `);
    console.log('Updated columns in reviews table:', updatedTableInfo.rows);

    console.log('Database check & migration complete.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pgPool.end();
  }
}

main();
