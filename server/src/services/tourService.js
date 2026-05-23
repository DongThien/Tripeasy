import { pgPool } from "../config/db.js";
import {
    fetchAllToursRows,
    insertTourRow,
    fetchTourWithImagesRow,
    updateTourRow,
    deleteTourRow,
    fetchTourIdRow,
    fetchTourImagesRows,
    insertTourImageRow,
    deleteTourImageRow,
    insertTourDeparturesRow,
    deleteTourDeparturesRow
} from "../models/tourModel.js";
import { fetchReviewsByTourIdRow } from "../models/reviewModel.js";

// Helper dùng chung để parse JSON
const parseJSON = (field) => {
    if (typeof field === 'string') {
        try { return JSON.parse(field); } catch (e) { return field; }
    }
    return field || null;
};

// ĐÃ FIX LỖI: Không dùng \D nữa vì nó sẽ xóa mất dấu chấm (.) của số thập phân (VD: .00)
const cleanNum = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    // Xóa dấu phẩy (,) và khoảng trắng nếu có, giữ lại dấu thập phân (.)
    const cleanStr = val.toString().replace(/,/g, '').replace(/\s/g, '');
    return Math.round(parseFloat(cleanStr)) || 0;
};

export const getAllToursData = async (query) => {
    const { destination, region, title, limit, offset } = query;
    const result = await fetchAllToursRows({ destination, region, title, limit, offset });
    return result.rows;
};

export const createTourData = async (payload) => {
    const client = await pgPool.connect();

    try {
        await client.query("BEGIN");
        const {
            title, destination, region, duration, max_guests,
            price_adult, price_child, old_price,
            itinerary, highlights, included, excluded,
            start_location, transport, category,
            policy_child, policy_cancel, policy_other,
            departures
        } = payload;

        if (!title || !destination || !price_adult) {
            const error = new Error("Tên tour, điểm đến và giá người lớn là bắt buộc");
            error.statusCode = 400;
            throw error;
        }

        const parsedDepartures = parseJSON(departures) || [];

        const tourValues = [
            title, destination, region || null, duration,
            cleanNum(max_guests) || 1,
            cleanNum(price_adult), cleanNum(price_child), cleanNum(old_price) || null,
            JSON.stringify(parseJSON(itinerary)),
            JSON.stringify(parseJSON(highlights)),
            JSON.stringify(parseJSON(included)),
            JSON.stringify(parseJSON(excluded)),
            start_location || null, transport || null, category || null,
            JSON.stringify(parseJSON(policy_child)),
            JSON.stringify(parseJSON(policy_cancel)),
            JSON.stringify(parseJSON(policy_other)),
            true
        ];

        // 1. Lưu Tour
        const tourRow = await insertTourRow(client, tourValues);

        // 2. Lưu Lịch khởi hành
        if (parsedDepartures.length > 0) {
            await insertTourDeparturesRow(client, tourRow.tour_id, parsedDepartures);
        }

        await client.query("COMMIT");
        return { tour_id: tourRow.tour_id, images_count: 0 };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const getTourByIdData = async (tourId) => {
    const row = await fetchTourWithImagesRow(tourId);
    if (!row) {
        const error = new Error("Tour không tồn tại");
        error.statusCode = 404;
        throw error;
    }
    return row;
};

export const getTourImagesData = async (tourId) => {
    const tourRow = await fetchTourIdRow(tourId);
    if (!tourRow) {
        const error = new Error("Tour không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    const rows = await fetchTourImagesRows(tourId);
    return rows.map((row) => row.image_url).filter(Boolean);
};

export const updateTourData = async (tourId, payload) => {
    const client = await pgPool.connect();
    try {
        await client.query("BEGIN");

        const {
            title, destination, region, duration, max_guests,
            price_adult, price_child, old_price,
            itinerary, highlights, included, excluded,
            start_location, transport, category,
            policy_child, policy_cancel, policy_other,
            departures, availability
        } = payload;

        const parsedDepartures = parseJSON(departures) || [];

        const tourValues = [
            title, destination, region || null, duration,
            cleanNum(max_guests) || 1,
            cleanNum(price_adult), cleanNum(price_child), cleanNum(old_price) || null,
            JSON.stringify(parseJSON(itinerary)),
            JSON.stringify(parseJSON(highlights)),
            JSON.stringify(parseJSON(included)),
            JSON.stringify(parseJSON(excluded)),
            start_location || null, transport || null, category || null,
            JSON.stringify(parseJSON(policy_child)),
            JSON.stringify(parseJSON(policy_cancel)),
            JSON.stringify(parseJSON(policy_other)),
            availability !== undefined ? availability : true
        ];

        const updatedRow = await updateTourRow(client, tourId, tourValues);
        if (!updatedRow) {
            throw Object.assign(new Error("Tour không tồn tại"), { statusCode: 404 });
        }

        await deleteTourDeparturesRow(client, tourId);
        if (parsedDepartures.length > 0) {
            await insertTourDeparturesRow(client, tourId, parsedDepartures);
        }

        await client.query("COMMIT");
        return await getTourByIdData(tourId);

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const deleteTourData = async (tourId) => {
    const { rows } = await pgPool.query(
        "SELECT COUNT(*)::int AS booking_count FROM bookings WHERE tour_id = $1",
        [tourId]
    );
    const bookingCount = rows[0]?.booking_count || 0;
    if (bookingCount > 0) {
        const error = new Error("Tour đã phát sinh booking, không thể xóa");
        error.statusCode = 409;
        throw error;
    }

    const row = await deleteTourRow(tourId);
    if (!row) {
        const error = new Error("Tour not found");
        error.statusCode = 404;
        throw error;
    }
    return row;
};

export const uploadTourImagesData = async (tourId, files) => {
    const tourRow = await fetchTourIdRow(tourId);
    if (!tourRow) {
        const error = new Error("Tour không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    if (!files || files.length === 0) {
        const error = new Error("Không có ảnh được gửi");
        error.statusCode = 400;
        throw error;
    }

    const imageInsertPromises = files.map(file => insertTourImageRow(tourId, file.path));
    await Promise.all(imageInsertPromises);

    return { tour_id: tourId, images_count: files.length };
};

export const deleteTourImageData = async (tourId, imageUrl) => {
    if (!imageUrl) {
        const error = new Error("Thiếu đường dẫn ảnh để xóa");
        error.statusCode = 400;
        throw error;
    }

    const deletedRow = await deleteTourImageRow(tourId, imageUrl);
    if (!deletedRow) {
        const error = new Error("Ảnh không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    return deletedRow;
};

export const getTourReviewsData = async (tourId) => {
    // Gọi hàm từ reviewModel.js
    const rows = await fetchReviewsByTourIdRow(tourId);
    return rows;
};