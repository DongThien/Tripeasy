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
        const data = await createBookingData(req.body);
        res.status(201).json({ success: true, data, message: "Booking created successfully" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings/user/:user_id
export const getUserBookings = async (req, res) => {
    try {
        const { user_id } = req.params;
        const data = await getUserBookingsData(user_id);
        res.json({ success: true, data, message: "Fetched user bookings" });
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
        res.json({ success: true, data, message: "Booking status updated" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};