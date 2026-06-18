import nodemailer from 'nodemailer';

// Khởi tạo Transporter mặc định cho SMTP (chạy local)
const smtpTransporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Gửi email bằng cách tự động chọn giữa Brevo HTTP API (khi có BREVO_API_KEY) và Nodemailer SMTP.
 * Nhận tham số mailOptions giống hệt như nodemailer.sendMail(mailOptions).
 */
export const sendMail = async (mailOptions) => {
    // 1. Kiểm tra nếu cấu hình Brevo API key được cung cấp (Khuyên dùng trên Render free tier)
    if (process.env.BREVO_API_KEY) {
        const senderEmail = process.env.EMAIL_USER || "dongthien157@gmail.com";
        
        // Trích xuất tên người gửi từ mailOptions.from (ví dụ: "Tripeasy Support" -> Tripeasy Support)
        let fromName = "Tripeasy System";
        if (mailOptions.from) {
            const matches = mailOptions.from.match(/^"([^"]+)"/);
            if (matches && matches[1]) {
                fromName = matches[1];
            }
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: fromName,
                    email: senderEmail
                },
                to: [
                    {
                        email: mailOptions.to
                    }
                ],
                subject: mailOptions.subject,
                htmlContent: mailOptions.html
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Brevo HTTP API failed: ${response.status} - ${errText}`);
        }
        
        return await response.json();
    }

    // 2. Mặc định dùng Nodemailer SMTP (Chạy tốt khi local hoặc khi đã unblock port)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Thiếu cấu hình EMAIL_USER/EMAIL_PASS để gửi mail qua SMTP");
    }

    return new Promise((resolve, reject) => {
        smtpTransporter.sendMail(mailOptions, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        });
    });
};
