import { pgPool } from '../server/src/config/db.js';
import { createBookingData } from '../server/src/services/bookingService.js';

async function testBooking() {
  try {
    // 1. Get a valid user
    const userRes = await pgPool.query("SELECT user_id, username FROM users LIMIT 1");
    if (userRes.rows.length === 0) {
      console.error("❌ No users found in database!");
      return;
    }
    const user = userRes.rows[0];
    console.log(`Using user: ${user.username} (ID: ${user.user_id})`);

    // 2. Get a valid tour and departure
    const departureRes = await pgPool.query(`
      SELECT td.departure_id, td.tour_id, td.start_date, t.title 
      FROM tour_departures td
      JOIN tours t ON td.tour_id = t.tour_id
      WHERE td.stock > 2 AND td.status = 'AVAILABLE'
      LIMIT 1
    `);
    if (departureRes.rows.length === 0) {
      console.error("❌ No departures with stock found!");
      return;
    }
    const dep = departureRes.rows[0];
    console.log(`Using tour: "${dep.title}" (ID: ${dep.tour_id}), departure ID: ${dep.departure_id}, start date: ${dep.start_date}`);

    // 3. Create booking
    console.log("Calling createBookingData...");
    const booking = await createBookingData({
      tour_id: dep.tour_id,
      user_id: user.user_id,
      num_adults: 2,
      num_children: 0,
      special_requests: "Test special request",
      departure_id: dep.departure_id,
      payment_method: "BANK_TRANSFER"
    });

    console.log("✅ Booking created successfully!");
    console.log(booking);
  } catch (err) {
    console.error("❌ Error during test booking:", err);
  } finally {
    await pgPool.end();
  }
}

testBooking();
