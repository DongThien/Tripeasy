import axiosClient from './axiosClient';

export const getAllBookings = (params = {}) =>
    axiosClient.get('/bookings', { params }).then((r) => r.data);

export const getBookingStats = () =>
    axiosClient.get('/bookings/stats').then((r) => r.data);

export const getBookingById = (id) =>
    axiosClient.get(`/bookings/${id}`).then((r) => r.data);

export const updateBookingStatus = (id, data) =>
    axiosClient.put(`/bookings/${id}/status`, data).then((r) => r.data);

export const createBooking = (data) =>
    axiosClient.post('/bookings', data).then((r) => r.data);

export const getUserBookings = (userId) =>
    axiosClient.get(`/bookings/user/${userId}`).then((r) => r.data);

export const cancelUserBooking = (id) =>
    axiosClient.put(`/bookings/${id}/cancel`).then((r) => r.data);

const bookingService = { 
    getAllBookings, 
    getBookingStats, 
    getBookingById, 
    updateBookingStatus,
    createBooking,
    getUserBookings,
    cancelUserBooking
};
export default bookingService;
