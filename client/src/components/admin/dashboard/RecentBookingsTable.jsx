import React from "react";



function formatDateVN(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getStatusStyle(status) {
    switch ((status || "").toUpperCase()) {
        case "COMPLETED":
            return "bg-green-100 text-green-700";
        case "FAILED":
            return "bg-red-100 text-red-700";
        case "PENDING":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-gray-100 text-gray-500";
    }
}

const RecentBookingsTable = ({ bookings = [], formatVND }) => {
    const handlePrintRecentBookings = () => {
        if (!bookings || bookings.length === 0) {
            alert("Không có dữ liệu đơn hàng gần đây để in!");
            return;
        }

        const printWindow = window.open('', '_blank', 'width=1100,height=850');
        if (!printWindow) {
            alert("Trình duyệt chặn mở cửa sổ mới! Vui lòng cho phép pop-up.");
            return;
        }
        
        let rowsHtml = '';
        bookings.forEach((bk, index) => {
            rowsHtml += `
                <tr>
                    <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${index + 1}</td>
                    <td style="font-weight: bold; color: #8B1A1A; padding: 10px; border: 1px solid #ddd;">#BK-${bk.id || bk.booking_id}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <strong>${bk.customer?.name || bk.customer_name || ''}</strong>
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${bk.tour || bk.tour_name || ''}</td>
                    <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${formatDateVN(bk.date || bk.created_at)}</td>
                    <td style="text-align: right; font-weight: bold; color: #8B1A1A; padding: 10px; border: 1px solid #ddd;">${formatVND(bk.amount || bk.total_price || 0)}</td>
                    <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${(bk.status || '').toUpperCase() === 'PAID' || (bk.status || '').toUpperCase() === 'COMPLETED' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                </tr>
            `;
        });

        const printHtml = `
            <html>
            <head>
                <title>Báo Cáo Đặt Tour Gần Đây - Tripeasy</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #333; }
                    .header { border-bottom: 2px solid #8B1A1A; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .logo { font-size: 24px; font-weight: 800; color: #8B1A1A; letter-spacing: 0.5px; }
                    .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #111; margin-bottom: 5px; }
                    .meta-info { font-size: 12px; color: #666; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th { background-color: #f7f7f7; border: 1px solid #ddd; padding: 10px; font-size: 12px; font-weight: bold; color: #444; }
                    td { border: 1px solid #ddd; padding: 10px; font-size: 12px; color: #333; }
                    tr:nth-child(even) { background-color: #fafafa; }
                    .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #888; }
                    @media print {
                        body { padding: 10px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="text-align: right; margin-bottom: 15px;">
                    <button onclick="window.print()" style="background: #8B1A1A; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">In báo cáo (Print)</button>
                </div>
                <div class="header">
                    <div>
                        <div class="title">Báo Cáo Đặt Tour Gần Đây</div>
                        <div class="meta-info">Số lượng đơn hàng: <strong>${bookings.length}</strong> &nbsp;|&nbsp; Ngày lập báo cáo: <strong>${new Date().toLocaleDateString('vi-VN')}</strong></div>
                    </div>
                    <div class="logo">TRIPEASY</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px; padding: 10px; border: 1px solid #ddd;">STT</th>
                            <th style="width: 80px; padding: 10px; border: 1px solid #ddd;">Mã Đơn</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Khách Hàng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Tour Du Lịch</th>
                            <th style="width: 150px; padding: 10px; border: 1px solid #ddd;">Thời Gian Đặt</th>
                            <th style="width: 120px; text-align: right; padding: 10px; border: 1px solid #ddd;">Tổng Tiền</th>
                            <th style="width: 120px; padding: 10px; border: 1px solid #ddd;">Thanh Toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div class="footer">
                    Người lập báo cáo: Ban Quản trị Tripeasy
                </div>
                <script>
                    window.onload = () => {
                        setTimeout(() => { window.print(); }, 300);
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(printHtml);
        printWindow.document.close();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-gray-900">Recent Bookings</div>
                <button 
                    onClick={handlePrintRecentBookings}
                    className="bg-[#8B1A1A] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83232] transition"
                >
                    Download Report
                </button>
            </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-400 uppercase">
                        <th className="py-3 px-3 text-left">Booking ID</th>
                        <th className="py-3 px-3 text-left">Customer Name</th>
                        <th className="py-3 px-3 text-left">Tour Destination</th>
                        <th className="py-3 px-3 text-left">Date</th>
                        <th className="py-3 px-3 text-right">Amount</th>
                        <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b, idx) => (
                        <tr key={b.id || b.booking_id} className={"border-t last:border-b" + (idx % 2 === 1 ? " bg-gray-50" : "")}>
                            <td className="py-3 px-3 whitespace-nowrap">{b.id || b.booking_id}</td>
                            <td className="py-3 px-3 flex items-center gap-2 whitespace-nowrap">
                                <img src={b.customer?.avatar || b.avatar} alt={b.customer?.name || b.customer_name} className="w-7 h-7 rounded-full object-cover" />
                                <span className="font-medium text-gray-900">{b.customer?.name || b.customer_name}</span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">{b.tour || b.tour_name}</td>
                            <td className="py-3 px-3 whitespace-nowrap">{formatDateVN(b.date || b.created_at)}</td>
                            <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">{formatVND(b.amount || b.total_price)}</td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(b.status)}`}>{(b.status || "").charAt(0).toUpperCase() + (b.status || "").slice(1).toLowerCase()}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
};

export default RecentBookingsTable;
