// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import { pgPool } from './config/db.js';
import routes from './routes/index.js';

// Ưu tiên phân giải địa chỉ IPv4 trước để tránh lỗi ENETUNREACH khi gửi mail trên Render
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://tripeasy.vercel.app',
    'https://tripeasy-tau.vercel.app'
];
if (process.env.CLIENT_URL) {
    const envOrigins = process.env.CLIENT_URL.split(',').map(o => o.trim());
    allowedOrigins.push(...envOrigins);
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                          origin.startsWith('http://localhost:') || 
                          origin.endsWith('vercel.app') || 
                          allowedOrigins.some(o => origin.startsWith(o));
                          
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api', routes);

// Connect database
pgPool.connect()
    .then(async () => {
        // Nạp cấu hình động từ settings.json sau khi DB sẵn sàng
        const { loadSettings } = await import('./services/settingService.js');
        loadSettings();
    })
    .catch(err => {
        console.error('PostgreSQL initial connection error:', err);
        process.exit(1);
    });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});