// src/services/tourService.js
import axiosClient from './axiosClient';

const tourService = {
    // Lấy tất cả tours
    getAllTours: async () => {
        try {
            const response = await axiosClient.get('/tours');
            console.log("Raw API Response:", response);
            console.log("Response data:", response.data);

            // Backend trả về: {success: true, data: [...], message: "..."}
            const apiData = response.data;

            // Bóc tách an toàn - mảng thật nằm ở apiData.data
            const finalArray = Array.isArray(apiData?.data) ? apiData.data : [];

            console.log("Final array to component:", finalArray);
            return finalArray;

        } catch (error) {
            console.error('API Error - using mock data:', error);
            // Return mock data if API fails
            return [
                {
                    id: 1,
                    title: "Du lịch Hạ Long",
                    destination: "Quảng Ninh",
                    price: 2500000,
                    duration: "3 ngày 2 đêm",
                    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                    status: "active",
                    maxGuests: 20,
                    availableSlots: 15
                },
                {
                    id: 2,
                    title: "Khám phá Sapa",
                    destination: "Lào Cai",
                    price: 3200000,
                    duration: "4 ngày 3 đêm",
                    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
                    status: "active",
                    maxGuests: 15,
                    availableSlots: 8
                },
                {
                    id: 3,
                    title: "Tour Phú Quốc",
                    destination: "Kiên Giang",
                    price: 4500000,
                    duration: "5 ngày 4 đêm",
                    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
                    status: "draft",
                    maxGuests: 25,
                    availableSlots: 20
                }
            ];
        }
    },

    // Lấy tour theo ID
    getTourById: async (id) => {
        try {
            const response = await axiosClient.get(`/tours/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tour:', error);
            throw error;
        }
    },

    // Tạo tour mới
    createTour: async (tourData) => {
        try {
            const response = await axiosClient.post('/tours', tourData);
            return response.data;
        } catch (error) {
            console.error('Error creating tour:', error);
            throw error;
        }
    },

    // Cập nhật tour
    updateTour: async (id, tourData) => {
        try {
            const response = await axiosClient.put(`/tours/${id}`, tourData);
            return response.data;
        } catch (error) {
            console.error('Error updating tour:', error);
            throw error;
        }
    },

    // Xóa tour
    deleteTour: async (id) => {
        try {
            const response = await axiosClient.delete(`/tours/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting tour:', error);
            throw error;
        }
    }
};

export default tourService;