import jwt from "jsonwebtoken";

// 1. Kiểm tra trạng thái đăng nhập (Xác thực chung)
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập hoặc thiếu Token xác thực!" });
    }

    const token = authHeader.split(" ")[1];
    try {
        // Đọc mã khóa bí mật từ file .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Gắn dữ liệu { id, role } vào request để dùng ở các tầng tiếp theo
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Phiên đăng nhập đã hết hạn hoặc Token không hợp lệ!" });
    }
};

// 2. Kiểm tra quyền Quản trị viên (Admin Area Authorization)
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ success: false, message: "Từ chối truy cập! Khu vực này chỉ dành cho Admin." });
        }
    });
};