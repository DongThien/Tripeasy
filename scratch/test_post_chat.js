import axios from 'axios';

async function test() {
    try {
        console.log('Đang gửi yêu cầu POST tới http://localhost:5000/api/chat ...');
        const res = await axios.post('http://localhost:5000/api/chat', {
            message: 'Xin chào',
            history: []
        });
        console.log('Status Code:', res.status);
        console.log('Response Data:', res.data);
    } catch (err) {
        console.error('Yêu cầu bị lỗi!');
        if (err.response) {
            console.error('Status Code từ Server:', err.response.status);
            console.error('Data trả về từ Server:', err.response.data);
        } else {
            console.error('Lỗi kết nối:', err.message);
        }
    }
}

test();
