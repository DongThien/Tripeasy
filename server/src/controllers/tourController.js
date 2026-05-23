import xlsx from "xlsx";
import { pgPool } from "../config/db.js";
import { insertTourRow } from "../models/tourModel.js";
import {
    getAllToursData,
    createTourData,
    getTourByIdData,
    getTourImagesData,
    updateTourData,
    deleteTourData,
    uploadTourImagesData,
    deleteTourImageData,
    getTourReviewsData // IMPORT THÊM HÀM NÀY
} from "../services/tourService.js";

// GET /api/tours - Lấy tất cả tours (không limit mặc định)
export const getAllTours = async (req, res) => {
    try {
        const data = await getAllToursData(req.query);
        res.status(200).json({
            success: true,
            data,
            message: "Lấy dữ liệu thành công"
        });

    } catch (err) {
        console.error("Error in getAllTours:", err);
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// POST /api/tours - Tạo tour mới
export const createTour = async (req, res) => {
    try {
        const data = await createTourData(req.body);
        res.status(201).json({
            success: true,
            data,
            message: "Tour được tạo thành công. Ảnh sẽ được upload ở background."
        });

    } catch (err) {
        console.error("Error in createTour:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: "Lỗi server khi tạo tour: " + err.message
        });
    }
};

// GET /api/tours/:id - Lấy chi tiết tour theo ID
export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTourByIdData(id);
        res.status(200).json({
            success: true,
            data,
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

// GET /api/tours/:id/images - Lấy danh sách ảnh của tour
export const getTourImages = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTourImagesData(id);
        res.status(200).json({
            success: true,
            data,
            message: "Lấy danh sách ảnh thành công"
        });
    } catch (err) {
        console.error("Error in getTourImages:", err);
        res.status(err.statusCode || 500).json({
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
        const data = await updateTourData(id, req.body);
        res.json({ success: true, data, message: "Tour updated successfully" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// DELETE /api/tours/:id
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await deleteTourData(id);
        res.json({ success: true, data, message: "Tour deleted successfully" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// POST /api/tours/:id/images - Upload ảnh riêng 
export const uploadTourImages = async (req, res) => {
    try {
        const { id: tourId } = req.params;
        const data = await uploadTourImagesData(tourId, req.files);
        res.status(201).json({
            success: true,
            data,
            message: `Đã upload thành công ${data.images_count} ảnh`
        });

    } catch (err) {
        console.error("Error in uploadTourImages:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: "Lỗi server khi upload ảnh: " + err.message
        });
    }
};

// DELETE /api/tours/:id/images - Xóa ảnh theo URL
export const deleteTourImage = async (req, res) => {
    try {
        const { id: tourId } = req.params;
        const { image_url: imageUrl } = req.body || {};
        const data = await deleteTourImageData(tourId, imageUrl);
        res.status(200).json({
            success: true,
            data,
            message: "Đã xóa ảnh thành công"
        });
    } catch (err) {
        console.error("Error in deleteTourImage:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            data: null,
            message: "Lỗi server khi xóa ảnh: " + err.message
        });
    }
};

// THÊM HÀM NÀY: GET /api/tours/:id/reviews - Lấy danh sách đánh giá của tour
export const getTourReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getTourReviewsData(id);
        res.status(200).json({
            success: true,
            data,
            message: "Lấy danh sách đánh giá thành công"
        });

    } catch (err) {
        console.error("Error in getTourReviews:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Lỗi server: " + err.message
        });
    }
};

// POST /api/tours/import - Import tour tu file Excel
export const importToursFromExcel = async (req, res) => {
    const client = await pgPool.connect();

    const parseArray = (text) => {
        if (!text) return [];
        try {
            if (typeof text === "string" && text.trim().startsWith("[")) {
                const parsed = JSON.parse(text);
                return Array.isArray(parsed)
                    ? parsed.map((v) => String(v).trim()).filter(Boolean)
                    : [];
            }
        } catch {
            // Fallback to split by lines
        }

        return String(text)
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
    };

    const parseHighlightsText = (text) => {
        if (!text) return [];
        try {
            if (typeof text === "string" && text.trim().startsWith("[")) {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    return parsed
                        .map((item) => ({
                            title: String(item.title || "").trim(),
                            desc: String(item.desc || "").trim()
                        }))
                        .filter((item) => item.title || item.desc);
                }
            }
        } catch {
            // Fallback to manual parse
        }

        return String(text)
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const idx = line.indexOf(":");
                if (idx !== -1) {
                    const title = line.slice(0, idx).trim();
                    const desc = line.slice(idx + 1).trim();
                    return { title: title || "Noi bat", desc };
                }
                return { title: "Noi bat", desc: line };
            });
    };

    const parseItineraryText = (text) => {
        if (!text) return [];
        try {
            if (typeof text === "string" && text.trim().startsWith("[")) {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    return parsed
                        .map((item) => ({
                            day: Number(item.day) || 1,
                            title: String(item.title || "").trim(),
                            content: String(item.content || "").trim()
                        }))
                        .filter((item) => item.title || item.content);
                }
            }
        } catch {
            // Fallback to manual parse
        }

        const raw = String(text);
        const parts = raw
            .split(/(?=(Ngay|Ngày)\s*\d+)/i)
            .map((p) => p.trim())
            .filter((p) => p && !/^(Ngay|Ngày)$/i.test(p));
        const result = [];

        for (const part of parts) {
            const lines = part.split("\n").map((l) => l.trim()).filter(Boolean);
            if (lines.length === 0) continue;

            const firstLine = lines[0];
            const match = firstLine.match(/(?:Ngay|Ngày)\s*(\d+)/i);
            const day = match ? Number(match[1]) : result.length + 1;
            const title = match
                ? firstLine.replace(/^(Ngay|Ngày)\s*\d+\s*[:\-]?\s*/i, "").trim()
                : firstLine.trim();
            const content = lines.slice(1).join("\n").trim();

            result.push({ day, title, content });
        }

        return result;
    };

    const toNumber = (value) => {
        if (value === null || value === undefined || value === "") return 0;
        const cleaned = String(value).replace(/,/g, "").trim();
        const num = Number(cleaned);
        return Number.isFinite(num) ? num : 0;
    };

    const toString = (value) => {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    };

    const normalizeText = (value) => {
        return toString(value)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                success: false,
                message: "Khong tim thay file Excel"
            });
        }

        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        await client.query("BEGIN");

        let importedCount = 0;

        for (const row of rows) {
            const availabilityText = normalizeText(row["Trạng thái"]);
            const availability = availabilityText === "co" || availabilityText === "yes";

            const tourValues = [
                toString(row["Tên Tour"]),
                toString(row["Điểm đến"]),
                toString(row["Vùng miền"]),
                toString(row["Thời gian"]),
                toNumber(row["Số chỗ"]),
                toNumber(row["Giá Người Lớn"]),
                toNumber(row["Giá Trẻ Em"]),
                toNumber(row["Giá Cũ"]),
                JSON.stringify(parseItineraryText(row["Lịch trình"])),
                JSON.stringify(parseHighlightsText(row["Điểm nhấn"])),
                JSON.stringify(parseArray(row["Bao gồm"])),
                JSON.stringify(parseArray(row["Không bao gồm"])),
                toString(row["Nơi khởi hành"]),
                toString(row["Phương tiện"]),
                toString(row["Loại hình"]),
                JSON.stringify(parseArray(row["Chính sách trẻ em"])),
                JSON.stringify(parseArray(row["Chính sách hủy"])),
                JSON.stringify(parseArray(row["Chính sách khác"])),
                availability
            ];

            await insertTourRow(client, tourValues);
            importedCount += 1;
        }

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Import tour thanh cong",
            imported: importedCount
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error in importToursFromExcel:", err);
        return res.status(500).json({
            success: false,
            message: "Loi server khi import tour: " + err.message
        });
    } finally {
        client.release();
    }
};