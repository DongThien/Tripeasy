import axiosClient from './axiosClient';

/**
 * Lấy cấu hình vận hành hệ thống (Công khai)
 * @returns {Promise<Object>}
 */
export const getSettings = () =>
    axiosClient.get('/settings').then((r) => r.data);

/**
 * Cập nhật cấu hình hệ thống (Admin)
 * @param {Object} data Cấu hình mới
 * @returns {Promise<Object>}
 */
export const updateSettings = (data) =>
    axiosClient.put('/settings', data).then((r) => r.data);

const settingService = { getSettings, updateSettings };
export default settingService;
