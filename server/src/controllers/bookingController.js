import {
    createBookingData,
    getUserBookingsData,
    getAllBookingsData,
    getBookingStatsData,
    getBookingByIdData,
    updateBookingStatusData
} from "../services/bookingService.js";

// POST /api/bookings
export const createBooking = async (req, res) => {
    try {
        // Gán user_id từ Token đã xác thực
        req.body.user_id = req.user.id;
        const data = await createBookingData(req.body);
        res.status(201).json({ success: true, data, message: "Đặt tour thành công!" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings/user/:user_id
export const getUserBookings = async (req, res) => {
    try {
        const { user_id } = req.params;
        // Bảo mật: Người dùng chỉ được xem danh sách của chính mình (hoặc Admin được xem tất cả)
        if (req.user.role !== 'admin' && req.user.id !== parseInt(user_id)) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập thông tin đặt tour này!" });
        }
        const data = await getUserBookingsData(user_id);
        res.json({ success: true, data, message: "Lấy danh sách đặt tour thành công" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings
export const getAllBookings = async (req, res) => {
    try {
        const data = await getAllBookingsData(req.query);
        res.json({ success: true, data, message: "Fetched all bookings" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings/stats
export const getBookingStats = async (req, res) => {
    try {
        const data = await getBookingStatsData();
        res.json({
            success: true,
            data,
            message: "Fetched booking stats",
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings/:id
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getBookingByIdData(id);
        res.json({ success: true, data, message: "Fetched booking" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// PUT /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, booking_status } = req.body;
        const data = await updateBookingStatusData(id, payment_status, booking_status);
        res.json({ success: true, data, message: "Cập nhật trạng thái đặt tour thành công" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// PUT /api/bookings/:id/cancel
export const cancelUserBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await getBookingByIdData(id);
        if (booking.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền hủy đơn đặt tour này!" });
        }
        if (booking.booking_status !== 'PENDING') {
            return res.status(400).json({ success: false, message: "Chỉ có thể hủy đơn đặt tour ở trạng thái Chờ xử lý!" });
        }

        const data = await updateBookingStatusData(id, booking.payment_status, 'CANCELLED');
        res.json({ success: true, data, message: "Hủy đơn đặt tour thành công!" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// POST /api/bookings/webhook/casso
export const handleCassoWebhook = async (req, res) => {
    try {
        const secureToken = req.headers['secure-token'] || req.headers['Secure-Token'];
        const expectedToken = process.env.CASSO_WEBHOOK_TOKEN || 'tripeasy_secure_token_123';
        
        if (secureToken !== expectedToken) {
            console.warn("⚠️ Webhook unauthorized: Invalid secure token received");
            return res.status(401).json({ error: 1, message: "Unauthorized: Invalid Secure-Token" });
        }

        const { error, requests } = req.body;
        if (error !== 0 || !Array.isArray(requests)) {
            return res.status(400).json({ error: 2, message: "Bad Request: Invalid body structure" });
        }

        console.log(`📥 Received ${requests.length} bank transaction(s) via Casso webhook.`);

        for (const transaction of requests) {
            const { description, amount } = transaction;
            if (!description) continue;

            const match = description.match(/TRIPEASY BK\s*(\d+)/i);
            if (match) {
                const bookingId = parseInt(match[1]);
                
                try {
                    const booking = await getBookingByIdData(bookingId);
                    
                    if (!booking) {
                        console.warn(`⚠️ Webhook: Booking #${bookingId} not found in database.`);
                        continue;
                    }

                    if (booking.booking_status === 'CANCELLED') {
                        console.warn(`⚠️ Webhook: Booking #${bookingId} is already CANCELLED. Skip payment update.`);
                        continue;
                    }
                    if (booking.payment_status === 'PAID' || booking.payment_status === 'COMPLETED') {
                        console.log(`ℹ️ Webhook: Booking #${bookingId} is already paid. Skip.`);
                        continue;
                    }

                    const expectedAmount = Number(booking.total_price);
                    const receivedAmount = Number(amount);

                    if (receivedAmount < expectedAmount) {
                        console.warn(`⚠️ Webhook: Amount mismatch for Booking #${bookingId}. Expected: ${expectedAmount}, Received: ${receivedAmount}`);
                        continue;
                    }

                    await updateBookingStatusData(bookingId, 'PAID', 'COMPLETED');
                    console.log(`✅ Webhook: Booking #${bookingId} successfully paid and completed via bank transfer webhook mock!`);

                } catch (err) {
                    console.error(`❌ Webhook error processing booking #${bookingId}:`, err.message);
                }
            }
        }

        return res.json({ error: 0, message: "Webhook processed successfully" });
    } catch (err) {
        console.error("❌ Casso webhook error:", err);
        return res.status(500).json({ error: 5, message: "Internal server error" });
    }
};