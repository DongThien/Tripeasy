import { pgPool } from "../config/db.js";

export const fetchAllToursRows = async ({ destination, region, title, limit, offset }) => {
    let baseQuery = `
        SELECT t.tour_id, t.title, t.price_adult, t.price_child, t.duration, t.destination, t.availability, t.itinerary, t.created_at, t.region, t.start_location, t.transport, t.old_price, t.highlights, t.included, t.excluded, t.category, t.rating_avg, t.review_count, t.policy_child, t.policy_cancel, t.policy_other, t.embedding,
               COALESCE((SELECT SUM(stock) FROM tour_departures WHERE tour_id = t.tour_id), 0)::int AS quantity,
               (SELECT i.image_url FROM images i WHERE i.tour_id = t.tour_id ORDER BY i.upload_date ASC LIMIT 1) AS image_url,
               (SELECT COALESCE(JSON_AGG(
                   JSON_BUILD_OBJECT(
                       'departure_id', d.departure_id, 
                       'start_date', d.start_date, 
                       'end_date', d.end_date, 
                       'stock', d.stock, 
                       'status', d.status
                   ) ORDER BY d.start_date ASC
               ), '[]'::json) FROM tour_departures d WHERE d.tour_id = t.tour_id) AS departures
        FROM tours t
        WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (region && region !== 'Tất cả') {
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

    baseQuery += " ORDER BY created_at DESC";

    if (limit) {
        baseQuery += ` LIMIT $${idx++}`;
        params.push(Number(limit));
        if (offset) {
            baseQuery += ` OFFSET $${idx++}`;
            params.push(Number(offset));
        }
    }

    const result = await pgPool.query(baseQuery, params);
    return { rows: result.rows, rowCount: result.rowCount, query: baseQuery, params };
};

export const insertTourRow = async (client, tourValues) => {
    const insertTourQuery = `
        INSERT INTO tours (
            title, destination, region, duration, quantity, 
            price_adult, price_child, old_price,
            itinerary, highlights, included, excluded,
            start_location, transport, category, 
            policy_child, policy_cancel, policy_other,
            availability, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
        RETURNING tour_id
    `;
    const { rows } = await client.query(insertTourQuery, tourValues);
    return rows[0];
};

export const insertTourDeparturesRow = async (client, tourId, departures) => {
    if (!departures || departures.length === 0) return;

    const values = [];
    let placeholders = [];
    let paramIndex = 1;

    departures.forEach(dep => {
        placeholders.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        values.push(tourId, dep.start_date, dep.end_date, dep.stock || 20, dep.status || 'AVAILABLE');
    });

    const query = `
        INSERT INTO tour_departures (tour_id, start_date, end_date, stock, status)
        VALUES ${placeholders.join(', ')}
    `;

    await client.query(query, values);
};

export const fetchTourWithImagesRow = async (tourId) => {
    const tourQuery = `
        SELECT t.tour_id, t.title, t.price_adult, t.price_child, t.duration, t.destination, t.availability, t.itinerary, t.created_at, t.region, t.start_location, t.transport, t.old_price, t.highlights, t.included, t.excluded, t.category, t.rating_avg, t.review_count, t.policy_child, t.policy_cancel, t.policy_other, t.embedding,
            COALESCE((SELECT SUM(stock) FROM tour_departures WHERE tour_id = t.tour_id), 0)::int AS quantity,
            (SELECT ARRAY_AGG(i.image_url) FROM images i WHERE i.tour_id = t.tour_id) AS images,
            (SELECT COALESCE(JSON_AGG(
                JSON_BUILD_OBJECT(
                    'departure_id', d.departure_id, 
                    'start_date', d.start_date, 
                    'end_date', d.end_date, 
                    'stock', d.stock, 
                    'status', d.status
                ) ORDER BY d.start_date ASC
            ), '[]'::json) FROM tour_departures d WHERE d.tour_id = t.tour_id) AS departures
        FROM tours t
        WHERE t.tour_id = $1
    `;

    const { rows } = await pgPool.query(tourQuery, [tourId]);
    return rows[0];
};

export const updateTourRow = async (client, tourId, values) => {
    const updateQuery = `
        UPDATE tours
        SET title=$1, destination=$2, region=$3, duration=$4, quantity=$5,
            price_adult=$6, price_child=$7, old_price=$8,
            itinerary=$9, highlights=$10, included=$11, excluded=$12,
            start_location=$13, transport=$14, category=$15,
            policy_child=$16, policy_cancel=$17, policy_other=$18,
            availability=$19
        WHERE tour_id=$20
        RETURNING *
    `;
    const { rows } = await client.query(updateQuery, [...values, tourId]);
    return rows[0];
};

export const deleteTourRow = async (tourId) => {
    const deleteQuery = "DELETE FROM tours WHERE tour_id = $1 RETURNING *";
    const { rows } = await pgPool.query(deleteQuery, [tourId]);
    return rows[0];
};

export const fetchTourIdRow = async (tourId) => {
    const { rows } = await pgPool.query("SELECT tour_id FROM tours WHERE tour_id = $1", [tourId]);
    return rows[0];
};

export const fetchTourImagesRows = async (tourId) => {
    const { rows } = await pgPool.query(
        "SELECT image_url FROM images WHERE tour_id = $1 ORDER BY upload_date ASC",
        [tourId]
    );
    return rows;
};

export const insertTourImageRow = async (tourId, imageUrl) => {
    const insertImageQuery = `
        INSERT INTO images (tour_id, image_url, upload_date) 
        VALUES ($1, $2, NOW())
    `;
    await pgPool.query(insertImageQuery, [tourId, imageUrl]);
};

export const deleteTourImageRow = async (tourId, imageUrl) => {
    const deleteQuery = "DELETE FROM images WHERE tour_id = $1 AND image_url = $2 RETURNING *";
    const { rows } = await pgPool.query(deleteQuery, [tourId, imageUrl]);
    return rows[0];
};

export const deleteTourDeparturesRow = async (client, tourId) => {
    await client.query("DELETE FROM tour_departures WHERE tour_id = $1", [tourId]);
};