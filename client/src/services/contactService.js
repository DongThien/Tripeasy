import axiosClient from './axiosClient';

const contactService = {
    // Gửi phản hồi liên hệ công khai
    submitContactForm: async (formData) => {
        try {
            const response = await axiosClient.post('/contacts', formData);
            return response.data;
        } catch (error) {
            console.error('Error submitting contact form:', error);
            throw error;
        }
    },

    // Lấy danh sách liên hệ (Admin)
    getAllContacts: async (params = {}) => {
        try {
            const response = await axiosClient.get('/contacts', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw error;
        }
    },

    // Cập nhật trạng thái phản hồi liên hệ (Admin)
    updateContactStatus: async (id, status) => {
        try {
            const response = await axiosClient.put(`/contacts/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating contact status:', error);
            throw error;
        }
    },

    // Xóa phản hồi liên hệ (Admin)
    deleteContact: async (id) => {
        try {
            const response = await axiosClient.delete(`/contacts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting contact:', error);
            throw error;
        }
    },

    // Trả lời phản hồi liên hệ (Admin)
    replyContact: async (id, replyMessage) => {
        try {
            const response = await axiosClient.post(`/contacts/${id}/reply`, { replyMessage });
            return response.data;
        } catch (error) {
            console.error('Error replying to contact:', error);
            throw error;
        }
    },

    // Đăng ký nhận tin ưu đãi (Newsletter)
    subscribeNewsletter: async (email) => {
        try {
            const response = await axiosClient.post('/newsletter/subscribe', { email });
            return response.data;
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            throw error;
        }
    }
};

export default contactService;
