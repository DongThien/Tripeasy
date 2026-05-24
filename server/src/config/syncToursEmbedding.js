import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { generateEmbedding, generateTourSearchText } from '../services/geminiService.js';

dotenv.config();

async function syncEmbeddings() {
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

        // Lấy toàn bộ các tour từ database
        console.log('Đang truy xuất danh sách tour du lịch...');
        const { rows: tours } = await client.query('SELECT * FROM tours');
        console.log(`Tìm thấy ${tours.length} tour.`);

        let successCount = 0;
        for (let i = 0; i < tours.length; i++) {
            const tour = tours[i];
            console.log(`[${i + 1}/${tours.length}] Đang xử lý tour #${tour.tour_id}: ${tour.title}...`);
            
            try {
                // Tạo đoạn văn bản mô tả để chuyển thành vector
                const searchText = generateTourSearchText(tour);
                
                // Gọi API Gemini sinh vector embedding
                const embedding = await generateEmbedding(searchText);
                
                // Lưu vector vào database
                await client.query(
                    'UPDATE tours SET embedding = $1 WHERE tour_id = $2',
                    [embedding, tour.tour_id]
                );
                
                console.log(`   -> ✅ Đồng bộ vector thành công (độ dài vector: ${embedding.length})`);
                successCount++;
            } catch (err) {
                console.error(`   -> ❌ Lỗi khi xử lý tour #${tour.tour_id}:`, err.message);
            }
        }

        console.log(`\n🎉 Hoàn thành đồng bộ! Đã đồng bộ thành công ${successCount}/${tours.length} tour.`);

    } catch (error) {
        console.error('❌ Lỗi khi chạy đồng bộ vector:', error.message);
    } finally {
        await client.end();
    }
}

syncEmbeddings();
