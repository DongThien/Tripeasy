import { pgPool } from '../server/src/config/db.js';
import { createBookingData } from '../server/src/services/bookingService.js';

async function testPastBooking() {
  try {
    // 1. Get a valid user
    const userRes = await pgPool.query("SELECT user_id, username FROM users LIMIT 1");
    if (userRes.rows.length === 0) {
      console.error("❌ No users found in database!");
      return;
    }
    const user = userRes.rows[0];

    // 2. Insert a past departure date temporarily
    console.log("Inserting temporary past departure...");
    const tourRes = await pgPool.query("SELECT tour_id FROM tours LIMIT 1");
    if (tourRes.rows.length === 0) {
      console.error("❌ No tours found in database!");
      return;
    }
    const tourId = tourRes.rows[0].tour_id;
    
    const pastDate = '2026-05-01'; // June 2026 is current time, so May 2026 is in the past
    
    // Insert temporary departure
    const depRes = await pgPool.query(
      "INSERT INTO tour_departures (tour_id, start_date, end_date, stock, status) VALUES ($1, $2, '2026-05-05', 20, 'AVAILABLE') RETURNING departure_id",
      [tourId, pastDate]
    );
    const departureId = depRes.rows[0].departure_id;
    console.log(`Inserted past departure with ID: ${departureId} for Tour ID: ${tourId}`);

    // 3. Attempt to book
    console.log("Attempting to book past departure...");
    try {
      await createBookingData({
        tour_id: tourId,
        user_id: user.user_id,
        num_adults: 1,
        num_children: 0,
        special_requests: "Test past booking",
        departure_id: departureId,
        payment_method: "BANK_TRANSFER"
      });
      console.error("❌ ERROR: Booking succeeded, but it should have failed!");
    } catch (err) {
      console.log(`✅ Expected failure occurred: "${err.message}" (Status: ${err.statusCode})`);
    }

    // Clean up
    console.log("Cleaning up temporary departure...");
    await pgPool.query("DELETE FROM tour_departures WHERE departure_id = $1", [departureId]);
    console.log("Cleanup complete.");

  } catch (err) {
    console.error("❌ Unexpected error during test:", err);
  } finally {
    await pgPool.end();
  }
}

testPastBooking();
