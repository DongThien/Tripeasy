import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình kết nối PostgreSQL sử dụng Connection Pool
export const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  max: 20, // Số lượng connection tối đa
  idleTimeoutMillis: 30000, // Đóng connection nếu không dùng sau 30s
});

pgPool.on('connect', () => {
  console.log('✅ Kết nối PostgreSQL (pgAdmin) thành công!');
});

pgPool.on('error', (err) => {
  console.error('❌ Lỗi PostgreSQL Pool:', err);
  process.exit(-1);
});