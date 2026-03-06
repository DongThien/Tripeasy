import axiosClient from './axiosClient';

export const getAllBookings = (params = {}) =>
    axiosClient.get('/bookings', { params }).then((r) => r.data);

export const getBookingStats = () =>
    axiosClient.get('/bookings/stats').then((r) => r.data);

export const getBookingById = (id) =>
    axiosClient.get(`/bookings/${id}`).then((r) => r.data);

export const updateBookingStatus = (id, data) =>
    axiosClient.put(`/bookings/${id}/status`, data).then((r) => r.data);

const bookingService = { getAllBookings, getBookingStats, getBookingById, updateBookingStatus };
export default bookingService;
