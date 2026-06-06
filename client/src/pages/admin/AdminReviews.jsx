import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Star, MessageSquare, Trash2, Calendar, Filter, RefreshCw, X, MessageCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllReviews, replyToReview, deleteReview } from '../../services/reviewService';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    // Modals
    const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
    const [adminReplyText, setAdminReplyText] = useState('');
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const fetchReviewsList = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit,
                search,
                rating: ratingFilter || undefined
            };
            const res = await getAllReviews(params);
            if (res.success && res.data) {
                setReviews(res.data.reviews || []);
                setTotalPages(res.data.pagination.totalPages || 1);
                setTotalReviews(res.data.pagination.total || 0);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách đánh giá:", error);
            toast.error(error.response?.data?.message || 'Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewsList();
    }, [currentPage, ratingFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchReviewsList();
    };

    const handleRatingFilterChange = (e) => {
        setRatingFilter(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenReplyModal = (review) => {
        setSelectedReviewForReply(review);
        setAdminReplyText(review.admin_reply || '');
    };

    const handleSaveReply = async (e) => {
        e.preventDefault();
        if (!selectedReviewForReply) return;

        try {
            const res = await replyToReview(selectedReviewForReply.review_id, adminReplyText);
            if (res.success) {
                toast.success(res.message || 'Lưu phản hồi thành công!');
                // Update local review object
                setReviews(prev =>
                    prev.map(r => r.review_id === selectedReviewForReply.review_id ? { 
                        ...r, 
                        admin_reply: adminReplyText, 
                        replied_at: new Date().toISOString() 
                    } : r)
                );
                setSelectedReviewForReply(null);
                setAdminReplyText('');
            }
        } catch (error) {
            console.error("Lỗi gửi phản hồi:", error);
            toast.error(error.response?.data?.message || 'Không thể gửi phản hồi');
        }
    };

    const executeDeleteReview = async () => {
        if (!reviewToDelete) return;

        try {
            const res = await deleteReview(reviewToDelete.review_id);
            if (res.success) {
                toast.success(res.message || 'Xóa đánh giá thành công!');
                // Decrement count and re-fetch or filter locally
                setReviews(prev => prev.filter(r => r.review_id !== reviewToDelete.review_id));
                setTotalReviews(prev => Math.max(0, prev - 1));
                setReviewToDelete(null);
            }
        } catch (error) {
            console.error("Lỗi xóa đánh giá:", error);
            toast.error(error.response?.data?.message || 'Không thể xóa đánh giá');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
            />
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <Star className="w-8 h-8 text-[#8B1A1A] fill-[#8B1A1A]/10" />
                        Quản lý Đánh giá
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Theo dõi nhận xét của khách hàng, gửi phản hồi của quản trị viên và xóa các nội dung không hợp lệ.
                    </p>
                </div>
                <button
                    onClick={fetchReviewsList}
                    className="self-start md:self-auto flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm active:scale-[0.98]"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Làm mới
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên khách, Tên tour, Nhận xét..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10 placeholder-gray-400 text-gray-800"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button type="submit" className="hidden" />
                </form>

                {/* Filters */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 self-end md:self-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Đánh giá:</span>
                    </div>
                    <select
                        value={ratingFilter}
                        onChange={handleRatingFilterChange}
                        className="w-full sm:w-auto appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none transition focus:border-[#8B1A1A] cursor-pointer"
                    >
                        <option value="">Tất cả số sao</option>
                        <option value="5">5 sao</option>
                        <option value="4">4 sao</option>
                        <option value="3">3 sao</option>
                        <option value="2">2 sao</option>
                        <option value="1">1 sao</option>
                    </select>
                </div>
            </div>

            {/* Table / Content */}
            {loading ? (
                <div className="bg-white rounded-2xl h-80 flex flex-col items-center justify-center border border-gray-100 shadow-sm space-y-3">
                    <div className="w-8 h-8 border-4 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Đang tải dữ liệu đánh giá...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <MessageSquare className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-bold text-gray-900">Không tìm thấy đánh giá nào</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                        {search || ratingFilter
                            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc sao để nhận kết quả.'
                            : 'Hiện tại hệ thống chưa có nhận xét, đánh giá nào từ khách hàng.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Tour du lịch</th>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Xếp hạng</th>
                                    <th className="px-6 py-4">Nội dung nhận xét</th>
                                    <th className="px-6 py-4">Phản hồi của Admin</th>
                                    <th className="px-6 py-4">Ngày gửi</th>
                                    <th className="px-6 py-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reviews.map((review) => (
                                    <tr key={review.review_id} className="hover:bg-gray-50/30 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-950 max-w-[180px] truncate" title={review.tour_title}>
                                                {review.tour_title}
                                            </div>
                                            <div className="text-[11px] text-gray-400 mt-0.5">{review.tour_destination}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{review.username}</div>
                                            <div className="text-xs text-gray-400">{review.user_email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-0.5 mb-1">{renderStars(review.rating)}</div>
                                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                review.rating >= 4 ? 'bg-green-50 text-green-700 border border-green-150' : 
                                                review.rating === 3 ? 'bg-amber-50 text-amber-700 border border-amber-150' :
                                                'bg-red-50 text-red-700 border border-red-150'
                                            }`}>
                                                {review.rating}/5 điểm
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-[200px]">
                                            <p className="text-gray-700 text-xs line-clamp-3 leading-relaxed" title={review.comment}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 max-w-[200px]">
                                            {review.admin_reply ? (
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs text-red-800 italic font-medium line-clamp-2 leading-relaxed" title={review.admin_reply}>
                                                        "{review.admin_reply}"
                                                    </p>
                                                    <span className="text-[9px] text-gray-400">
                                                        Phản hồi: {new Date(review.replied_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Chưa phản hồi</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                                {new Date(review.timestamp).toLocaleDateString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenReplyModal(review)}
                                                    className="p-2 text-red-800 hover:bg-red-50 rounded-xl transition flex items-center gap-1 text-xs font-semibold border border-transparent hover:border-red-100"
                                                    title="Viết/Sửa phản hồi"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    Phản hồi
                                                </button>
                                                <button
                                                    onClick={() => setReviewToDelete(review)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
                                                    title="Xóa đánh giá"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-white select-none">
                            <div className="text-xs md:text-sm text-gray-500">
                                Hiển thị <span className="font-semibold">{((currentPage - 1) * limit) + 1}</span> đến{' '}
                                <span className="font-semibold">
                                    {Math.min(currentPage * limit, totalReviews)}
                                </span>{' '}
                                trong tổng số <span className="font-semibold">{totalReviews}</span> đánh giá
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                                >
                                    Trước
                                </button>
                                {[...Array(totalPages)].map((_, idx) => {
                                    const pageNum = idx + 1;
                                    // Hiển thị tối đa 5 nút trang xung quanh trang hiện tại nếu quá nhiều
                                    if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                                        if (pageNum === 2 || pageNum === totalPages - 1) {
                                            return <span key={pageNum} className="px-2 py-1.5 text-gray-400 text-xs">...</span>;
                                        }
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition ${
                                                currentPage === pageNum
                                                    ? 'bg-[#8B1A1A] text-white'
                                                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Reply View */}
            {selectedReviewForReply && createPortal(
                <div className="fixed inset-0 z-[10000] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col p-6 animate-in fade-in zoom-in duration-200 relative">
                        <button 
                            onClick={() => setSelectedReviewForReply(null)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-3 text-red-800 mb-5 border-b pb-4">
                            <div className="p-2.5 bg-red-50 rounded-2xl">
                                <MessageSquare className="w-6 h-6 text-[#8B1A1A]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Phản hồi của Ban Quản Trị</h3>
                                <p className="text-xs text-gray-500">Phản hồi đánh giá của khách hàng về Tour</p>
                            </div>
                        </div>

                        {/* Review info inside Modal */}
                        <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-3 text-xs md:text-sm text-gray-700 border border-gray-200/60">
                            <div>
                                <span className="font-semibold text-gray-500 block mb-0.5">Tour:</span>
                                <span className="font-bold text-gray-900">{selectedReviewForReply.tour_title}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <div>
                                    <span className="font-semibold text-gray-500 block mb-0.5">Khách hàng:</span>
                                    <span className="font-bold text-gray-900">{selectedReviewForReply.username}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-gray-500 block mb-0.5">Đánh giá:</span>
                                    <div className="flex gap-0.5 justify-end">{renderStars(selectedReviewForReply.rating)}</div>
                                </div>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block mb-1">Ý kiến nhận xét:</span>
                                <p className="italic text-gray-600 bg-white p-3 rounded-xl border border-gray-150 leading-relaxed font-medium">
                                    "{selectedReviewForReply.comment}"
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveReply} className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-gray-800" htmlFor="adminReply">Nội dung phản hồi:</label>
                                <textarea
                                    id="adminReply"
                                    rows="4"
                                    required
                                    value={adminReplyText}
                                    onChange={(e) => setAdminReplyText(e.target.value)}
                                    placeholder="Viết lời cảm ơn hoặc thông tin phản hồi của công ty..."
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-[#8B1A1A] text-sm transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedReviewForReply(null)}
                                    className="px-4 py-2.5 border border-gray-300 bg-white text-gray-750 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-[#8B1A1A] text-white rounded-xl text-sm font-semibold hover:bg-red-900 transition shadow-sm active:scale-98"
                                >
                                    Lưu phản hồi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Custom Confirm Delete Modal */}
            {reviewToDelete && createPortal(
                <div className="fixed inset-0 z-[10000] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-3 bg-red-50 rounded-full">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa đánh giá</h3>
                        </div>
                        <p className="text-sm text-gray-655 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn xóa nhận xét của khách hàng <strong>{reviewToDelete.username}</strong> về tour{' '}
                            <strong>{reviewToDelete.tour_title}</strong>? 
                            Hành động này sẽ xóa vĩnh viễn đánh giá và tính toán lại điểm xếp hạng trung bình của tour.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setReviewToDelete(null)}
                                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={executeDeleteReview}
                                className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-md shadow-red-950/10"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminReviews;
