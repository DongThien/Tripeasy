// Get command line args
const args = process.argv.slice(2);
const bookingId = args[0];
const amount = args[1];

if (!bookingId) {
    console.error("❌ Vui lòng nhập Booking ID để giả lập thanh toán!");
    console.log("👉 Cách dùng: node scratch/test_webhook.js <booking_id> [số_tiền_chuyển_khoản]");
    console.log("👉 Ví dụ: node scratch/test_webhook.js 92 5985000");
    process.exit(1);
}

//node scratch/test_webhook.js <booking_id> <số_tiền>

const transferAmount = amount ? Number(amount) : 0;

const payload = {
    error: 0,
    requests: [
        {
            id: Date.now(),
            tid: `MOCK_FT_${Date.now()}`,
            description: `TRIPEASY BK ${bookingId}`,
            amount: transferAmount || 1000000,
            cusName: "NGUYEN MOCK TESTER",
            when: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
    ]
};

const options = {
    method: 'POST',
    headers: {
        'Secure-Token': 'tripeasy_secure_token_123',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
};

console.log(`🚀 Đang gửi yêu cầu giả lập Webhook Casso...`);
console.log(`📦 Nội dung gửi đi:`, JSON.stringify(payload, null, 2));

fetch('https://tripeasy-backend-u9xd.onrender.com/api/bookings/webhook/casso', options)
    .then(async res => {
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        if (res.ok) {
            console.log(`\n✅ Thành công! Kết quả phản hồi từ Server:`, data);
            console.log(`🎉 Đã gửi lệnh cập nhật thanh toán cho Booking ID #${bookingId}.`);
            console.log(`👉 Vui lòng kiểm tra lại trang Lịch sử đặt tour và hòm thư Email để xem kết quả!`);
        } else {
            console.error(`\n❌ Thất bại (HTTP ${res.status}):`, data);
        }
    })
    .catch(err => {
        console.error(`\n❌ Lỗi kết nối đến Server:`, err.message);
    });
