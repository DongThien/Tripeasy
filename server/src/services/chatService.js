import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import { generateEmbedding, cosineSimilarity, getActiveApiKey, rotateApiKey, getApiKeys } from './geminiService.js';
import { getSetting } from './settingService.js';
import { createContactData } from './contactService.js';
import * as chatModel from '../models/chatModel.js';

export const formatMessageTime = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');

    return `${hours}:${minutes} - ${day}/${month}`;
};

export const getOrCreateSession = async (sessionId, userId) => {
    let finalSessionId = sessionId;

    if (userId) {
        if (finalSessionId) {
            const session = await chatModel.fetchSessionByIdRow(finalSessionId);
            if (session) {
                if (!session.user_id) {
                    await chatModel.updateSessionUserIdRow(finalSessionId, userId);
                } else if (session.user_id !== userId) {
                    const latestSession = await chatModel.fetchLatestSessionByUserIdRow(userId);
                    if (latestSession) {
                        finalSessionId = latestSession.session_id;
                    } else {
                        finalSessionId = crypto.randomUUID();
                        await chatModel.insertSessionRow(finalSessionId, userId);
                    }
                }
            } else {
                await chatModel.insertSessionRow(finalSessionId, userId);
            }
        } else {
            const latestSession = await chatModel.fetchLatestSessionByUserIdRow(userId);
            if (latestSession) {
                finalSessionId = latestSession.session_id;
            } else {
                finalSessionId = crypto.randomUUID();
                await chatModel.insertSessionRow(finalSessionId, userId);
            }
        }
    } else {
        if (finalSessionId) {
            const session = await chatModel.fetchSessionByIdRow(finalSessionId);
            if (!session) {
                await chatModel.insertSessionRow(finalSessionId, null);
            }
        } else {
            finalSessionId = crypto.randomUUID();
            await chatModel.insertSessionRow(finalSessionId, null);
        }
    }

    await chatModel.touchSessionRow(finalSessionId);

    return finalSessionId;
};

const executeSearchToursByFilters = async (args) => {
    const { price_adult_max, destination, duration, start_location } = args;

    let query = `
        SELECT t.tour_id, t.title, t.destination, t.duration, t.price_adult, t.price_child, t.old_price, t.transport, t.start_location, t.highlights
        FROM tours t
        WHERE t.availability = true
          AND EXISTS (
              SELECT 1 
              FROM tour_departures td 
              WHERE td.tour_id = t.tour_id 
                AND td.start_date >= NOW()::date 
                AND td.status = 'AVAILABLE' 
                AND td.stock > 0
          )
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

    const rows = await chatModel.fetchToursByFiltersRows(query, params);
    
    const toursWithDepartures = await Promise.all(rows.map(async r => {
        const departures = await chatModel.fetchOtherTourDeparturesForChatRows(r.tour_id);
        const formattedDepartures = departures.map(d => ({
            date: new Date(d.start_date).toISOString().split('T')[0],
            stock: d.stock
        }));
        return {
            tour_id: r.tour_id,
            title: r.title,
            destination: r.destination,
            duration: r.duration,
            price_adult: Number(r.price_adult),
            price_child: r.price_child ? Number(r.price_child) : null,
            old_price: r.old_price ? Number(r.old_price) : null,
            transport: r.transport,
            start_location: r.start_location,
            highlights: r.highlights,
            upcoming_departures: formattedDepartures
        };
    }));

    return toursWithDepartures;
};

const executeSearchToursSemantic = async (args) => {
    const { query } = args;
    if (!query) return [];

    const queryVector = await generateEmbedding(query);

    const tours = await chatModel.fetchAllToursForSemanticRow();

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
    const topTours = toursWithScores.slice(0, 3);

    const topToursWithDepartures = await Promise.all(topTours.map(async t => {
        const departures = await chatModel.fetchOtherTourDeparturesForChatRows(t.tour_id);
        const formattedDepartures = departures.map(d => ({
            date: new Date(d.start_date).toISOString().split('T')[0],
            stock: d.stock
        }));
        return {
            tour_id: t.tour_id,
            title: t.title,
            destination: t.destination,
            duration: t.duration,
            price_adult: t.price_adult,
            highlights: t.highlights,
            similarity: parseFloat(t.similarity.toFixed(4)),
            upcoming_departures: formattedDepartures
        };
    }));

    return topToursWithDepartures;
};

const executeGetUserInfoAndBookings = async (userId) => {
    if (!userId) {
        return {
            authenticated: false,
            message: "Người dùng chưa đăng nhập. Hãy lịch sự yêu cầu họ đăng nhập (nhấp vào biểu tượng Tài khoản ở góc trên bên phải trang web) để xem thông tin đặt tour của mình."
        };
    }

    const userData = await chatModel.fetchUserByIdRow(userId);

    if (!userData) {
        return { authenticated: false, message: "Không tìm thấy thông tin tài khoản." };
    }

    const bookings = await chatModel.fetchUserBookingsForChatRows(userId);

    return {
        authenticated: true,
        user: {
            username: userData.username,
            email: userData.email,
            fullname: userData.username,
            phone: userData.phone_number
        },
        bookings: bookings.map(b => ({
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
    const tour = await chatModel.fetchTourByIdForChatRow(tour_id);
    if (!tour) {
        return { success: false, message: "Tour này không tồn tại hoặc đã ngừng hoạt động." };
    }

    // 2. Tìm ngày khởi hành tương ứng
    const departure = await chatModel.fetchTourDepartureForChatRow(tour_id, start_date);

    if (!departure) {
        // Tìm các ngày khởi hành khác của tour này để gợi ý cho khách
        const otherDeps = await chatModel.fetchOtherTourDeparturesForChatRows(tour_id);
        const datesList = otherDeps.map(d => new Date(d.start_date).toLocaleDateString('vi-VN') + ` (còn ${d.stock} chỗ)`).join(', ');
        return {
            success: false,
            message: `Rất tiếc, ngày khởi hành ${new Date(start_date).toLocaleDateString('vi-VN')} không có sẵn. Tour này có các ngày khởi hành sắp tới: ${datesList || 'Chưa có lịch khởi hành mới'}. Hãy gợi ý khách chọn một trong các ngày này.`
        };
    }

    const seatsToBook = Number(num_adults) + Number(num_children);

    if (departure.stock < seatsToBook) {
        return {
            success: false,
            message: `Rất tiếc, ngày khởi hành ${new Date(start_date).toLocaleDateString('vi-VN')} chỉ còn ${departure.stock} chỗ trống, không đủ cho đoàn ${seatsToBook} khách.`
        };
    }

    // 3. Thực hiện đặt tour thông qua bookingService
    try {
        const { createBookingData } = await import('./bookingService.js');
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
        const booking = await chatModel.fetchBookingDetailForChatRow(bookingResult.booking_id);

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

const executeGenerateTourItineraryPDF = async (args) => {
    const { tour_id } = args;
    if (!tour_id) return { success: false, message: "Mã tour (tour_id) là bắt buộc." };

    const tour = await chatModel.fetchTourByIdSimpleRow(tour_id);

    if (!tour) {
        return { success: false, message: "Tour này không tồn tại hoặc đã ngừng hoạt động." };
    }

    const downloadUrl = `/api/tours/${tour_id}/pdf`;
    return {
        success: true,
        tour_id: Number(tour_id),
        tour_title: tour.title,
        download_url: downloadUrl,
        message: `Đã chuẩn bị xong file PDF lịch trình cho tour "${tour.title}". Hãy hướng dẫn khách nhấp vào nút tải PDF hiển thị bên dưới.`
    };
};

const executeGetOfficeLocation = async () => {
    const address = getSetting('general.address') || "Số 3 đường Cầu Giấy, phường Láng Thượng, quận Đống Đa, Hà Nội";
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    return {
        success: true,
        address,
        directions_url: directionsUrl,
        message: `Đã truy xuất địa chỉ văn phòng: "${address}". Hãy hướng dẫn khách hàng xem bản đồ hướng dẫn đường đi hiển thị bên dưới.`
    };
};

const getMetadataTours = async (tourIds) => {
    if (!tourIds || tourIds.length === 0) return [];
    const rows = await chatModel.fetchMetadataToursRows(tourIds);
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

export const getChatHistory = async (sessionId, userId) => {
    const resolvedSessionId = await getOrCreateSession(sessionId, userId);

    const messages = await chatModel.fetchMessagesBySessionIdRows(resolvedSessionId);

    return {
        sessionId: resolvedSessionId,
        messages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            text: msg.content,
            metadata: msg.metadata,
            time: formatMessageTime(msg.created_at)
        }))
    };
};

export const clearChatHistory = async (sessionId) => {
    await chatModel.deleteMessagesBySessionIdRow(sessionId);
};

const executeChatWithFallback = async (formattedHistory, message, userId, systemInstructionText, toolsConfig) => {
    const keys = getApiKeys();
    if (keys.length === 0) {
        throw new Error('Khóa API Google Gemini chưa được cấu hình trên Server. Vui lòng liên hệ Admin.');
    }

    let currentHistory = [...formattedHistory];
    let genAI;
    let model;
    let chat;
    const maxAttempts = keys.length;

    const initChat = () => {
        const apiKey = getActiveApiKey();
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            tools: toolsConfig,
            systemInstruction: {
                parts: [{ text: systemInstructionText }]
            }
        });
        chat = model.startChat({
            history: currentHistory
        });
    };

    initChat();

    const sendWithRetry = async (payload) => {
        let sendAttempts = 0;
        while (sendAttempts < maxAttempts) {
            try {
                const result = await chat.sendMessage(payload);
                currentHistory = await chat.getHistory();
                return result;
            } catch (error) {
                sendAttempts++;
                console.error(`[Gemini Error] Lỗi gửi tin nhắn chat với API key index ${sendAttempts - 1}:`, error.message || error);
                
                if (sendAttempts < maxAttempts) {
                    console.warn(`[Gemini Rotation] Tự động xoay vòng API key do gặp lỗi...`);
                    rotateApiKey();
                    initChat();
                } else {
                    throw new Error(`Tất cả các Gemini API keys đều thất bại khi chat. Lỗi cuối: ${error.message || error}`);
                }
            }
        }
    };

    // 1. Gửi tin nhắn ban đầu của user
    let result = await sendWithRetry(message);
    let response = result.response;

    const recommendedTourIds = new Set();
    let bookingMetadata = null;
    let pdfMetadata = null;
    let mapMetadata = null;

    // 2. Vòng lặp xử lý function calls (nếu Gemini yêu cầu)
    let loops = 0;
    const maxLoops = 5;
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
                } else if (name === 'submit_contact_message') {
                    const contactPayload = {
                        fullName: args.fullName,
                        phone: args.phone || '',
                        email: args.email,
                        subject: args.subject || 'Liên hệ từ Chatbot AI',
                        message: args.message
                    };
                    const contactResult = await createContactData(contactPayload);
                    functionResult = { success: true, message: "Đã gửi liên hệ hỗ trợ cho Admin thành công!", data: contactResult };
                } else if (name === 'get_office_location') {
                    const officeLocation = await executeGetOfficeLocation();
                    if (officeLocation.success) {
                        mapMetadata = officeLocation;
                    }
                    functionResult = officeLocation;
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

        // Gửi kết quả function call lại cho Gemini với retry
        result = await sendWithRetry(functionResponseParts);
        response = result.response;
        calls = response.functionCalls();
    }

    return {
        response,
        recommendedTourIds,
        bookingMetadata,
        pdfMetadata,
        mapMetadata
    };
};

export const processChat = async (message, sessionId, userId) => {
    const keys = getApiKeys();
    if (keys.length === 0) {
        throw new Error('Khóa API Google Gemini chưa được cấu hình trên Server. Vui lòng liên hệ Admin.');
    }

    // 1. Get or create the session
    const resolvedSessionId = await getOrCreateSession(sessionId, userId);

    // 2. Save user message to database
    await chatModel.insertMessageRow(resolvedSessionId, 'user', message, null);

    // 3. Load full message history from database
    const historyRows = await chatModel.fetchMessagesBySessionIdRows(resolvedSessionId);

    // Map to Gemini history format (excluding the very last message which will be passed to sendMessage)
    const formattedHistory = historyRows.slice(0, -1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const siteName = getSetting('general.siteName') || "Tripeasy";
    const hotline = getSetting('general.hotline') || "1900 1234";

    // Dynamic current date reference for Gemini
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const currentWeekday = weekdays[currentDate.getDay()];
    const dateStr = `${currentWeekday}, ngày ${currentDay} tháng ${currentMonth} năm ${currentYear}`;
    const isoDateStr = currentDate.toISOString().split('T')[0];

    const systemInstructionText = `
Bạn là ${siteName} Bot - Trợ lý ảo chuyên nghiệp, thông minh của nền tảng đặt tour du lịch ${siteName}.
Nhiệm vụ của bạn là:
1. Chào đón và tư vấn thông tin về du lịch, các địa danh nổi tiếng và các tour du lịch có sẵn.
2. Giới thiệu và đề xuất các dịch vụ tour có sẵn trên hệ thống của ${siteName} một cách thân thiện, lịch sự và tự nhiên.
3. Khi giới thiệu tour du lịch, hãy tóm tắt ngắn gọn các nét chính (tên tour, giá cả, thời gian, điểm xuất phát, các ngày khởi hành có sẵn và số chỗ còn lại tương ứng trong trường 'upcoming_departures') và dùng các tool được cung cấp để tìm kiếm thông tin thật chính xác từ CSDL. Chỉ giới thiệu các tour có lịch khởi hành cụ thể sắp tới và còn chỗ, tuyệt đối không gợi ý bâng quơ không kèm ngày khởi hành và số chỗ cụ thể.
4. Khi khách hàng bày tỏ ý muốn đặt tour:
   - Hãy gọi tool "get_user_info_and_bookings" để kiểm tra xem họ đã đăng nhập hay chưa.
   - Nếu họ chưa đăng nhập, hãy lịch sự đề nghị họ nhấp vào biểu tượng "Tài khoản" ở góc trên bên phải màn hình để đăng nhập trước khi tiến hành đặt tour qua chatbot.
   - Nếu họ đã đăng nhập, hãy hỏi và xác nhận các thông tin: Ngày khởi hành (start_date), số khách người lớn (num_adults), số khách trẻ em (num_children), và hình thức thanh toán (chuyển khoản VietQR hoặc tại văn phòng).
   - Sau khi khách hàng xác nhận các thông tin trên là chính xác, hãy gọi công cụ "create_chat_booking" để tạo đơn giữ chỗ trực tiếp cho khách hàng.
5. Khi khách hàng yêu cầu tải lịch trình, xin file lịch trình hoặc tải file PDF của một tour, hãy gọi công cụ "generate_tour_itinerary_pdf".
6. Khi khách hàng muốn gửi tin nhắn liên hệ, phản hồi, để lại lời nhắn hoặc gửi email yêu cầu tư vấn cho ban quản lý:
   - Hãy thu thập đủ thông tin: Họ và tên (fullName), Email (email), Số điện thoại (phone - không bắt buộc), và Nội dung phản hồi (message). Sau đó gọi công cụ "submit_contact_message".
7. Khi khách hàng hỏi địa chỉ văn phòng ở đâu, xin bản đồ chỉ đường, hoặc hỏi đường đi đến cơ sở của Tripeasy:
   - Gọi công cụ "get_office_location". Bạn chỉ cần giải thích địa chỉ văn phòng một cách thân thiện và hướng dẫn khách xem bản đồ IFrame cùng chỉ đường hiển thị ngay bên dưới tin nhắn.
8. Xưng hô thân thiện (xưng "${siteName} Bot" hoặc "mình" và gọi khách là "bạn", hoặc xưng hô theo tên nếu khách cung cấp hoặc khi gọi tool lấy được tên khách).

Lưu ý quan trọng:
- Khi dùng công cụ "generate_tour_itinerary_pdf", tuyệt đối KHÔNG tự tạo link markdown dạng [Tải PDF...] hay chèn đường dẫn URL "/api/tours/..." hoặc link "http://..." tải PDF vào tin nhắn phản hồi. Giao diện người dùng đã tự động hiển thị nút tải PDF màu đỏ ở dưới khung chat. Bạn chỉ cần trả lời lịch sự rằng file PDF lịch trình đã sẵn sàng và hướng dẫn họ nhấn vào nút tải bên dưới.
- Tuyệt đối KHÔNG tự bịa (hallucinate) ra thông tin giá cả, lịch trình tour nếu CSDL không trả về kết quả. Nếu không tìm thấy tour phù hợp, hãy thông báo lịch sự và hướng dẫn khách tự tìm thêm ở mục "Tour du lịch" hoặc liên hệ Hotline ${hotline}.
- Khi người dùng hỏi về đơn hàng của họ (hoặc "tôi đã đặt tour nào", "đơn hàng của tôi"), hãy gọi tool "get_user_info_and_bookings" để lấy thông tin. Tuyệt đối không bịa ra đơn hàng giả lập.
- Chỉ trả lời các câu hỏi liên quan đến du lịch, tour tuyến, dịch vụ hỗ trợ của ${siteName}. Từ chối trả lời lịch sự các câu hỏi không liên quan (như viết code, giải bài tập...).
- Dựa vào kết quả trả về từ các công cụ (tools) để đưa ra câu trả lời thuyết phục, trôi chảy nhất.

Lưu ý thời gian hệ thống hiện tại để đối chiếu ngày khởi hành khi khách đặt tour hoặc lọc tìm kiếm:
- Hôm nay là: ${dateStr} (Định dạng YYYY-MM-DD là ${isoDateStr}).
- Khi khách hàng nhắn thông tin ngày khởi hành dưới dạng viết tắt hoặc tương đối (ví dụ: "19/6", "ngày 19 tháng này", "ngày mai", "ngày kia", "thứ hai tuần sau"), bạn phải tự động dựa vào mốc thời gian hệ thống ở trên để tự suy luận tính toán chính xác ngày, tháng, năm cho tham số 'start_date' (định dạng YYYY-MM-DD) khi gọi công cụ 'create_chat_booking' hoặc bộ lọc của các công cụ tìm kiếm. Tuyệt đối không được hỏi lại người dùng để xin thông tin năm/tháng nếu đã đủ cơ sở tự suy luận.
  * Ví dụ: Nếu hôm nay là ngày 18 tháng 6 năm 2026. Khách nhắn "19/6" hoặc "19 tháng này" -> 'start_date' sẽ là "2026-06-19". Khách nhắn "ngày mai" -> 'start_date' là "2026-06-19". Khách nhắn "20/6" -> 'start_date' là "2026-06-20". Khách nhắn "ngày kia" -> 'start_date' là "2026-06-20".

`;

    const toolsConfig = [{
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
            },
            {
                name: 'submit_contact_message',
                description: 'Gửi phản hồi liên hệ, tin nhắn yêu cầu hỗ trợ hoặc tư vấn từ khách hàng tới ban quản trị và tự động gửi email thông báo cho Admin.',
                parameters: {
                    type: 'OBJECT',
                    properties: {
                        fullName: {
                            type: 'STRING',
                            description: 'Họ và tên đầy đủ của khách hàng, ví dụ: "Nguyễn Văn A"'
                        },
                        phone: {
                            type: 'STRING',
                            description: 'Số điện thoại liên hệ của khách hàng, ví dụ: "0912345678" (tùy chọn)'
                        },
                        email: {
                            type: 'STRING',
                            description: 'Địa chỉ Email của khách hàng để nhận phản hồi hỗ trợ, ví dụ: "customer@gmail.com"'
                        },
                        subject: {
                            type: 'STRING',
                            description: 'Chủ đề liên hệ hoặc yêu cầu hỗ trợ. Mặc định: "Liên hệ qua Chatbot AI".'
                        },
                        message: {
                            type: 'STRING',
                            description: 'Nội dung chi tiết lời nhắn, phản hồi hoặc yêu cầu của khách hàng.'
                        }
                    },
                    required: ['fullName', 'email', 'message']
                }
            },
            {
                name: 'get_office_location',
                description: 'Truy xuất địa chỉ văn phòng đại diện của Tripeasy và liên kết chỉ đường Google Maps.',
                parameters: {
                    type: 'OBJECT',
                    properties: {}
                }
            }
        ]
    }];

    // Gọi hàm trợ giúp có khả năng xoay vòng API keys khi gặp lỗi
    const chatResult = await executeChatWithFallback(
        formattedHistory,
        message,
        userId,
        systemInstructionText,
        toolsConfig
    );

    let replyText = chatResult.response.text();

    // Hậu xử lý để loại bỏ markdown thô / link tải PDF nếu có
    replyText = replyText.replace(/\[Tải PDF[^\]]*\]\(\/api\/tours\/\d+\/pdf\)/gi, '');
    replyText = replyText.replace(/Bạn chỉ cần nhấp vào link để tải về nhé\./gi, '');
    replyText = replyText.replace(/Hãy nhấp vào đường liên kết dưới đây để tải về/gi, '');
    replyText = replyText.replace(/\n{3,}/g, '\n\n').trim();

    // 8. Tải thông tin tour chi tiết cho phần metadata
    let metadata = null;
    if (chatResult.recommendedTourIds.size > 0 || chatResult.bookingMetadata || chatResult.pdfMetadata || chatResult.mapMetadata) {
        metadata = {};
        if (chatResult.recommendedTourIds.size > 0) {
            metadata.tours = await getMetadataTours(Array.from(chatResult.recommendedTourIds));
        }
        if (chatResult.bookingMetadata) {
            metadata.booking = chatResult.bookingMetadata;
        }
        if (chatResult.pdfMetadata) {
            metadata.pdf = chatResult.pdfMetadata;
        }
        if (chatResult.mapMetadata) {
            metadata.map = chatResult.mapMetadata;
        }
    }

    // 9. Lưu phản hồi của bot vào database
    await chatModel.insertMessageRow(resolvedSessionId, 'model', replyText, metadata);

    return {
        sessionId: resolvedSessionId,
        reply: replyText,
        metadata: metadata
    };
};
