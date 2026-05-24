import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import { pgPool } from '../config/db.js';
import { generateEmbedding, cosineSimilarity } from '../services/geminiService.js';

/**
 * Helper to resolve or create a chat session
 */
const getOrCreateSession = async (sessionId, userId) => {
    let finalSessionId = sessionId;

    if (userId) {
        if (finalSessionId) {
            const { rows } = await pgPool.query(
                "SELECT session_id, user_id FROM chat_sessions WHERE session_id = $1",
                [finalSessionId]
            );
            if (rows.length > 0) {
                const session = rows[0];
                if (!session.user_id) {
                    await pgPool.query(
                        "UPDATE chat_sessions SET user_id = $1, updated_at = NOW() WHERE session_id = $2",
                        [userId, finalSessionId]
                    );
                } else if (session.user_id !== userId) {
                    const userSessRes = await pgPool.query(
                        "SELECT session_id FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
                        [userId]
                    );
                    if (userSessRes.rows.length > 0) {
                        finalSessionId = userSessRes.rows[0].session_id;
                    } else {
                        finalSessionId = crypto.randomUUID();
                        await pgPool.query(
                            "INSERT INTO chat_sessions (session_id, user_id, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
                            [finalSessionId, userId]
                        );
                    }
                }
            } else {
                await pgPool.query(
                    "INSERT INTO chat_sessions (session_id, user_id, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
                    [finalSessionId, userId]
                );
            }
        } else {
            const userSessRes = await pgPool.query(
                "SELECT session_id FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
                [userId]
            );
            if (userSessRes.rows.length > 0) {
                finalSessionId = userSessRes.rows[0].session_id;
            } else {
                finalSessionId = crypto.randomUUID();
                await pgPool.query(
                    "INSERT INTO chat_sessions (session_id, user_id, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
                    [finalSessionId, userId]
                );
            }
        }
    } else {
        if (finalSessionId) {
            const { rows } = await pgPool.query(
                "SELECT session_id FROM chat_sessions WHERE session_id = $1",
                [finalSessionId]
            );
            if (rows.length === 0) {
                await pgPool.query(
                    "INSERT INTO chat_sessions (session_id, user_id, created_at, updated_at) VALUES ($1, NULL, NOW(), NOW())",
                    [finalSessionId]
                );
            }
        } else {
            finalSessionId = crypto.randomUUID();
            await pgPool.query(
                "INSERT INTO chat_sessions (session_id, user_id, created_at, updated_at) VALUES ($1, NULL, NOW(), NOW())",
                [finalSessionId]
            );
        }
    }

    await pgPool.query(
        "UPDATE chat_sessions SET updated_at = NOW() WHERE session_id = $1",
        [finalSessionId]
    );

    return finalSessionId;
};

/**
 * Execute filtering tours using SQL
 */
const executeSearchToursByFilters = async (args) => {
    const { price_adult_max, destination, duration, start_location } = args;

    let query = `
        SELECT t.tour_id, t.title, t.destination, t.duration, t.price_adult, t.price_child, t.old_price, t.transport, t.start_location, t.highlights
        FROM tours t
        WHERE t.availability = true
    `;
    const params = [];
    let idx = 1;

    if (price_adult_max) {
        query += ` AND t.price_adult <= $${idx++}`;
        params.push(Number(price_adult_max));
    }
    if (destination) {
        query += ` AND (t.destination ILIKE $${idx} OR t.region ILIKE $${idx})`;
        params.push(`%${destination}%`);
        idx++;
    }
    if (duration) {
        query += ` AND t.duration ILIKE $${idx++}`;
        params.push(`%${duration}%`);
    }
    if (start_location) {
        query += ` AND t.start_location ILIKE $${idx++}`;
        params.push(`%${start_location}%`);
    }

    query += " ORDER BY t.price_adult ASC LIMIT 5";

    const { rows } = await pgPool.query(query, params);
    return rows.map(r => ({
        tour_id: r.tour_id,
        title: r.title,
        destination: r.destination,
        duration: r.duration,
        price_adult: Number(r.price_adult),
        price_child: r.price_child ? Number(r.price_child) : null,
        old_price: r.old_price ? Number(r.old_price) : null,
        transport: r.transport,
        start_location: r.start_location,
        highlights: r.highlights
    }));
};

/**
 * Execute vector similarity search on tours in memory
 */
const executeSearchToursSemantic = async (args) => {
    const { query } = args;
    if (!query) return [];

    const queryVector = await generateEmbedding(query);

    const { rows: tours } = await pgPool.query(
        "SELECT tour_id, title, destination, duration, price_adult, highlights, embedding FROM tours WHERE availability = true AND embedding IS NOT NULL"
    );

    if (tours.length === 0) return [];

    const toursWithScores = tours.map(tour => {
        const score = cosineSimilarity(queryVector, tour.embedding);
        return {
            tour_id: tour.tour_id,
            title: tour.title,
            destination: tour.destination,
            duration: tour.duration,
            price_adult: Number(tour.price_adult),
            highlights: tour.highlights,
            similarity: score
        };
    });

    toursWithScores.sort((a, b) => b.similarity - a.similarity);
    return toursWithScores.slice(0, 3).map(t => ({
        tour_id: t.tour_id,
        title: t.title,
        destination: t.destination,
        duration: t.duration,
        price_adult: t.price_adult,
        highlights: t.highlights,
        similarity: parseFloat(t.similarity.toFixed(4))
    }));
};

/**
 * Retrieve current user profile and booking records
 */
const executeGetUserInfoAndBookings = async (userId) => {
    if (!userId) {
        return {
            authenticated: false,
            message: "Người dùng chưa đăng nhập. Hãy lịch sự yêu cầu họ đăng nhập (nhấp vào biểu tượng Tài khoản ở góc trên bên phải trang web) để xem thông tin đặt tour của mình."
        };
    }

    const userRes = await pgPool.query(
        "SELECT username, email, phone_number FROM users WHERE user_id = $1",
        [userId]
    );

    if (userRes.rows.length === 0) {
        return { authenticated: false, message: "Không tìm thấy thông tin tài khoản." };
    }

    const userData = userRes.rows[0];

    const bookingsRes = await pgPool.query(
        `SELECT b.booking_id, b.tour_id, t.title as tour_title, b.start_date, 
                (b.num_adults + b.num_children) as quantity, 
                b.total_price, b.booking_status as status, b.payment_method, b.payment_status
         FROM bookings b
         JOIN tours t ON b.tour_id = t.tour_id
         WHERE b.user_id = $1
         ORDER BY b.booking_date DESC`,
        [userId]
    );

    return {
        authenticated: true,
        user: {
            username: userData.username,
            email: userData.email,
            fullname: userData.username,
            phone: userData.phone_number
        },
        bookings: bookingsRes.rows.map(b => ({
            booking_id: b.booking_id,
            tour_id: b.tour_id,
            tour_title: b.tour_title,
            start_date: b.start_date,
            quantity: b.quantity,
            total_price: Number(b.total_price),
            status: b.status,
            payment_method: b.payment_method,
            payment_status: b.payment_status
        }))
    };
};

/**
 * Execute booking creation via chatbot
 */
const executeCreateChatBooking = async (userId, args) => {
    if (!userId) {
        return {
            success: false,
            message: "Bạn chưa đăng nhập. Hãy lịch sự yêu cầu người dùng nhấp vào biểu tượng Tài khoản ở góc trên bên phải màn hình để đăng nhập trước khi đặt tour qua chatbot."
        };
    }

    const { tour_id, start_date, num_adults = 1, num_children = 0, payment_method = 'BANK_TRANSFER', special_requests = '' } = args;

    if (!tour_id || !start_date) {
        return { success: false, message: "Thiếu thông tin mã tour (tour_id) hoặc ngày khởi hành (start_date)." };
    }

    // 1. Kiểm tra tour có tồn tại không
    const tourRes = await pgPool.query(
        "SELECT title, price_adult, price_child FROM tours WHERE tour_id = $1 AND availability = true",
        [tour_id]
    );
    if (tourRes.rows.length === 0) {
        return { success: false, message: "Tour này không tồn tại hoặc đã ngừng hoạt động." };
    }
    const tour = tourRes.rows[0];

    // 2. Tìm ngày khởi hành tương ứng
    const depRes = await pgPool.query(
        `SELECT departure_id, start_date, stock 
         FROM tour_departures 
         WHERE tour_id = $1 AND start_date = $2 AND status = 'AVAILABLE'`,
        [tour_id, start_date]
    );

    if (depRes.rows.length === 0) {
        // Tìm các ngày khởi hành khác của tour này để gợi ý cho khách
        const otherDeps = await pgPool.query(
            `SELECT start_date, stock 
             FROM tour_departures 
             WHERE tour_id = $1 AND start_date >= NOW()::date AND status = 'AVAILABLE' 
             ORDER BY start_date ASC LIMIT 5`,
            [tour_id]
        );
        const datesList = otherDeps.rows.map(d => new Date(d.start_date).toLocaleDateString('vi-VN') + ` (còn ${d.stock} chỗ)`).join(', ');
        return {
            success: false,
            message: `Rất tiếc, ngày khởi hành ${new Date(start_date).toLocaleDateString('vi-VN')} không có sẵn. Tour này có các ngày khởi hành sắp tới: ${datesList || 'Chưa có lịch khởi hành mới'}. Hãy gợi ý khách chọn một trong các ngày này.`
        };
    }

    const departure = depRes.rows[0];
    const seatsToBook = Number(num_adults) + Number(num_children);

    if (departure.stock < seatsToBook) {
        return {
            success: false,
            message: `Rất tiếc, ngày khởi hành ${new Date(start_date).toLocaleDateString('vi-VN')} chỉ còn ${departure.stock} chỗ trống, không đủ cho đoàn ${seatsToBook} khách.`
        };
    }

    // 3. Thực hiện đặt tour thông qua bookingService
    try {
        const { createBookingData } = await import('../services/bookingService.js');
        const bookingResult = await createBookingData({
            tour_id: Number(tour_id),
            user_id: Number(userId),
            num_adults: Number(num_adults),
            num_children: Number(num_children),
            departure_id: departure.departure_id,
            payment_method,
            special_requests
        });

        // 4. Lấy chi tiết thông tin đơn hàng vừa đặt để đính kèm trong response
        const bookingDetailsRes = await pgPool.query(
            `SELECT b.booking_id, b.total_price, b.start_date, b.payment_method, b.payment_status,
                    t.title as tour_title, u.username as user_fullname, u.email as user_email
             FROM bookings b
             JOIN tours t ON b.tour_id = t.tour_id
             JOIN users u ON b.user_id = u.user_id
             WHERE b.booking_id = $1`,
            [bookingResult.booking_id]
        );
        const booking = bookingDetailsRes.rows[0];

        return {
            success: true,
            booking_id: booking.booking_id,
            tour_title: booking.tour_title,
            user_fullname: booking.user_fullname,
            user_email: booking.user_email,
            start_date: booking.start_date,
            total_price: Number(booking.total_price),
            payment_method: booking.payment_method,
            payment_status: booking.payment_status,
            message: "Đặt tour thành công! Bạn hãy thông báo cho khách hàng mã đơn đặt chỗ, tổng tiền và hướng dẫn thanh toán chi tiết."
        };
    } catch (err) {
        console.error('Error creating chat booking:', err);
        return { success: false, message: `Lỗi hệ thống khi tạo đơn hàng: ${err.message}` };
    }
};

/**
 * Execute tour itinerary PDF link generation
 */
const executeGenerateTourItineraryPDF = async (args) => {
    const { tour_id } = args;
    if (!tour_id) return { success: false, message: "Mã tour (tour_id) là bắt buộc." };

    const { rows } = await pgPool.query(
        "SELECT tour_id, title FROM tours WHERE tour_id = $1 AND availability = true",
        [tour_id]
    );

    if (rows.length === 0) {
        return { success: false, message: "Tour này không tồn tại hoặc đã ngừng hoạt động." };
    }

    const downloadUrl = `/api/tours/${tour_id}/pdf`;
    return {
        success: true,
        tour_id: Number(tour_id),
        tour_title: rows[0].title,
        download_url: downloadUrl,
        message: `Đã chuẩn bị xong file PDF lịch trình cho tour "${rows[0].title}". Hãy hướng dẫn khách nhấp vào nút tải PDF hiển thị bên dưới.`
    };
};

/**
 * Fetch detailed info of recommended tours to attach to message metadata
 */
const getMetadataTours = async (tourIds) => {
    if (!tourIds || tourIds.length === 0) return [];
    const { rows } = await pgPool.query(
        `SELECT t.tour_id, t.title, t.destination, t.duration, t.price_adult, t.price_child, t.old_price,
                (SELECT i.image_url FROM images i WHERE i.tour_id = t.tour_id ORDER BY i.upload_date ASC LIMIT 1) AS image_url
         FROM tours t
         WHERE t.tour_id = ANY($1::int[]) AND t.availability = true`,
        [tourIds]
    );
    return rows.map(r => ({
        tour_id: r.tour_id,
        title: r.title,
        destination: r.destination,
        duration: r.duration,
        price_adult: Number(r.price_adult),
        price_child: r.price_child ? Number(r.price_child) : null,
        old_price: r.old_price ? Number(r.old_price) : null,
        image_url: r.image_url
    }));
};

/**
 * GET /api/chat/history - Get session message history
 */
export const getChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.query;
        const userId = req.user?.id;

        const resolvedSessionId = await getOrCreateSession(sessionId, userId);

        const { rows: messages } = await pgPool.query(
            "SELECT sender as role, content, metadata, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC",
            [resolvedSessionId]
        );

        return res.status(200).json({
            success: true,
            sessionId: resolvedSessionId,
            messages: messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                text: msg.content,
                metadata: msg.metadata,
                time: new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            }))
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return res.status(500).json({
            success: false,
            message: 'Không thể tải lịch sử trò chuyện: ' + error.message
        });
    }
};

/**
 * POST /api/chat/clear - Clear message history for a session
 */
export const clearChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID is required' });
        }

        await pgPool.query(
            "DELETE FROM chat_messages WHERE session_id = $1",
            [sessionId]
        );

        return res.status(200).json({
            success: true,
            message: 'Đã xóa sạch lịch sử trò chuyện trên hệ thống.'
        });
    } catch (error) {
        console.error('Error clearing chat history:', error);
        return res.status(500).json({
            success: false,
            message: 'Không thể xóa lịch sử trò chuyện: ' + error.message
        });
    }
};

/**
 * POST /api/chat - Main chatbot handler with Hybrid RAG & Tool Calling
 */
export const handleChat = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        const userId = req.user?.id;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('Missing GEMINI_API_KEY in server environment variables');
            return res.status(500).json({
                success: false,
                message: 'Khóa API Google Gemini chưa được cấu hình trên Server. Vui lòng liên hệ Admin.'
            });
        }

        // 1. Get or create the session
        const resolvedSessionId = await getOrCreateSession(sessionId, userId);

        // 2. Save user message to database
        await pgPool.query(
            "INSERT INTO chat_messages (session_id, sender, content, created_at) VALUES ($1, 'user', $2, NOW())",
            [resolvedSessionId, message]
        );

        // 3. Load full message history from database
        const { rows: historyRows } = await pgPool.query(
            "SELECT sender, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC",
            [resolvedSessionId]
        );

        // Map to Gemini history format (excluding the very last message which will be passed to sendMessage)
        const formattedHistory = historyRows.slice(0, -1).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // 4. Initialize Gemini with Tools and System Instruction
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            tools: [{
                functionDeclarations: [
                    {
                        name: 'search_tours_by_filters',
                        description: 'Tìm kiếm và lọc các tour du lịch dựa trên khoảng giá tối đa, địa điểm/điểm đến, thời gian đi, nơi khởi hành.',
                        parameters: {
                            type: 'OBJECT',
                            properties: {
                                price_adult_max: {
                                    type: 'NUMBER',
                                    description: 'Giá vé người lớn tối đa (VNĐ), ví dụ: 4000000'
                                },
                                destination: {
                                    type: 'STRING',
                                    description: 'Địa điểm hoặc vùng miền muốn đến, ví dụ: "Phú Quốc", "Sapa", "Hạ Long"'
                                },
                                duration: {
                                    type: 'STRING',
                                    description: 'Thời gian đi mong muốn, ví dụ: "3 ngày", "2 ngày 1 đêm"'
                                },
                                start_location: {
                                    type: 'STRING',
                                    description: 'Nơi khởi hành mong muốn, ví dụ: "Hà Nội", "TP.HCM"'
                                }
                            }
                        }
                    },
                    {
                        name: 'search_tours_semantic',
                        description: 'Tìm kiếm các tour du lịch bằng tìm kiếm vector theo ngữ nghĩa. Sử dụng khi người dùng hỏi chung chung, theo cảm xúc hoặc sở thích (ví dụ: "biển vắng", "đi trốn", "mạo hiểm", "nghỉ dưỡng").',
                        parameters: {
                            type: 'OBJECT',
                            properties: {
                                query: {
                                    type: 'STRING',
                                    description: 'Nhu cầu, sở thích hoặc cảm xúc của khách hàng, ví dụ: "nghỉ dưỡng biển yên bình"'
                                }
                            },
                            required: ['query']
                        }
                    },
                    {
                        name: 'get_user_info_and_bookings',
                        description: 'Truy xuất thông tin cá nhân và lịch sử danh sách đơn đặt tour (bookings) của khách hàng đang trò chuyện.',
                        parameters: {
                            type: 'OBJECT',
                            properties: {}
                        }
                    },
                    {
                        name: 'create_chat_booking',
                        description: 'Thực hiện đặt tour du lịch trực tiếp cho khách hàng đang trò chuyện khi họ đồng ý đặt. Hãy đảm bảo bạn đã hỏi và xác nhận đầy đủ các thông tin: tour_id (mã tour), start_date (ngày đi YYYY-MM-DD), num_adults (số người lớn), num_children (số trẻ em), payment_method (phương thức thanh toán: "BANK_TRANSFER" hoặc "OFFICE"). Khách hàng bắt buộc phải đăng nhập tài khoản trước.',
                        parameters: {
                            type: 'OBJECT',
                            properties: {
                                tour_id: {
                                    type: 'NUMBER',
                                    description: 'Mã số ID của tour du lịch cần đặt, ví dụ: 21'
                                },
                                start_date: {
                                    type: 'STRING',
                                    description: 'Ngày khởi hành mong muốn (định dạng YYYY-MM-DD), ví dụ: "2026-05-25"'
                                },
                                num_adults: {
                                    type: 'NUMBER',
                                    description: 'Số lượng khách người lớn, mặc định là 1 nếu không chỉ rõ.'
                                },
                                num_children: {
                                    type: 'NUMBER',
                                    description: 'Số lượng khách trẻ em, mặc định là 0 nếu không chỉ rõ.'
                                },
                                payment_method: {
                                    type: 'STRING',
                                    description: 'Phương thức thanh toán: "BANK_TRANSFER" (Chuyển khoản VietQR) hoặc "OFFICE" (Thanh toán tại văn phòng). Mặc định là "BANK_TRANSFER".'
                                },
                                special_requests: {
                                    type: 'STRING',
                                    description: 'Yêu cầu đặc biệt khác của khách hàng (nếu có).'
                                }
                            },
                            required: ['tour_id', 'start_date']
                        }
                    },
                    {
                        name: 'generate_tour_itinerary_pdf',
                        description: 'Tạo liên kết tải file PDF lịch trình chi tiết của một tour du lịch cụ thể dựa trên ID của tour.',
                        parameters: {
                            type: 'OBJECT',
                            properties: {
                                tour_id: {
                                    type: 'NUMBER',
                                    description: 'Mã số ID của tour du lịch cần xuất PDF, ví dụ: 21'
                                }
                            },
                            required: ['tour_id']
                        }
                    }
                ]
            }],
            systemInstruction: {
                parts: [{
                    text: `
Bạn là Tripeasy Bot - Trợ lý ảo chuyên nghiệp, thông minh của nền tảng đặt tour du lịch Tripeasy.
Nhiệm vụ của bạn là:
1. Chào đón và tư vấn thông tin về du lịch, các địa danh nổi tiếng và các tour du lịch có sẵn.
2. Giới thiệu và đề xuất các dịch vụ tour có sẵn trên hệ thống của Tripeasy một cách thân thiện, lịch sự và tự nhiên.
3. Khi giới thiệu tour du lịch, hãy tóm tắt ngắn gọn các nét chính (tên tour, giá cả, thời gian, điểm xuất phát) và dùng các tool được cung cấp để tìm kiếm thông tin thật chính xác từ CSDL.
4. Khi khách hàng bày tỏ ý muốn đặt tour:
   - Hãy gọi tool "get_user_info_and_bookings" để kiểm tra xem họ đã đăng nhập hay chưa.
   - Nếu họ chưa đăng nhập, hãy lịch sự đề nghị họ nhấp vào biểu tượng "Tài khoản" ở góc trên bên phải màn hình để đăng nhập trước khi tiến hành đặt tour qua chatbot.
   - Nếu họ đã đăng nhập, hãy hỏi và xác nhận các thông tin: Ngày khởi hành (start_date), số khách người lớn (num_adults), số khách trẻ em (num_children), và hình thức thanh toán (chuyển khoản VietQR hoặc tại văn phòng).
   - Sau khi khách hàng xác nhận các thông tin trên là chính xác, hãy gọi công cụ "create_chat_booking" để tạo đơn giữ chỗ trực tiếp cho khách hàng.
5. Khi khách hàng yêu cầu tải lịch trình, xin file lịch trình hoặc tải file PDF của một tour, hãy gọi công cụ "generate_tour_itinerary_pdf" để trả về link tải tài liệu cho họ.
6. Xưng hô thân thiện (xưng "Tripeasy Bot" hoặc "mình" và gọi khách là "bạn", hoặc xưng hô theo tên nếu khách cung cấp hoặc khi gọi tool lấy được tên khách).

Lưu ý quan trọng:
- Tuyệt đối KHÔNG tự bịa (hallucinate) ra thông tin giá cả, lịch trình tour nếu CSDL không trả về kết quả. Nếu không tìm thấy tour phù hợp, hãy thông báo lịch sự và hướng dẫn khách tự tìm thêm ở mục "Tour du lịch" hoặc liên hệ Hotline 1900 1234.
- Khi người dùng hỏi về đơn hàng của họ (hoặc "tôi đã đặt tour nào", "đơn hàng của tôi"), hãy gọi tool "get_user_info_and_bookings" để lấy thông tin. Tuyệt đối không bịa ra đơn hàng giả lập.
- Chỉ trả lời các câu hỏi liên quan đến du lịch, tour tuyến, dịch vụ hỗ trợ của Tripeasy. Từ chối trả lời lịch sự các câu hỏi không liên quan (như viết code, giải bài tập...).
- Dựa vào kết quả trả về từ các công cụ (tools) để đưa ra câu trả lời thuyết phục, trôi chảy nhất.
`
                }]
            }
        });

        // 5. Start Gemini Chat Session with history
        const chat = model.startChat({
            history: formattedHistory
        });

        // 6. Send the user message
        let result = await chat.sendMessage(message);
        let response = result.response;

        const recommendedTourIds = new Set();
        let bookingMetadata = null;
        let pdfMetadata = null;

        // 7. Loop handling function calls (if requested by Gemini)
        let loops = 0;
        const maxLoops = 5; // Prevent infinite loops
        let calls = response.functionCalls();
        while (calls && calls.length > 0 && loops < maxLoops) {
            loops++;
            const functionResponseParts = [];

            for (const call of calls) {
                const { name, args } = call;
                let functionResult;

                try {
                    if (name === 'search_tours_by_filters') {
                        const tours = await executeSearchToursByFilters(args);
                        tours.forEach(t => recommendedTourIds.add(t.tour_id));
                        functionResult = { tours };
                    } else if (name === 'search_tours_semantic') {
                        const tours = await executeSearchToursSemantic(args);
                        tours.forEach(t => recommendedTourIds.add(t.tour_id));
                        functionResult = { tours };
                    } else if (name === 'get_user_info_and_bookings') {
                        functionResult = await executeGetUserInfoAndBookings(userId);
                    } else if (name === 'create_chat_booking') {
                        const bookingResult = await executeCreateChatBooking(userId, args);
                        if (bookingResult.success) {
                            bookingMetadata = bookingResult;
                        }
                        functionResult = bookingResult;
                    } else if (name === 'generate_tour_itinerary_pdf') {
                        const pdfResult = await executeGenerateTourItineraryPDF(args);
                        if (pdfResult.success) {
                            pdfMetadata = pdfResult;
                        }
                        functionResult = pdfResult;
                    } else {
                        functionResult = { error: `Function ${name} not found` };
                    }
                } catch (err) {
                    console.error(`Error executing function ${name}:`, err);
                    functionResult = { error: err.message };
                }

                functionResponseParts.push({
                    functionResponse: {
                        name,
                        response: functionResult
                    }
                });
            }

            // Send function response back to Gemini
            result = await chat.sendMessage(functionResponseParts);
            response = result.response;
            calls = response.functionCalls();
        }

        const replyText = response.text();

        // 8. Fetch detailed tour objects for metadata if any tours or bookings were handled
        let metadata = null;
        if (recommendedTourIds.size > 0 || bookingMetadata || pdfMetadata) {
            metadata = {};
            if (recommendedTourIds.size > 0) {
                metadata.tours = await getMetadataTours(Array.from(recommendedTourIds));
            }
            if (bookingMetadata) {
                metadata.booking = bookingMetadata;
            }
            if (pdfMetadata) {
                metadata.pdf = pdfMetadata;
            }
        }

        // 9. Save bot response to database
        await pgPool.query(
            "INSERT INTO chat_messages (session_id, sender, content, metadata, created_at) VALUES ($1, 'model', $2, $3, NOW())",
            [resolvedSessionId, replyText, metadata ? JSON.stringify(metadata) : null]
        );

        return res.status(200).json({
            success: true,
            sessionId: resolvedSessionId,
            reply: replyText,
            metadata: metadata
        });

    } catch (error) {
        console.error('Error in handleChat:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi kết nối tới trợ lý ảo Gemini: ' + error.message
        });
    }
};
