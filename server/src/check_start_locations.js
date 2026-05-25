import { pgPool } from './config/db.js';

async function main() {
  const { rows } = await pgPool.query("SELECT DISTINCT start_location FROM tours");
  console.log("Distinct start locations:", rows);
  const categories = await pgPool.query("SELECT DISTINCT category FROM tours").catch(() => ({ rows: [] }));
  console.log("Distinct categories:", categories.rows);
  const regions = await pgPool.query("SELECT DISTINCT region FROM tours");
  console.log("Distinct regions:", regions.rows);
  pgPool.end();
}

main().catch(console.error);
