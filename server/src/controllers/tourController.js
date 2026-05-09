import {
    getAllToursData,
    createTourData,
    getTourByIdData,
    updateTourData,
    deleteTourData,
    uploadTourImagesData,
    getTourReviewsData // IMPORT THÊM HÀM NÀY
} from "../services/tourService.js";

// GET /api/tours - Lấy tất cả tours (không limit mặc định)
export const getAllTours = async (req, res) => {
    try {
        const data = await getAllToursData(req.query);
        res.status(200).json({
            success: true,
            data,
            message: "Lấy dữ liệu thành công"
        });

    } catch (err) {
        console.error("Error in getAllTours:", err);
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// POST /api/tours - Tạo tour mới
export const createTour = async (req, res) => {
    try {
        const data = await createTourData(req.body);
        res.status(201).json({
            success: true,
            data,
            message: "Tour được tạo thành công. Ảnh sẽ được upload ở background."
        });

    } catch (err) {
        console.error("Error in createTour:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: "Lỗi server khi tạo tour: " + err.message
        });
    }
};

// GET /api/tours/:id - Lấy chi tiết tour theo ID
export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTourByIdData(id);
        res.status(200).json({
            success: true,
            data,
            message: "Lấy chi tiết tour thành công"
        });

    } catch (err) {
        console.error("Error in getTourById:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Lỗi server: " + err.message
        });
    }
};

// PUT /api/tours/:id
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await updateTourData(id, req.body);
        res.json({ success: true, data, message: "Tour updated successfully" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// DELETE /api/tours/:id
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await deleteTourData(id);
        res.json({ success: true, data, message: "Tour deleted successfully" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// POST /api/tours/:id/images - Upload ảnh riêng 
export const uploadTourImages = async (req, res) => {
    try {
        const { id: tourId } = req.params;
        const data = await uploadTourImagesData(tourId, req.files);
        res.status(201).json({
            success: true,
            data,
            message: `Đã upload thành công ${data.images_count} ảnh`
        });

    } catch (err) {
        console.error("Error in uploadTourImages:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: "Lỗi server khi upload ảnh: " + err.message
        });
    }
};

// THÊM HÀM NÀY: GET /api/tours/:id/reviews - Lấy danh sách đánh giá của tour
export const getTourReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTourReviewsData(id);
        res.status(200).json({
            success: true,
            data,
            message: "Lấy danh sách đánh giá thành công"
        });

    } catch (err) {
        console.error("Error in getTourReviews:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Lỗi server: " + err.message
        });
    }
};