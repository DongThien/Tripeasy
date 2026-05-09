import {
    fetchTourPriceRow,
    insertBookingRow,
    fetchUserBookingsRows,
    fetchAllBookingsRows,
    fetchBookingStatsRow,
    fetchBookingByIdRow,
    updateBookingStatusRow
} from "../models/bookingModel.js";

const BOOKING_STATUS_VI = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy"
};

const PAYMENT_STATUS_VI = {
    PENDING: "Chưa thanh toán",
    PAID: "Đã thanh toán"
};

const mapBooking = (row) => ({
    booking_id: row.booking_id,
    tour_name: row.title,
    customer_name: row.user_name,
    customer_phone: row.phone_number || "—",
    customer_email: row.email || "—",
    booked_at: row.booking_date,
    num_adults: row.num_adults,
    num_children: row.num_children,
    total_price: parseFloat(row.total_price),
    special_requests: row.special_requests || "",
    status: BOOKING_STATUS_VI[row.booking_status] ?? row.booking_status,
    payment: PAYMENT_STATUS_VI[row.payment_status] ?? row.payment_status,
    booking_status: row.booking_status,
    payment_status: row.payment_status,
    tour_id: row.tour_id,
    user_id: row.user_id
});

export const createBookingData = async ({
    tour_id,
    user_id,
    num_adults,
    num_children,
    promotion_id,
    special_requests
}) => {
    const tourRow = await fetchTourPriceRow(tour_id);
    if (!tourRow) {
        const error = new Error("Tour not found");
        error.statusCode = 404;
        throw error;
    }

    const totalPrice = tourRow.price_adult * num_adults + tourRow.price_child * num_children;

    return insertBookingRow({
        tourId: tour_id,
        userId: user_id,
        promotionId: promotion_id,
        numAdults: num_adults,
        numChildren: num_children,
        totalPrice,
        specialRequests: special_requests
    });
};

export const getUserBookingsData = async (userId) => {
    return fetchUserBookingsRows(userId);
};

export const getAllBookingsData = async ({ search, booking_status, payment_status }) => {
    const normalizedBookingStatus =
        booking_status && booking_status !== "all" ? booking_status.toUpperCase() : null;
    const normalizedPaymentStatus =
        payment_status && payment_status !== "all" ? payment_status.toUpperCase() : null;

    const rows = await fetchAllBookingsRows({
        search,
        bookingStatus: normalizedBookingStatus,
        paymentStatus: normalizedPaymentStatus
    });
    return rows.map(mapBooking);
};

export const getBookingStatsData = async () => {
    const { total, pending, monthly_revenue } = await fetchBookingStatsRow();
    return {
        total: parseInt(total),
        pending: parseInt(pending),
        monthly_revenue: parseFloat(monthly_revenue)
    };
};

export const getBookingByIdData = async (bookingId) => {
    const row = await fetchBookingByIdRow(bookingId);
    if (!row) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }
    return mapBooking(row);
};

export const updateBookingStatusData = async (bookingId, paymentStatus, bookingStatus) => {
    const row = await updateBookingStatusRow(bookingId, paymentStatus, bookingStatus);
    if (!row) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }
    return row;
};
