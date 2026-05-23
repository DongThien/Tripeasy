import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Phone, Calendar, User, BookOpen, AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import contactService from '../../../services/contactService';

const ContactDetailModal = ({ contact, onClose, onUpdateStatus }) => {
    const [updating, setUpdating] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    if (!contact) return null;

    const handleStatusChange = async (newStatus) => {
        try {
            setUpdating(true);
            const res = await contactService.updateContactStatus(contact.contact_id, newStatus);
            if (res.success) {
                toast.success(res.message || 'Cập nhật trạng thái thành công!');
                onUpdateStatus(res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            toast.error('Vui lòng nhập nội dung email phản hồi!');
            return;
        }

        try {
            setSendingReply(true);
            const res = await contactService.replyContact(contact.contact_id, replyText);
            if (res.success) {
                toast.success(res.message || 'Đã gửi email phản hồi thành công!');
                // Cập nhật trạng thái trong danh sách bên ngoài sang RESOLVED
                onUpdateStatus(res.data);
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gửi email phản hồi thất bại');
        } finally {
            setSendingReply(false);
        }
    };

    const isResolved = contact.status === 'RESOLVED';

    return createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#8B1A1A] to-[#a32626] px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Chi tiết phản hồi liên hệ</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {/* User Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <div className="p-2 bg-[#8B1A1A]/10 text-[#8B1A1A] rounded-lg flex-shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-xs text-gray-400 font-medium">Khách hàng</div>
                                <div className="text-sm font-semibold text-gray-800 truncate">{contact.fullName}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-xs text-gray-400 font-medium">Email</div>
                                <div className="text-sm font-semibold text-gray-800 break-all truncate">{contact.email}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg flex-shrink-0">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-xs text-gray-400 font-medium">Số điện thoại</div>
                                <div className="text-sm font-semibold text-gray-800 truncate">{contact.phone}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg flex-shrink-0">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-xs text-gray-400 font-medium">Thời gian gửi</div>
                                <div className="text-sm font-semibold text-gray-800 truncate">{contact.createdAtFormatted}</div>
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                        <div className="text-xs text-gray-400 font-medium">Chủ đề</div>
                        <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#8B1A1A]" />
                            {contact.subject}
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Nội dung chi tiết:</h4>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                            {contact.message}
                        </div>
                    </div>

                    {/* Reply Section */}
                    {isResolved || contact.replyMessage ? (
                        <div className="space-y-2 border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-bold text-green-700 flex items-center gap-1.5">
                                <Send className="w-4 h-4" /> Nội dung phản hồi đã gửi:
                            </h4>
                            <div className="bg-green-50/40 p-5 rounded-xl border border-green-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {contact.replyMessage}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-semibold text-gray-700">Soạn email trả lời khách hàng:</h4>
                            <textarea
                                rows={4}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Nhập nội dung email phản hồi chi tiết tại đây (hệ thống sẽ tự động đóng gói dưới dạng email chuyên nghiệp để gửi đi)..."
                                className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10 text-gray-700"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSendReply}
                                    disabled={sendingReply || !replyText.trim()}
                                    className="flex items-center gap-2 bg-[#8B1A1A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6e1414] transition disabled:opacity-50 shadow-md shadow-red-950/10 active:scale-[0.98]"
                                >
                                    <Send className="w-4 h-4" />
                                    {sendingReply ? 'Đang gửi email...' : 'Gửi phản hồi Email'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Trạng thái xử lý:</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                            ${contact.status === 'PENDING' || contact.status === 'NEW' ? 'bg-amber-100 text-amber-800' : ''}
                            ${contact.status === 'READ' ? 'bg-blue-100 text-blue-800' : ''}
                            ${contact.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : ''}
                        `}>
                            {contact.statusText}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {(contact.status === 'PENDING' || contact.status === 'NEW') && (
                            <button
                                onClick={() => handleStatusChange('READ')}
                                disabled={updating || sendingReply}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                Đánh dấu đã đọc
                            </button>
                        )}
                        {contact.status !== 'RESOLVED' && (
                            <button
                                onClick={() => handleStatusChange('RESOLVED')}
                                disabled={updating || sendingReply}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
                            >
                                Đánh dấu đã giải quyết
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ContactDetailModal;
