import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// 1. Cấu hình kết nối PostgreSQL sử dụng Connection Pool
export const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  // Tùy chọn tối ưu cho Pool:
  max: 20, // Số lượng connection tối đa
  idleTimeoutMillis: 30000, // Đóng connection nếu không dùng sau 30s
});

// Bắt sự kiện khi Postgres kết nối thành công
pgPool.on('connect', () => {
  console.log('✅ Kết nối PostgreSQL (pgAdmin) thành công!');
});

// Bắt lỗi nếu Pool gặp sự cố bất ngờ
pgPool.on('error', (err) => {
  console.error('❌ Lỗi PostgreSQL Pool:', err);
  process.exit(-1);
});

// 2. Cấu hình kết nối MongoDB (Tạm thời log ra để server.js không bị lỗi)
export const connectMongoDB = async () => {
  try {
    // Sau này khi setup MongoDB (cho Chatbot), bạn sẽ dùng mongoose.connect() ở đây
    console.log('⏳ MongoDB chưa được cấu hình, tạm thời bỏ qua.');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
  }
};