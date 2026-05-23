import {
    createContactData,
    getAllContactsData,
    updateContactStatusData,
    deleteContactData,
    sendReplyEmailData
} from "../services/contactService.js";

// POST /api/contacts - Tạo liên hệ mới (Public)
export const submitContact = async (req, res) => {
    try {
        const data = await createContactData(req.body);
        res.status(201).json({
            success: true,
            data,
            message: "Gửi phản hồi liên hệ thành công! Chúng tôi sẽ liên hệ lại bạn sớm nhất có thể."
        });
    } catch (err) {
        console.error("Error in submitContact:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message
        });
    }
};

// GET /api/contacts - Lấy danh sách liên hệ (Admin only)
export const getAllContacts = async (req, res) => {
    try {
        const data = await getAllContactsData(req.query);
        res.status(200).json({
            success: true,
            data,
            message: "Lấy danh sách liên hệ thành công"
        });
    } catch (err) {
        console.error("Error in getAllContacts:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message
        });
    }
};

// PUT /api/contacts/:id/status - Cập nhật trạng thái liên hệ (Admin only)
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const data = await updateContactStatusData(id, status);
        res.status(200).json({
            success: true,
            data,
            message: "Cập nhật trạng thái liên hệ thành công"
        });
    } catch (err) {
        console.error("Error in updateContactStatus:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message
        });
    }
};

// DELETE /api/contacts/:id - Xóa phản hồi liên hệ (Admin only)
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await deleteContactData(id);
        res.status(200).json({
            success: true,
            data,
            message: "Xóa phản hồi liên hệ thành công"
        });
    } catch (err) {
        console.error("Error in deleteContact:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message
        });
    }
};

// POST /api/contacts/:id/reply - Gửi phản hồi email cho khách hàng (Admin only)
export const replyToContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { replyMessage } = req.body;
        const data = await sendReplyEmailData(id, replyMessage);
        res.status(200).json({
            success: true,
            data,
            message: "Đã gửi email phản hồi thành công đến hòm thư khách hàng!"
        });
    } catch (err) {
        console.error("Error in replyToContact:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: err.message
        });
    }
};
