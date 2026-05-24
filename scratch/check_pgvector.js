import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../server/.env') });

async function test() {
    const client = new Client({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
    });

    try {
        await client.connect();
        console.log('✅ Kết nối PostgreSQL thành công!');
        
        console.log('Đang kiểm tra extension vector...');
        const res = await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('✅ Kích hoạt extension vector thành công!', res.command);
        
        const checkRes = await client.query('SELECT extname FROM pg_extension WHERE extname = \'vector\';');
        if (checkRes.rows.length > 0) {
            console.log('✅ Extension vector hiện đã được cài đặt và kích hoạt trong database!');
        } else {
            console.log('❌ Lỗi: Không thể tìm thấy extension vector.');
        }
    } catch (err) {
        console.error('❌ Lỗi khi thiết lập pgvector:', err.message);
        console.log('\nGợi ý: Nếu gặp lỗi "could not open extension control file", bạn cần cài đặt pgvector.');
        console.log('Với Windows, bạn có thể tải file zip pgvector từ github.com/pgvector/pgvector và giải nén vào thư mục cài đặt PostgreSQL của bạn (thường là C:\\Program Files\\PostgreSQL\\<version>).');
    } finally {
        await client.end();
    }
}

test();
