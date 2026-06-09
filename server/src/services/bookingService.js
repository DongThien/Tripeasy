import nodemailer from "nodemailer";
import {
    fetchTourPriceRow,
    insertBookingRow,
    fetchUserBookingsRows,
    fetchAllBookingsRows,
    fetchBookingStatsRow,
    fetchBookingByIdRow,
    updateBookingStatusRow,
    fetchDepartureByIdRow,
    updateDepartureStockRow
} from "../models/bookingModel.js";
import { getSetting } from "./settingService.js";

const BOOKING_STATUS_VI = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã hủy"
};

const PAYMENT_STATUS_VI = {
    PENDING: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    COMPLETED: "Đã thanh toán"
};

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

// Định dạng tiền tệ VND khi gửi email
const formatVNDEmail = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const sendBookingConfirmationEmail = async (booking) => {
    const transporter = getTransporter();
    if (!transporter) {
        console.warn("⚠️ EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Bỏ qua gửi email xác nhận đặt tour.");
        return;
    }

    const { booking_id, title, user_name, email, num_adults, num_children, total_price, start_date, payment_method } = booking;
    const paymentMethodText = payment_method === 'OFFICE' ? 'Thanh toán trực tiếp tại văn phòng' : 'Chuyển khoản Ngân hàng (VietQR)';
    
    const siteName = getSetting('general.siteName') || "Tripeasy";
    const hotline = getSetting('general.hotline') || "1900 1234";
    const contactAddress = getSetting('general.address') || "Số 3 đường Cầu Giấy, phường Láng Thượng, quận Đống Đa, Hà Nội";
    const bankCode = getSetting('payment.bankCode') || "MB";
    const accountNumber = getSetting('payment.accountNumber') || "0869688128";
    const accountName = getSetting('payment.accountName') || "NGUYEN DONG THIEN";

    let paymentInstructions = "";
    if (payment_method === 'OFFICE') {
        paymentInstructions = `
            <div style="background-color: #fdfdfd; border: 1px dashed #8B1A1A; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong style="color: #8B1A1A;">📍 Hướng dẫn thanh toán tại văn phòng:</strong><br/>
                Quý khách vui lòng đến địa chỉ văn phòng của ${siteName} tại <strong>${contactAddress}</strong> trong vòng 24 giờ kể từ thời điểm đặt để thực hiện thanh toán và nhận vé tour chính thức.<br/>
                📞 Hotline hỗ trợ 24/7: <strong>${hotline}</strong>.
            </div>
        `;
    } else {
        paymentInstructions = `
            <div style="background-color: #fdfdfd; border: 1px dashed #8B1A1A; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong style="color: #8B1A1A;">💳 Hướng dẫn thanh toán chuyển khoản:</strong><br/>
                Quý khách vui lòng thực hiện chuyển khoản vào tài khoản ngân hàng của ${siteName}:<br/>
                <ul style="margin: 5px 0; padding-left: 20px;">
                    <li>Ngân hàng: <strong>${bankCode}</strong></li>
                    <li>Số tài khoản: <strong>${accountNumber}</strong></li>
                    <li>Chủ tài khoản: <strong>${accountName}</strong></li>
                    <li>Số tiền cần chuyển: <strong style="color: #8B1A1A;">${formatVNDEmail(total_price)}</strong></li>
                    <li>Nội dung chuyển khoản (bắt buộc): <strong>TRIPEASY BK ${booking_id}</strong></li>
                </ul>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #666; font-style: italic;">
                    * Lưu ý: Quý khách hãy ghi chính xác nội dung chuyển khoản ở trên để hệ thống tự động nhận diện và kích hoạt trạng thái thanh toán nhanh nhất.
                </p>
            </div>
        `;
    }

    const formattedStartDate = new Date(start_date).toLocaleDateString('vi-VN');

    const mailOptions = {
        from: `"Tripeasy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `[Tripeasy] Xác nhận nhận yêu cầu đặt tour #${booking_id}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; color: #2d3748;">
                <div style="text-align: center; border-bottom: 3px solid #8B1A1A; padding-bottom: 15px; margin-bottom: 20px;">
                    <h2 style="color: #8B1A1A; margin: 0; font-size: 24px;">TRIPEASY</h2>
                    <p style="font-size: 13px; color: #718096; margin: 5px 0 0 0; letter-spacing: 1px;">TRẢI NGHIỆM DU LỊCH ĐÍCH THỰC</p>
                </div>
                
                <p>Kính chào Quý khách <strong>${user_name}</strong>,</p>
                <p>Cảm ơn quý khách đã đặt dịch vụ du lịch tại <strong>Tripeasy</strong>. Hệ thống đã ghi nhận thông tin đặt chỗ của quý khách với mã số <strong>#BK-${booking_id}</strong>.</p>
                
                <div style="background-color: #f7fafc; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #edf2f7;">
                    <h3 style="color: #8B1A1A; margin-top: 0; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Thông Tin Chi Tiết Đơn Hàng</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <td style="padding: 6px 0; color: #718096; width: 140px;">Tour đặt chỗ:</td>
                            <td style="padding: 6px 0; font-weight: bold; color: #1a202c;">${title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Ngày khởi hành:</td>
                            <td style="padding: 6px 0; color: #1a202c;">${formattedStartDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Số lượng khách:</td>
                            <td style="padding: 6px 0; color: #1a202c;">${num_adults} Người lớn ${num_children > 0 ? `, ${num_children} Trẻ em` : ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Tổng tiền tour:</td>
                            <td style="padding: 6px 0; font-weight: bold; color: #8B1A1A; font-size: 17px;">${formatVNDEmail(total_price)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Hình thức:</td>
                            <td style="padding: 6px 0; color: #1a202c;">${paymentMethodText}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Trạng thái đặt:</td>
                            <td style="padding: 6px 0; color: #dd6b20; font-weight: bold;">Chờ xử lý (PENDING)</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Thanh toán:</td>
                            <td style="padding: 6px 0; color: #e53e3e; font-weight: bold;">Chưa thanh toán</td>
                        </tr>
                    </table>
                </div>

                ${paymentInstructions}

                <p style="margin-top: 25px; font-size: 14px; line-height: 1.5;">
                    Chuyên viên hỗ trợ của Tripeasy sẽ liên hệ trực tiếp với quý khách qua điện thoại trong vòng 15-30 phút để giải đáp thắc mắc và gửi hướng dẫn chi tiết tiếp theo.
                </p>
                
                <div style="border-top: 1px solid #edf2f7; margin-top: 30px; padding-top: 15px; font-size: 12px; color: #a0aec0; text-align: center;">
                    <p style="margin: 0;">© 2026 Tripeasy. Mọi quyền được bảo lưu.</p>
                    <p style="margin: 5px 0 0 0;">Số 3 đường Cầu Giấy, phường Láng Thượng, quận Đống Đa, Hà Nội | Hotline: 1900 1234</p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

const sendBookingUpdateEmail = async (booking) => {
    const transporter = getTransporter();
    if (!transporter) return;

    const { booking_id, title, user_name, email, num_adults, num_children, total_price, start_date, booking_status, payment_status } = booking;
    
    const siteName = getSetting('general.siteName') || "Tripeasy";
    const hotline = getSetting('general.hotline') || "1900 1234";
    const contactAddress = getSetting('general.address') || "Số 3 đường Cầu Giấy, phường Láng Thượng, quận Đống Đa, Hà Nội";

    let statusText = "Chờ xử lý";
    let statusColor = "#dd6b20";
    let additionalInfo = "";

    if (booking_status === 'COMPLETED') {
        statusText = "Đã hoàn thành (COMPLETED)";
        statusColor = "#38a169";
        additionalInfo = `
            <p style="color: #2f855a; font-weight: bold;">🎉 Đơn hàng của quý khách đã được xác nhận thanh toán thành công!</p>
            <p>${siteName} xin chân thành cảm ơn quý khách đã hoàn tất thanh toán số tiền <strong>${formatVNDEmail(total_price)}</strong>. Đơn đặt tour của quý khách hiện đã chuyển sang trạng thái <strong>ĐÃ HOÀN THÀNH</strong> và được bảo đảm chỗ trên chuyến đi khởi hành ngày <strong>${new Date(start_date).toLocaleDateString('vi-VN')}</strong>.</p>
            <p>Chúng tôi đã đính kèm vé du lịch điện tử kèm mã đơn hàng này. Quý khách vui lòng chuẩn bị hành lý và lưu lại thông tin này để xuất trình cho Hướng dẫn viên khi tập trung khởi hành.</p>
        `;
    } else if (booking_status === 'CONFIRMED') {
        statusText = "Đã xác nhận (CONFIRMED)";
        statusColor = "#3182ce";
        additionalInfo = `
            <p style="color: #2b6cb0; font-weight: bold;">✅ Đơn hàng của quý khách đã được duyệt xác nhận!</p>
            <p>Yêu cầu đặt tour đã được bộ phận điều hành kiểm tra thông tin và xác nhận thành công. Trạng thái thanh toán của quý khách sẽ được cập nhật ngay khi chúng tôi đối soát giao dịch chuyển khoản hoặc nhận tiền mặt trực tiếp.</p>
        `;
    } else if (booking_status === 'CANCELLED') {
        statusText = "Đã hủy đơn (CANCELLED)";
        statusColor = "#e53e3e";
        additionalInfo = `
            <p style="color: #9b2c2c; font-weight: bold;">❌ Đơn đặt tour đã được hủy bỏ.</p>
            <p>Hệ thống ghi nhận đơn đặt tour số <strong>#BK-${booking_id}</strong> của quý khách đã hủy. Số lượng chỗ trống đã được giải phóng trở lại cho hệ thống du lịch.</p>
            <p>Nếu việc hủy đơn này là do nhầm lẫn hoặc quý khách muốn hoàn tiền cọc/đổi tour, vui lòng phản hồi email này hoặc liên hệ hotline <strong>${hotline}</strong> để được xử lý thủ tục.</p>
        `;
    }

    const paymentText = PAYMENT_STATUS_VI[payment_status] ?? payment_status;
    const paymentColor = payment_status === 'PAID' || payment_status === 'COMPLETED' ? '#38a169' : '#e53e3e';
    const formattedStartDate = new Date(start_date).toLocaleDateString('vi-VN');

    const mailOptions = {
        from: `"${siteName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `[${siteName}] Cập nhật đơn đặt tour #${booking_id} - ${statusText}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; color: #2d3748;">
                <div style="text-align: center; border-bottom: 3px solid #8B1A1A; padding-bottom: 15px; margin-bottom: 20px;">
                    <h2 style="color: #8B1A1A; margin: 0; font-size: 24px;">${siteName.toUpperCase()}</h2>
                    <p style="font-size: 13px; color: #718096; margin: 5px 0 0 0;">THÔNG BÁO CẬP NHẬT TRẠNG THÁI</p>
                </div>
                
                <p>Kính chào Quý khách <strong>${user_name}</strong>,</p>
                <p>${siteName} xin thông báo đơn đặt tour <strong>#BK-${booking_id}</strong> của Quý khách đã có cập nhật trạng thái mới trên hệ thống:</p>
                
                <div style="background-color: #f7fafc; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #edf2f7;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <td style="padding: 6px 0; color: #718096; width: 140px;">Mã Booking:</td>
                            <td style="padding: 6px 0; font-weight: bold; color: #8B1A1A;">#BK-${booking_id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Tên tour du lịch:</td>
                            <td style="padding: 6px 0; font-weight: bold; color: #1a202c;">${title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Ngày khởi hành:</td>
                            <td style="padding: 6px 0; color: #1a202c;">${formattedStartDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Trạng thái đặt:</td>
                            <td style="padding: 6px 0; color: ${statusColor}; font-weight: bold;">${statusText}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Trạng thái thanh toán:</td>
                            <td style="padding: 6px 0; color: ${paymentColor}; font-weight: bold;">${paymentText}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #718096;">Tổng tiền tour:</td>
                            <td style="padding: 6px 0; font-weight: bold; color: #1a202c;">${formatVNDEmail(total_price)}</td>
                        </tr>
                    </table>
                </div>

                <div style="line-height: 1.6; font-size: 14px;">
                    ${additionalInfo}
                </div>

                <p style="margin-top: 25px; font-size: 14px;">
                    Nếu quý khách cần hỗ trợ thêm thông tin gì khác, xin vui lòng gọi hotline <strong>${hotline}</strong> để được xử lý lập tức.
                </p>
                
                <div style="border-top: 1px solid #edf2f7; margin-top: 30px; padding-top: 15px; font-size: 12px; color: #a0aec0; text-align: center;">
                    <p style="margin: 0;">© 2026 ${siteName}. Mọi quyền được bảo lưu.</p>
                    <p style="margin: 5px 0 0 0;">${contactAddress} | Hotline: ${hotline}</p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

const mapBooking = (row) => ({
    booking_id: row.booking_id,
    tour_name: row.title,
    customer_name: row.user_name,
    customer_phone: row.phone_number || "—",
    customer_email: row.email || "—",
    booked_at: row.booking_date,
    num_adults: row.num_adults,
    num_children: row.num_children,
    total_price: parseFloat(row.total_price),
    special_requests: row.special_requests || "",
    status: BOOKING_STATUS_VI[row.booking_status] ?? row.booking_status,
    payment: PAYMENT_STATUS_VI[row.payment_status] ?? row.payment_status,
    booking_status: row.booking_status,
    payment_status: row.payment_status,
    payment_method: row.payment_method || "BANK_TRANSFER",
    start_date: row.start_date,
    tour_id: row.tour_id,
    user_id: row.user_id,
    image: row.image
});

export const createBookingData = async ({
    tour_id,
    user_id,
    num_adults,
    num_children,
    promotion_id,
    special_requests,
    departure_id,
    payment_method
}) => {
    const tourRow = await fetchTourPriceRow(tour_id);
    if (!tourRow) {
        const error = new Error("Không tìm thấy tour này");
        error.statusCode = 404;
        throw error;
    }

    const departure = await fetchDepartureByIdRow(departure_id);
    if (!departure) {
        const error = new Error("Không tìm thấy ngày khởi hành tương ứng");
        error.statusCode = 404;
        throw error;
    }

    const seatsToBook = num_adults + num_children;
    if (departure.stock < seatsToBook) {
        const error = new Error(`Rất tiếc, ngày này chỉ còn ${departure.stock} chỗ trống, không đủ cho đoàn ${seatsToBook} khách.`);
        error.statusCode = 400;
        throw error;
    }

    const totalPrice = tourRow.price_adult * num_adults + tourRow.price_child * num_children;

    // Giảm số lượng chỗ trống trong ngày đi
    await updateDepartureStockRow(tour_id, departure.start_date, -seatsToBook);

    const booking = await insertBookingRow({
        tourId: tour_id,
        userId: user_id,
        promotionId: promotion_id,
        numAdults: num_adults,
        numChildren: num_children,
        totalPrice,
        specialRequests: special_requests,
        startDate: departure.start_date,
        paymentMethod: payment_method || 'BANK_TRANSFER'
    });

    // Lấy thông tin đầy đủ kèm theo liên kết bảng để gửi email
    const fullBooking = await fetchBookingByIdRow(booking.booking_id);
    if (fullBooking) {
        // Gửi email không chặn luồng chạy chính
        sendBookingConfirmationEmail(fullBooking).catch(err => {
            console.error("Gửi email đặt tour lỗi:", err);
        });
    }

    return booking;
};

export const getUserBookingsData = async (userId) => {
    const rows = await fetchUserBookingsRows(userId);
    return rows.map(mapBooking);
};

export const getAllBookingsData = async ({ search, booking_status, payment_status }) => {
    const normalizedBookingStatus =
        booking_status && booking_status !== "all" ? booking_status.toUpperCase() : null;
    const normalizedPaymentStatus =
        payment_status && payment_status !== "all" ? payment_status.toUpperCase() : null;

    const rows = await fetchAllBookingsRows({
        search,
        bookingStatus: normalizedBookingStatus,
        paymentStatus: normalizedPaymentStatus
    });
    return rows.map(mapBooking);
};

export const getBookingStatsData = async () => {
    const { total, pending, monthly_revenue } = await fetchBookingStatsRow();
    return {
        total: parseInt(total) || 0,
        pending: parseInt(pending) || 0,
        monthly_revenue: parseFloat(monthly_revenue) || 0
    };
};

export const getBookingByIdData = async (bookingId) => {
    const row = await fetchBookingByIdRow(bookingId);
    if (!row) {
        const error = new Error("Không tìm thấy đơn đặt tour");
        error.statusCode = 404;
        throw error;
    }
    return mapBooking(row);
};

export const updateBookingStatusData = async (bookingId, paymentStatus, bookingStatus) => {
    // 1. Lấy thông tin booking hiện tại trước khi cập nhật
    const currentBooking = await fetchBookingByIdRow(bookingId);
    if (!currentBooking) {
        const error = new Error("Không tìm thấy đơn đặt tour");
        error.statusCode = 404;
        throw error;
    }

    const prevBookingStatus = currentBooking.booking_status;

    // 2. Cập nhật vào CSDL
    const row = await updateBookingStatusRow(bookingId, paymentStatus, bookingStatus);
    if (!row) {
        const error = new Error("Không tìm thấy đơn đặt tour");
        error.statusCode = 404;
        throw error;
    }

    const seats = currentBooking.num_adults + currentBooking.num_children;

    // 3. Nếu hủy đơn và trước đó chưa hủy -> Trả lại stock
    if (bookingStatus === 'CANCELLED' && prevBookingStatus !== 'CANCELLED') {
        await updateDepartureStockRow(currentBooking.tour_id, currentBooking.start_date, seats);
    }
    // 4. Nếu trước đó đã hủy nay khôi phục lại đơn khác hủy -> Trừ stock
    else if (prevBookingStatus === 'CANCELLED' && bookingStatus !== 'CANCELLED') {
        await updateDepartureStockRow(currentBooking.tour_id, currentBooking.start_date, -seats);
    }

    // 5. Gửi email thông báo cập nhật
    const updatedBooking = await fetchBookingByIdRow(bookingId);
    if (updatedBooking) {
        sendBookingUpdateEmail(updatedBooking).catch(err => {
            console.error("Gửi email cập nhật đơn đặt tour lỗi:", err);
        });
    }

    return mapBooking(row);
};
