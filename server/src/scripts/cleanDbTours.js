import { pgPool } from '../config/db.js';

const tourUpdates = [
  { id: 27, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 21, start: 'TP.HCM', cat: 'Nghỉ dưỡng' },
  { id: 22, start: 'Hà Nội', cat: 'Trekking' },
  { id: 23, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 24, start: 'Hà Nội', cat: 'Nghỉ dưỡng' },
  { id: 25, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 26, start: 'Hà Nội', cat: 'Biển đảo' },
  { id: 28, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 29, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 30, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 34, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 1, start: 'Hà Nội', cat: 'Trekking' },
  { id: 2, start: 'Hà Nội', cat: 'Nghỉ dưỡng' },
  { id: 3, start: 'TP.HCM', cat: 'Biển đảo' },
  { id: 14, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 15, start: 'TP.HCM', cat: 'Khám phá' },
  { id: 11, start: 'TP.HCM', cat: 'Biển đảo' },
  { id: 12, start: 'TP.HCM', cat: 'Khám phá' },
  { id: 13, start: 'TP.HCM', cat: 'Khám phá' },
  { id: 4, start: 'TP.HCM', cat: 'Biển đảo' },
  { id: 5, start: 'TP.HCM', cat: 'Nghỉ dưỡng' },
  { id: 16, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 17, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 18, start: 'TP.HCM', cat: 'Khám phá' },
  { id: 19, start: 'TP.HCM', cat: 'Biển đảo' },
  { id: 20, start: 'TP.HCM', cat: 'Biển đảo' },
  { id: 6, start: 'Hà Nội', cat: 'Biển đảo' },
  { id: 7, start: 'TP.HCM', cat: 'Khám phá' },
  { id: 8, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 9, start: 'Hà Nội', cat: 'Khám phá' },
  { id: 10, start: 'TP.HCM', cat: 'Biển đảo' },
  { id: 37, start: 'Hà Nội', cat: 'Khám phá' }
];

async function run() {
  try {
    console.log('Starting DB tours cleanup...');
    for (const update of tourUpdates) {
      await pgPool.query(
        `UPDATE tours 
         SET start_location = COALESCE(start_location, $1), 
             category = COALESCE(category, $2)
         WHERE tour_id = $3`,
        [update.start, update.cat, update.id]
      );
    }
    console.log('✅ DB tours cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating database:', error);
    process.exit(1);
  }
}

run();
