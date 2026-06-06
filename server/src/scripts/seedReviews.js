import { pgPool } from "../config/db.js";
import { updateTourRatingStats } from "../models/reviewModel.js";

// Realistic Vietnamese comments by star rating
const commentsPool = {
    5: [
        "Chuyến đi tuyệt vời! Hướng dẫn viên rất nhiệt tình và chu đáo. Khách sạn sạch sẽ, đồ ăn ngon.",
        "Dịch vụ chất lượng cao, lịch trình hợp lý. Tôi rất hài lòng với chuyến đi này. Sẽ ủng hộ Tripeasy trong tương lai.",
        "Tour cực kỳ chất lượng, đáng tiền! Phong cảnh đẹp xuất sắc, được chăm sóc chu đáo từ đầu đến cuối.",
        "Một trải nghiệm tuyệt vời cho gia đình tôi. Mọi dịch vụ đều vượt mong đợi. Hướng dẫn viên vui tính và có kiến thức sâu rộng.",
        "Quá tuyệt vời! Rất hài lòng về cách tổ chức chuyên nghiệp của công ty. Xe di chuyển êm ái, sạch sẽ.",
        "Tour tổ chức rất tốt, thời gian tham quan hợp lý, HDV am hiểu lịch sử địa phương. Đồ ăn nhà hàng rất tươi ngon.",
        "Cực kỳ hài lòng với dịch vụ chăm sóc khách hàng của Tripeasy. Tư vấn nhiệt tình, xe đưa đón đúng giờ.",
        "Chuyến đi trọn vẹn, cảnh đẹp mê hồn. Chắc chắn tôi sẽ giới thiệu bạn bè và người thân đi tour này!"
    ],
    4: [
        "Tour khá ổn, cảnh đẹp, nhưng di chuyển hơi nhiều nên hơi mệt. Bù lại ăn uống rất ngon miệng.",
        "Mọi thứ đều tốt, từ hướng dẫn viên đến xe di chuyển. Chỉ có điều thời tiết hơi mưa chút ở ngày thứ hai.",
        "Dịch vụ tốt, đồ ăn hợp khẩu vị. Điểm trừ nhỏ là thời gian ở điểm mua sắm hơi dài một chút.",
        "Chuyến đi vui vẻ, dịch vụ chuyên nghiệp. Điểm lưu trú đẹp nhưng wifi hơi yếu. Sẽ quay lại lần sau.",
        "Lịch trình hấp dẫn, nhiều điểm tham quan đẹp. HDV hỗ trợ nhiệt tình. Chất lượng dịch vụ tương xứng với giá tiền.",
        "Đoàn đi vui, các điểm tham quan rất đẹp. Điểm trừ là phòng khách sạn cách âm hơi kém.",
        "Dịch vụ phòng và ăn uống ổn định. Xe đời mới sạch sẽ. Thích nhất là được chụp ảnh checkin thỏa thích.",
        "Tổ chức chuyên nghiệp, đồ ăn phong phú. Xe đi êm ái nhưng khởi hành hơi muộn chút."
    ],
    3: [
        "Chất lượng tạm ổn. Khách sạn phòng hơi nhỏ, đồ ăn trung bình. Hy vọng công ty cải thiện chất lượng dịch vụ.",
        "Tour trung bình. Các điểm đi đẹp nhưng thời gian ở mỗi nơi hơi ngắn. Khách sạn chưa được như kỳ vọng.",
        "Tạm được. Đồ ăn hơi lặp lại giữa các bữa. Xe đưa đón sạch sẽ nhưng điều hòa hơi yếu.",
        "Mọi thứ ở mức chấp nhận được. Dịch vụ chưa thực sự nổi bật so với giá tiền bỏ ra.",
        "Hướng dẫn viên nhiệt tình nhưng lịch trình sắp xếp chưa tối ưu, tốn nhiều thời gian di chuyển trên xe.",
        "Khách sạn hơi cũ, đồ ăn sáng nghèo nàn. Điểm tham quan đẹp nhưng đông đúc quá nên không trải nghiệm được nhiều."
    ],
    2: [
        "Không hài lòng lắm. Hướng dẫn viên không nhiệt tình, lịch trình bị trễ giờ nhiều lần.",
        "Khách sạn cũ, đồ ăn không hợp vệ sinh lắm. Lịch trình thay đổi mà không báo trước rõ ràng.",
        "Xe đón trễ và không khí trên xe ngột ngạt. Trải nghiệm không được như mô tả ban đầu.",
        "Dịch vụ trung bình kém. Khách sạn không đúng tiêu chuẩn ghi trên tour, giải quyết khiếu nại của khách chậm."
    ],
    1: [
        "Trải nghiệm rất tệ. Xe đón muộn 1 tiếng, khách sạn không đúng như cam kết lúc đặt tour.",
        "Dịch vụ quá kém. Hướng dẫn viên thái độ không tốt với khách. Sẽ không bao giờ quay lại.",
        "Thất vọng hoàn toàn. Bị hủy điểm tham quan chính mà không có sự đền bù thỏa đáng nào.",
        "Không đáng đồng tiền bát gạo. Chương trình đi cập rập, bữa ăn nghèo nàn và khách sạn bẩn."
    ]
};

// Admin replies matching the stars
const adminRepliesPool = {
    5: [
        "Chào bạn, cảm ơn bạn đã phản hồi! Tripeasy rất vui vì bạn đã có một chuyến đi tuyệt vời. Hẹn gặp lại bạn trong các hành trình tiếp theo nhé!",
        "Dạ Tripeasy cảm ơn đánh giá 5 sao của quý khách! Sự hài lòng của quý khách là động lực to lớn cho đội ngũ của chúng tôi.",
        "Cảm ơn quý khách đã tin tưởng và lựa chọn Tripeasy. Rất mong được tiếp tục đồng hành cùng gia đình mình trong những chuyến đi tới ạ!"
    ],
    4: [
        "Chào bạn, rất tiếc vì thời tiết hoặc một vài bất tiện nhỏ không ủng hộ chuyến đi của bạn trọn vẹn 100%. Tripeasy hy vọng sẽ được phục vụ bạn tốt hơn trong chuyến đi tới!",
        "Dạ cảm ơn phản hồi của bạn. Tripeasy ghi nhận góp ý về phần lưu trú/wifi để làm việc lại với đối tác khách sạn nhằm cải thiện chất lượng dịch vụ tốt hơn.",
        "Chào bạn, cảm ơn đóng góp ý kiến của bạn. Tripeasy sẽ điều chỉnh lại lịch trình mua sắm để tối ưu thời gian nghỉ ngơi của du khách."
    ],
    3: [
        "Chào bạn, cảm ơn ý kiến đóng góp của bạn. Chúng tôi chân thành xin lỗi vì trải nghiệm chưa thực sự hoàn hảo. Tripeasy đã làm việc lại với phía nhà hàng và khách sạn để cải thiện chất lượng dịch vụ.",
        "Cảm ơn phản hồi thẳng thắn của bạn. Tripeasy sẽ kiểm tra lại hệ thống xe đưa đón và điều hòa để mang lại sự thoải mái nhất cho khách hàng."
    ],
    2: [
        "Chào bạn, chúng tôi vô cùng xin lỗi về trải nghiệm không tốt này. Tripeasy đã chấn chỉnh lại thái độ phục vụ của hướng dẫn viên và quy trình đưa đón khách. Rất mong bạn thông cảm!",
        "Dạ chân thành xin lỗi bạn về sự cố thay đổi lịch trình đột xuất. Tripeasy sẽ liên hệ trực tiếp với bạn để làm rõ sự việc và đưa ra phương án xử lý thỏa đáng nhất."
    ],
    1: [
        "Chào bạn, Tripeasy chân thành xin lỗi vì trải nghiệm rất tồi tệ mà bạn đã gặp phải. Chúng tôi ghi nhận phản hồi nghiêm túc này và đang tiến hành xử lý kỷ luật bộ phận liên quan để cải thiện ngay lập tức. Rất mong nhận được sự thông cảm từ phía quý khách."
    ]
};

async function main() {
    try {
        console.log("=== BẮT ĐẦU SEED DỮ LIỆU ĐÁNH GIÁ ===");

        // 1. Lấy danh sách Users và Tours
        const { rows: users } = await pgPool.query("SELECT user_id, username, email FROM users");
        const { rows: tours } = await pgPool.query("SELECT tour_id, title FROM tours");

        if (users.length === 0) {
            console.log("Không tìm thấy người dùng nào trong CSDL! Hãy tạo một số người dùng trước.");
            return;
        }
        if (tours.length === 0) {
            console.log("Không tìm thấy tour nào trong CSDL! Hãy tạo một số tour trước.");
            return;
        }

        console.log(`Tìm thấy ${users.length} người dùng và ${tours.length} tour.`);

        // Xóa sạch các đánh giá cũ để seed mới hoàn toàn
        console.log("Đang làm sạch bảng reviews...");
        await pgPool.query("DELETE FROM reviews");

        let totalReviewsCount = 0;
        let totalBookingsCreated = 0;

        // Định nghĩa tỷ lệ phân bổ sao: 5 sao (50%), 4 sao (30%), 3 sao (12%), 2 sao (5%), 1 sao (3%)
        const ratingsDistribution = [
            5, 5, 5, 5, 5, // 5 sao
            4, 4, 4,       // 4 sao
            3,             // 3 sao
            2,             // 2 sao
            1              // 1 sao
        ];

        // Duyệt qua từng tour và tạo các review ngẫu nhiên
        for (const tour of tours) {
            // Mỗi tour sẽ có khoảng 3 đến 8 đánh giá
            const numReviews = Math.floor(Math.random() * 6) + 3; // 3 - 8 reviews
            console.log(`Đang sinh ${numReviews} đánh giá cho Tour ID ${tour.tour_id}: "${tour.title}"`);

            // Xáo trộn danh sách người dùng để tránh trùng lặp
            const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, Math.min(numReviews, users.length));

            for (const user of selectedUsers) {
                // 1. Tạo đơn đặt tour (booking) trạng thái COMPLETED nếu chưa có
                const { rows: existingBooking } = await pgPool.query(
                    "SELECT booking_id FROM bookings WHERE user_id = $1 AND tour_id = $2 AND booking_status = 'COMPLETED'",
                    [user.user_id, tour.tour_id]
                );

                if (existingBooking.length === 0) {
                    // Tạo một booking giả lập hoàn thành để được đánh giá "Verified"
                    await pgPool.query(
                        `INSERT INTO bookings 
                         (tour_id, user_id, num_adults, num_children, total_price, payment_status, booking_status, start_date, payment_method) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '5 days', $8)`,
                        [tour.tour_id, user.user_id, 2, 0, 4500000, 'PAID', 'COMPLETED', 'VNPAY']
                    );
                    totalBookingsCreated++;
                }

                // 2. Chọn ngẫu nhiên số sao dựa trên tỷ lệ
                const rating = ratingsDistribution[Math.floor(Math.random() * ratingsDistribution.length)];
                
                // 3. Chọn ngẫu nhiên bình luận tương ứng với số sao
                const comments = commentsPool[rating];
                const comment = comments[Math.floor(Math.random() * comments.length)];

                // 4. Chọn ngẫu nhiên thời gian gửi đánh giá (trong khoảng 30 ngày qua)
                const daysAgo = Math.floor(Math.random() * 30);
                const hoursAgo = Math.floor(Math.random() * 24);
                const timestamp = new Date();
                timestamp.setDate(timestamp.getDate() - daysAgo);
                timestamp.setHours(timestamp.getHours() - hoursAgo);

                // 5. Xác định xem Admin có trả lời không (tỷ lệ 45%)
                let adminReply = null;
                let repliedAt = null;
                if (Math.random() < 0.45) {
                    const replies = adminRepliesPool[rating];
                    adminReply = replies[Math.floor(Math.random() * replies.length)];
                    
                    // Thời gian phản hồi sau đó từ 1 đến 12 giờ
                    repliedAt = new Date(timestamp.getTime() + (Math.floor(Math.random() * 11) + 1) * 60 * 60 * 1000);
                }

                // 6. Chèn vào bảng reviews
                await pgPool.query(
                    `INSERT INTO reviews (tour_id, user_id, rating, comment, timestamp, admin_reply, replied_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [tour.tour_id, user.user_id, rating, comment, timestamp, adminReply, repliedAt]
                );
                
                totalReviewsCount++;
            }

            // 7. Cập nhật rating trung bình và lượt review cho Tour
            await updateTourRatingStats(tour.tour_id);
        }

        console.log(`\n=== KẾT QUẢ SEEDING ===`);
        console.log(`- Đã tạo thêm: ${totalBookingsCreated} đơn đặt tour (COMPLETED)`);
        console.log(`- Đã tạo: ${totalReviewsCount} đánh giá mới có sao và bình luận thực tế`);
        console.log(`- Đã đồng bộ điểm trung bình rating_avg và review_count trong bảng tours`);
        console.log(`======================`);

    } catch (error) {
        console.error("Lỗi khi seed dữ liệu reviews:", error);
    } finally {
        await pgPool.end();
    }
}

main();
