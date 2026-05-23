import { pgPool } from "../config/db.js";

export const insertContactRow = async ({
    fullName,
    phone,
    email,
    subject,
    message
}) => {
    const insertQuery = `
        INSERT INTO contacts (full_name, phone_number, email, subject, message)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const { rows } = await pgPool.query(insertQuery, [
        fullName,
        phone,
        email,
        subject,
        message
    ]);
    return rows[0];
};

export const fetchAllContactsRows = async (searchParam, statusParam) => {
    const params = [];
    let query = `
        SELECT * FROM contacts
        WHERE 1=1
    `;

    if (searchParam) {
        params.push(`%${searchParam}%`);
        const pIndex = params.length;
        query += ` AND (full_name ILIKE $${pIndex} OR email ILIKE $${pIndex} OR phone_number ILIKE $${pIndex} OR subject ILIKE $${pIndex})`;
    }

    if (statusParam) {
        if (statusParam === 'PENDING') {
            query += ` AND (status = 'PENDING' OR status = 'NEW')`;
        } else {
            params.push(statusParam);
            const pIndex = params.length;
            query += ` AND status = $${pIndex}`;
        }
    }

    query += " ORDER BY created_at DESC";

    const { rows } = await pgPool.query(query, params);
    return rows;
};

export const updateContactStatusRow = async (contactId, status) => {
    const updateQuery = `
        UPDATE contacts
        SET status = $1
        WHERE contact_id = $2
        RETURNING *
    `;
    const { rows } = await pgPool.query(updateQuery, [status, contactId]);
    return rows[0];
};

export const deleteContactRow = async (contactId) => {
    const deleteQuery = "DELETE FROM contacts WHERE contact_id = $1 RETURNING *";
    const { rows } = await pgPool.query(deleteQuery, [contactId]);
    return rows[0];
};

export const updateContactReplyRow = async (contactId, replyMessage) => {
    const updateQuery = `
        UPDATE contacts
        SET reply_message = $1, status = 'RESOLVED'
        WHERE contact_id = $2
        RETURNING *
    `;
    const { rows } = await pgPool.query(updateQuery, [replyMessage, contactId]);
    return rows[0];
};

export const fetchContactByIdRow = async (contactId) => {
    const { rows } = await pgPool.query("SELECT * FROM contacts WHERE contact_id = $1", [contactId]);
    return rows[0];
};
