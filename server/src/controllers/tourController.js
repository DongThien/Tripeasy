import { pgPool } from "../config/db.js";

// GET /api/tours - Lấy tất cả tours (không limit mặc định)
export const getAllTours = async (req, res) => {
    try {
        const { destination, region, title, limit, offset } = req.query;
        let baseQuery = `
            SELECT t.*,
                   (SELECT i.image_url FROM images i WHERE i.tour_id = t.tour_id ORDER BY i.upload_date ASC LIMIT 1) AS image_url
            FROM tours t
            WHERE 1=1`;
        const params = [];
        let idx = 1;

        if (region) {
            baseQuery += ` AND region = $${idx++}`;
            params.push(region);
        } else if (destination) {
            baseQuery += ` AND destination = $${idx++}`;
            params.push(destination);
        }
        if (title) {
            baseQuery += ` AND title ILIKE $${idx++}`;
            params.push(`%${title}%`);
        }

        baseQuery += ` ORDER BY created_at DESC`;

        // Chỉ thêm LIMIT/OFFSET nếu được yêu cầu
        if (limit) {
            baseQuery += ` LIMIT $${idx++}`;
            params.push(Number(limit));
            if (offset) {
                baseQuery += ` OFFSET $${idx++}`;
                params.push(Number(offset));
            }
        }

        const result = await pgPool.query(baseQuery, params);

        // Debug log cho terminal server
        console.log("Tour API hit, found:", result.rowCount);
        console.log("Query executed:", baseQuery);
        console.log("Params:", params);

        res.status(200).json({
            success: true,
            data: result.rows,
            message: "Lấy dữ liệu thành công"
        });

    } catch (err) {
        console.error("Error in getAllTours:", err);
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// POST /api/tours - Tạo tour mới (bao gồm upload ảnh)
export const createTour = async (req, res) => {
    const client = await pgPool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        const {
            title,
            destination,
            region,
            duration,
            max_guests, // Frontend gửi max_guests
            price_adult,
            price_child,
            description,
            itinerary
        } = req.body;

        // Debug: Log received data
        console.log('Received region:', region);
        console.log('All received data:', req.body);

        // Validation cơ bản
        if (!title || !destination || !price_adult) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                data: null,
                message: "Tên tour, điểm đến và giá người lớn là bắt buộc"
            });
        }

        // Parse itinerary từ JSON string
        let parsedItinerary;
        try {
            parsedItinerary = JSON.parse(itinerary);
        } catch (error) {
            parsedItinerary = itinerary; // Nếu đã là object thì giữ nguyên
        }

        // Parse and clean price fields for absolute safety
        const cleanPriceAdult = (price_adult || '').toString().replace(/\D/g, '');
        const cleanPriceChild = (price_child || '').toString().replace(/\D/g, '');
        const cleanMaxGuests = (max_guests || '').toString().replace(/\D/g, '');

        const adultPrice = parseInt(cleanPriceAdult, 10) || 0;
        const childPrice = parseInt(cleanPriceChild, 10) || 0;
        const guestQuantity = parseInt(cleanMaxGuests, 10) || 1;

        // Step 1: Insert vào bảng tours
        const insertTourQuery = `
            INSERT INTO tours (
                title, destination, region, duration, quantity, 
                price_adult, price_child, 
                description, itinerary, availability, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            RETURNING tour_id
        `;

        const tourValues = [
            title,
            destination,
            region || null,
            duration,
            guestQuantity,
            adultPrice,
            childPrice,
            description,
            JSON.stringify(parsedItinerary), // Lưu dạng JSONB
            true // availability default true
        ];

        const tourResult = await client.query(insertTourQuery, tourValues);
        const tourId = tourResult.rows[0].tour_id;

        // Step 2: Insert ảnh vào bảng images (nếu có)
        if (req.files && req.files.length > 0) {
            const imageInsertPromises = req.files.map(file => {
                const insertImageQuery = `
                    INSERT INTO images (tour_id, image_url, upload_date) 
                    VALUES ($1, $2, NOW())
                `;
                return client.query(insertImageQuery, [tourId, file.path]);
            });

            await Promise.all(imageInsertPromises);
        }

        // Commit transaction
        await client.query('COMMIT');

        console.log(`Tour created successfully with ID: ${tourId}, Images: ${req.files?.length || 0}`);

        res.status(201).json({
            success: true,
            data: {
                tour_id: tourId,
                images_count: req.files?.length || 0
            },
            message: "Tour được tạo thành công"
        });

    } catch (err) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error("Error in createTour:", err);

        res.status(500).json({
            success: false,
            data: null,
            message: "Lỗi server khi tạo tour: " + err.message
        });
    } finally {
        client.release();
    }
};

// GET /api/tours/:id - Lấy chi tiết tour theo ID
export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;

        // Query tour với images
        const tourQuery = `
            SELECT t.*, 
                   ARRAY_AGG(i.image_url) FILTER (WHERE i.image_url IS NOT NULL) as images
            FROM tours t
            LEFT JOIN images i ON t.tour_id = i.tour_id
            WHERE t.tour_id = $1
            GROUP BY t.tour_id
        `;

        const result = await pgPool.query(tourQuery, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Tour không tồn tại"
            });
        }

        console.log(`Tour ${id} retrieved successfully`);

        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: "Lấy chi tiết tour thành công"
        });

    } catch (err) {
        console.error("Error in getTourById:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Lỗi server: " + err.message
        });
    }
};

// PUT /api/tours/:id
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, quantity, price_adult, price_child,
            duration, destination, region,
            availability, itinerary
        } = req.body;

        const updateQuery = `
            UPDATE tours
            SET title=$1, description=$2, quantity=$3,
                price_adult=$4, price_child=$5, duration=$6,
                destination=$7, region=$8,
                availability=$9, itinerary=$10
            WHERE tour_id=$11
            RETURNING *`;

        const values = [
            title, description,
            Math.abs(parseInt(quantity, 10) || 0),
            Math.abs(Math.round(parseFloat(price_adult) || 0)),
            Math.abs(Math.round(parseFloat(price_child) || 0)),
            duration,
            destination, region || null,
            availability, itinerary,
            id
        ];

        const { rows } = await pgPool.query(updateQuery, values);
        if (rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "Tour not found" });
        res.json({ success: true, data: rows[0], message: "Tour updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// DELETE /api/tours/:id
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        // Xóa cứng, nếu muốn xóa mềm thì update trường is_deleted
        const deleteQuery = "DELETE FROM tours WHERE tour_id = $1 RETURNING *";
        const { rows } = await pgPool.query(deleteQuery, [id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "Tour not found" });
        res.json({ success: true, data: rows[0], message: "Tour deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};