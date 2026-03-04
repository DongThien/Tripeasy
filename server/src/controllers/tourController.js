import { pgPool } from "../config/db.js";

// GET /api/tours - Lấy tất cả tours (không limit mặc định)
export const getAllTours = async (req, res) => {
    try {
        const { destination, title, limit, offset } = req.query;
        let baseQuery = "SELECT * FROM tours WHERE 1=1";
        const params = [];
        let idx = 1;

        if (destination) {
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

// GET /api/tours/:id
export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        const tourQuery = "SELECT * FROM tours WHERE tour_id = $1";
        const imageQuery = "SELECT image_url FROM images WHERE tour_id = $1";
        const tourResult = await pgPool.query(tourQuery, [id]);
        if (tourResult.rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "Tour not found" });

        const imagesResult = await pgPool.query(imageQuery, [id]);
        const tour = tourResult.rows[0];
        tour.images = imagesResult.rows.map(img => img.image_url);

        res.json({ success: true, data: tour, message: "Fetched tour detail" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// POST /api/tours
export const createTour = async (req, res) => {
    try {
        const { title, description, quantity, price_adult, price_child, duration, destination, availability, itinerary } = req.body;
        const insertQuery = `
            INSERT INTO tours (title, description, quantity, price_adult, price_child, duration, destination, availability, itinerary)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
        const { rows } = await pgPool.query(insertQuery, [title, description, quantity, price_adult, price_child, duration, destination, availability, itinerary]);
        res.status(201).json({ success: true, data: rows[0], message: "Tour created successfully" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// PUT /api/tours/:id
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, quantity, price_adult, price_child, duration, destination, availability, itinerary } = req.body;
        const updateQuery = `
            UPDATE tours SET title=$1, description=$2, quantity=$3, price_adult=$4, price_child=$5, duration=$6, destination=$7, availability=$8, itinerary=$9
            WHERE tour_id=$10 RETURNING *`;
        const { rows } = await pgPool.query(updateQuery, [title, description, quantity, price_adult, price_child, duration, destination, availability, itinerary, id]);
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