import { pgPool } from '../config/db.js';

async function main() {
  try {
    const tablesRes = await pgPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tablesRes.rows.map(r => r.table_name));

    for (const row of tablesRes.rows) {
      const columnsRes = await pgPool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
      `, [row.table_name]);
      console.log(`\nTable: ${row.table_name}`);
      console.table(columnsRes.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pgPool.end();
  }
}

main();
