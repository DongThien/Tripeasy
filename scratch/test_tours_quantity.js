import { pgPool } from '../server/src/config/db.js';
import { fetchAllToursRows } from '../server/src/models/tourModel.js';

async function testToursQuantity() {
  try {
    const { rows } = await fetchAllToursRows({ limit: 5 });
    if (rows.length === 0) {
      console.log("No tours found in database.");
      return;
    }

    console.log("Fetched tours and checked quantity vs departure stock sum:");
    rows.forEach(tour => {
      const departures = tour.departures || [];
      const computedStockSum = departures.reduce((sum, dep) => sum + (dep.stock || 0), 0);
      console.log(`- Tour ID ${tour.tour_id}: "${tour.title}"`);
      console.log(`  └─ departures count: ${departures.length}`);
      console.log(`  └─ calculated sum of departures stock: ${computedStockSum}`);
      console.log(`  └─ returned tour quantity field: ${tour.quantity}`);
      if (computedStockSum === tour.quantity) {
        console.log(`  ✅ MATCH!`);
      } else {
        console.log(`  ❌ MISMATCH!`);
      }
    });

  } catch (err) {
    console.error("❌ Error running verification script:", err);
  } finally {
    await pgPool.end();
  }
}

testToursQuantity();
