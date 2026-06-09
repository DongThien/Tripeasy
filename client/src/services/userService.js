import axiosClient from './axiosClient';

export const getAllUsers = (params = {}) =>
    axiosClient.get('/users', { params }).then((r) => r.data);

export const getUserStats = () =>
    axiosClient.get('/users/stats').then((r) => r.data);

export const updateUser = (id, data) =>
    axiosClient.put(`/users/${id}`, data).then((r) => r.data);

export const toggleUserLock = (id) =>
    axiosClient.put(`/users/${id}/toggle-lock`).then((r) => r.data);

export const createUser = (data) =>
    axiosClient.post('/users/register', { ...data, agreeTerms: true }).then((r) => r.data);

export const changePassword = (id, currentPassword, newPassword) =>
    axiosClient.put(`/users/${id}/change-password`, { currentPassword, newPassword }).then((r) => r.data);

export const deleteUser = (id) =>
    axiosClient.delete(`/users/${id}`).then((r) => r.data);

export const loginGoogle = (data) =>
    axiosClient.post('/users/login/google', data).then((r) => r.data);

export const loginFacebook = (data) =>
    axiosClient.post('/users/login/facebook', data).then((r) => r.data);

const userService = { getAllUsers, getUserStats, updateUser, toggleUserLock, createUser, changePassword, deleteUser, loginGoogle, loginFacebook };
export default userService;
