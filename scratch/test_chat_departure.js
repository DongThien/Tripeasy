import { pgPool } from '../server/src/config/db.js';
import { fetchTourDepartureForChatRow, fetchOtherTourDeparturesForChatRows } from '../server/src/models/chatModel.js';

async function testChatDeparture() {
  try {
    const tourRes = await pgPool.query("SELECT tour_id FROM tours LIMIT 1");
    if (tourRes.rows.length === 0) {
      console.error("❌ No tours found in database!");
      return;
    }
    const tourId = tourRes.rows[0].tour_id;
    console.log(`Using Tour ID: ${tourId}`);

    // Insert past and future departures
    console.log("Inserting temporary test departures...");
    const pastDate = '2026-05-10';  // Past
    const futureDate = '2026-07-20'; // Future (relative to current date June 14, 2026)

    const pastDepRes = await pgPool.query(
      "INSERT INTO tour_departures (tour_id, start_date, end_date, stock, status) VALUES ($1, $2, '2026-05-15', 20, 'AVAILABLE') RETURNING departure_id",
      [tourId, pastDate]
    );
    const pastDepId = pastDepRes.rows[0].departure_id;

    const futureDepRes = await pgPool.query(
      "INSERT INTO tour_departures (tour_id, start_date, end_date, stock, status) VALUES ($1, $2, '2026-07-25', 20, 'AVAILABLE') RETURNING departure_id",
      [tourId, futureDate]
    );
    const futureDepId = futureDepRes.rows[0].departure_id;

    console.log(`Inserted past departure ID: ${pastDepId}, future departure ID: ${futureDepId}`);

    // Test fetchTourDepartureForChatRow on past date
    console.log(`Testing fetchTourDepartureForChatRow for past date: ${pastDate}`);
    const pastResult = await fetchTourDepartureForChatRow(tourId, pastDate);
    console.log("Past date query result:", pastResult ? `Found departure ID: ${pastResult.departure_id}` : "Not found (CORRECT)");

    // Test fetchTourDepartureForChatRow on future date
    console.log(`Testing fetchTourDepartureForChatRow for future date: ${futureDate}`);
    const futureResult = await fetchTourDepartureForChatRow(tourId, futureDate);
    console.log("Future date query result:", futureResult ? `Found departure ID: ${futureResult.departure_id} (CORRECT)` : "Not found");

    // Clean up
    console.log("Cleaning up test departures...");
    await pgPool.query("DELETE FROM tour_departures WHERE departure_id IN ($1, $2)", [pastDepId, futureDepId]);
    console.log("Cleanup complete.");

  } catch (err) {
    console.error("❌ Unexpected error:", err);
  } finally {
    await pgPool.end();
  }
}

testChatDeparture();
