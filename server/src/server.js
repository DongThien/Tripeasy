// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB, pgPool } from './config/db.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api', routes);

// Connect databases
connectMongoDB();
pgPool.connect().catch(err => {
    console.error('PostgreSQL initial connection error:', err);
    process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Tripeasy backend running on port ${PORT}`);
});