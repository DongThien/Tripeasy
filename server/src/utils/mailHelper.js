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

export const sendMail = async (mailOptions) => {
    // Trích xuất tên người gửi từ mailOptions.from
    let fromName = "Tripeasy System";
    if (mailOptions.from) {
        const matches = mailOptions.from.match(/^"([^"]+)"/);
        if (matches && matches[1]) {
            fromName = matches[1];
        }
    }
    const senderEmail = process.env.EMAIL_USER || "dongthien157@gmail.com";

    // 1. Dùng Brevo HTTP API
    if (process.env.BREVO_API_KEY) {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: fromName, email: senderEmail },
                to: [{ email: mailOptions.to }],
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

    // 2. Dùng SendGrid HTTP API
    if (process.env.SENDGRID_API_KEY) {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: mailOptions.to }] }],
                from: { email: senderEmail, name: fromName },
                subject: mailOptions.subject,
                content: [{ type: 'text/html', value: mailOptions.html }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`SendGrid HTTP API failed: ${response.status} - ${errText}`);
        }
        return { success: true };
    }

    // 3. Dùng Resend HTTP API
    if (process.env.RESEND_API_KEY) {
        // Lưu ý: Nếu dùng Resend Free, người gửi bắt đầu bằng "onboarding@resend.dev"
        // trừ khi đã verify domain trong dashboard của Resend.
        const resendSender = process.env.RESEND_SENDER || `onboarding@resend.dev`;
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `"${fromName}" <${resendSender}>`,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Resend HTTP API failed: ${response.status} - ${errText}`);
        }
        return await response.json();
    }

    // 4. Mặc định dùng Nodemailer SMTP (chạy local hoặc khi đã unblock port)
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
