import nodemailer from "nodemailer";
import {
    insertContactRow,
    fetchAllContactsRows,
    updateContactStatusRow,
    deleteContactRow,
    updateContactReplyRow,
    fetchContactByIdRow
} from "../models/contactModel.js";

// Helper check cấu hình Mailer
const getTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return null;
};

const STATUS_MAP_VI = {
    PENDING: "Chờ xử lý",
    NEW: "Chờ xử lý",
    READ: "Đã đọc",
    RESOLVED: "Đã giải quyết"
};

const mapContact = (row) => ({
    contact_id: row.contact_id,
    fullName: row.full_name,
    phone: row.phone_number || "—",
    email: row.email,
    subject: row.subject,
    message: row.message,
    replyMessage: row.reply_message || "",
    status: row.status,
    statusText: STATUS_MAP_VI[row.status] || row.status,
    createdAt: row.created_at,
    createdAtFormatted: new Date(row.created_at).toLocaleString("vi-VN")
});

export const createContactData = async (payload) => {
    const { fullName, phone, email, subject, message } = payload;

    if (!fullName || !email || !subject || !message) {
        const error = new Error("Vui lòng điền đầy đủ Họ tên, Email, Chủ đề và Nội dung tin nhắn");
        error.statusCode = 400;
        throw error;
    }

    // 1. Lưu phản hồi vào cơ sở dữ liệu
    const newContact = await insertContactRow({
        fullName,
        phone,
        email,
        subject,
        message
    });

    // 2. Gửi email thông báo cho Admin (nếu có cấu hình email)
    const transporter = getTransporter();
    if (transporter) {
        const mailOptions = {
            from: `"Tripeasy Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Gửi về chính email của Admin
            subject: `🔔 Có liên hệ mới: "${subject}" từ ${fullName}`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #8B1A1A; border-bottom: 2px solid #8B1A1A; padding-bottom: 10px;">Thông báo liên hệ mới từ Khách hàng</h2>
                    <p style="margin: 15px 0;"><strong>Họ và tên:</strong> ${fullName}</p>
                    <p style="margin: 15px 0;"><strong>Số điện thoại:</strong> ${phone || "—"}</p>
                    <p style="margin: 15px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 15px 0;"><strong>Chủ đề:</strong> ${subject}</p>
                    <p style="margin: 15px 0;"><strong>Thời gian:</strong> ${new Date().toLocaleString("vi-VN")}</p>
                    <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #8B1A1A; border-radius: 4px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">Nội dung tin nhắn:</h4>
                        <p style="margin: 0; color: #555; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                    </div>
                    <p style="color: #777; font-size: 12px; margin-top: 30px;">Hệ thống tự động thông báo từ Tripeasy.</p>
                   </div>`
        };

        // Gửi trong background, không chặn response của khách hàng
        transporter.sendMail(mailOptions).catch(err => {
            console.error("❌ Lỗi gửi email thông báo liên hệ mới cho Admin:", err);
        });
    }

    return mapContact(newContact);
};

export const getAllContactsData = async ({ search, status }) => {
    const searchParam = search ? search.trim() : null;
    const statusParam = status && status !== "all" ? status.toUpperCase() : null;

    const rows = await fetchAllContactsRows(searchParam, statusParam);
    return rows.map(mapContact);
};

export const updateContactStatusData = async (contactId, status) => {
    const normalizedStatus = status ? status.toUpperCase() : null;
    if (!["PENDING", "NEW", "READ", "RESOLVED"].includes(normalizedStatus)) {
        const error = new Error("Trạng thái không hợp lệ");
        error.statusCode = 400;
        throw error;
    }

    const updatedRow = await updateContactStatusRow(contactId, normalizedStatus);
    if (!updatedRow) {
        const error = new Error("Không tìm thấy phản hồi liên hệ");
        error.statusCode = 404;
        throw error;
    }

    return mapContact(updatedRow);
};

export const deleteContactData = async (contactId) => {
    const deletedRow = await deleteContactRow(contactId);
    if (!deletedRow) {
        const error = new Error("Không tìm thấy phản hồi liên hệ");
        error.statusCode = 404;
        throw error;
    }
    return mapContact(deletedRow);
};

export const sendReplyEmailData = async (contactId, replyMessage) => {
    if (!replyMessage || replyMessage.trim() === "") {
        const error = new Error("Nội dung email phản hồi không được để trống");
        error.statusCode = 400;
        throw error;
    }

    const contact = await fetchContactByIdRow(contactId);
    if (!contact) {
        const error = new Error("Không tìm thấy thông tin liên hệ");
        error.statusCode = 404;
        throw error;
    }

    const transporter = getTransporter();
    if (!transporter) {
        const error = new Error("Chưa cấu hình thông tin EMAIL_USER/EMAIL_PASS ở máy chủ để gửi email!");
        error.statusCode = 500;
        throw error;
    }

    // Gửi email cho khách hàng
    const mailOptions = {
        from: `"Tripeasy Support" <${process.env.EMAIL_USER}>`,
        to: contact.email,
        subject: `Re: [Tripeasy] Phản hồi liên hệ: ${contact.subject}`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <div style="text-align: center; border-bottom: 2px solid #8B1A1A; padding-bottom: 15px; margin-bottom: 20px;">
                    <h2 style="color: #8B1A1A; margin: 0; font-size: 24px; font-weight: bold;">TRIPEASY SUPPORT</h2>
                    <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Đồng hành cùng chuyến đi của bạn</p>
                </div>
                <p>Kính gửi <strong>${contact.full_name}</strong>,</p>
                <p>Cảm ơn bạn đã gửi liên hệ cho Tripeasy với chủ đề "<strong>${contact.subject}</strong>".</p>
                <p>Chúng tôi xin phản hồi về yêu cầu của bạn như sau:</p>
                
                <div style="margin: 20px 0; padding: 18px; background-color: #fcf9f9; border-left: 5px solid #8B1A1A; border-radius: 6px; line-height: 1.6; color: #222; font-size: 15px; white-space: pre-wrap;">${replyMessage}</div>
                
                <p>Nếu bạn có bất kỳ câu hỏi nào khác hoặc cần hỗ trợ thêm, vui lòng phản hồi trực tiếp qua email này hoặc liên hệ hotline <strong>1900 1234</strong>.</p>
                <p style="margin-top: 30px;">Trân trọng,<br/><strong>Đội ngũ Chăm sóc khách hàng Tripeasy</strong></p>
                
                <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px; line-height: 1.5;">
                    <p style="margin: 0; font-weight: bold;">Nội dung thư gốc bạn đã gửi ngày ${new Date(contact.created_at).toLocaleDateString("vi-VN")}:</p>
                    <blockquote style="margin: 8px 0 0 0; padding-left: 12px; border-left: 2px solid #ddd; color: #777; font-style: italic;">
                        ${contact.message}
                    </blockquote>
                </div>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        const error = new Error("Không thể gửi email trả lời khách hàng. Vui lòng kiểm tra SMTP/App Password của máy chủ.");
        error.statusCode = 500;
        error.original = err;
        throw error;
    }

    // Cập nhật CSDL
    const updated = await updateContactReplyRow(contactId, replyMessage);
    return mapContact(updated);
};
