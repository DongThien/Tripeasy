import axiosClient from './axiosClient';

export const getAllUsers = (params = {}) =>
    axiosClient.get('/users', { params }).then((r) => r.data);

export const getUserStats = () =>
    axiosClient.get('/users/stats').then((r) => r.data);

export const updateUser = (id, data) =>
    axiosClient.put(`/users/${id}`, data).then((r) => r.data);

export const toggleUserLock = (id) =>
    axiosClient.put(`/users/${id}/toggle-lock`).then((r) => r.data);

const userService = { getAllUsers, getUserStats, updateUser, toggleUserLock };
export default userService;
