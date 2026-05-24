import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';

// Đọc file .env từ thư mục server
dotenv.config({ path: path.resolve('../server/.env') });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key:', apiKey ? 'FOUND (starts with ' + apiKey.substring(0, 5) + '...)' : 'NOT FOUND');
    if (!apiKey) {
        console.log('Vui lòng đảm bảo GEMINI_API_KEY tồn tại trong server/.env');
        return;
    }

    try {
        console.log('Đang kết nối tới Google Gemini API...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say hello in Vietnamese');
        console.log('Kết quả từ Gemini:');
        console.log(result.response.text());
    } catch (err) {
        console.error('Bị lỗi khi gọi Gemini:', err);
    }
}

test();
