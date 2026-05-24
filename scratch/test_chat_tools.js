import dotenv from 'dotenv';
import { handleChat } from '../server/src/controllers/chatController.js';
import { pgPool } from '../server/src/config/db.js';

dotenv.config({ path: 'd:/Tripeasy/server/.env' });

async function runTest() {
    try {
        console.log('Querying a user from the database to test...');
        const userRes = await pgPool.query('SELECT user_id, username FROM users LIMIT 1');
        
        if (userRes.rows.length === 0) {
            console.log('No users found in database, please create a user first.');
            process.exit(1);
        }
        
        const user = userRes.rows[0];
        console.log(`Testing with user: ${user.username} (ID: ${user.user_id})`);

        const mockReq = {
            body: {
                message: 'Tôi đã đặt những tour nào vậy?',
                sessionId: 'test-session-uuid-1234'
            },
            user: { id: user.user_id }
        };

        const mockRes = {
            status(code) {
                console.log('HTTP STATUS:', code);
                return this;
            },
            json(data) {
                console.log('HTTP RESPONSE:', JSON.stringify(data, null, 2));
                return this;
            }
        };

        console.log('Running handleChat...');
        await handleChat(mockReq, mockRes);
        console.log('Test completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Test crashed:', err);
        process.exit(1);
    }
}

runTest();
