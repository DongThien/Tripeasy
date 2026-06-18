import { sendMail } from '../utils/mailHelper.js';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, message: "Vui lòng cung cấp email hợp lệ" });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Định dạng email không hợp lệ" });
        }

        // Gửi email qua Mail Helper (SMTP hoặc Brevo API)

        // Set up email content for the admin
        const mailOptions = {
            from: `"Tripeasy System" <${process.env.EMAIL_USER}>`,
            to: 'dongthien157@gmail.com',
            subject: '🔔 Khách hàng mới đăng ký nhận tin ưu đãi',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #8B1A1A; border-bottom: 2px solid #8B1A1A; padding-bottom: 10px;">Đăng ký nhận tin ưu đãi mới</h2>
                    <p>Chào Admin,</p>
                    <p>Hệ thống Tripeasy vừa ghi nhận một yêu cầu đăng ký nhận thông tin khuyến mãi và ưu đãi từ khách hàng mới.</p>
                    <div style="background-color: #FDFBF7; padding: 15px; border-radius: 8px; border: 1px solid #e1d8cb; margin: 20px 0;">
                        <strong>Địa chỉ Email khách hàng:</strong> 
                        <a href="mailto:${email}" style="color: #8B1A1A; text-decoration: none; font-weight: bold;">${email}</a>
                    </div>
                    <p>Vui lòng cập nhật email này vào danh sách khách hàng tiếp thị của bạn.</p>
                    <p style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">Đây là thông báo tự động từ hệ thống quản trị Tripeasy.</p>
                   </div>`
        };

        // Send email
        await sendMail(mailOptions);
        
        res.json({ success: true, message: "Đăng ký nhận thông tin ưu đãi thành công!" });
    } catch (err) {
        console.error("Subscription notification email error:", err);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi hệ thống khi đăng ký nhận tin" });
    }
};
