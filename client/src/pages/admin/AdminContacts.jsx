import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Mail, Phone, Calendar, Trash2, Eye, Filter, RefreshCw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import contactService from '../../services/contactService';
import ContactDetailModal from '../../components/admin/contacts/ContactDetailModal';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedContact, setSelectedContact] = useState(null);
    const [contactToDelete, setContactToDelete] = useState(null);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await contactService.getAllContacts({ search, status: statusFilter });
            if (res.success) {
                setContacts(res.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Không thể tải danh sách phản hồi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [statusFilter]); // Tự động fetch lại khi đổi bộ lọc trạng thái

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchContacts();
    };

    const handleUpdateContactInList = (updatedContact) => {
        setContacts(prev =>
            prev.map(c => c.contact_id === updatedContact.contact_id ? updatedContact : c)
        );
        if (selectedContact && selectedContact.contact_id === updatedContact.contact_id) {
            setSelectedContact(updatedContact);
        }
    };

    const executeDeleteContact = async () => {
        if (!contactToDelete) return;

        try {
            const res = await contactService.deleteContact(contactToDelete.contact_id);
            if (res.success) {
                toast.success(res.message || 'Xóa phản hồi liên hệ thành công!');
                setContacts(prev => prev.filter(c => c.contact_id !== contactToDelete.contact_id));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Không thể xóa phản hồi liên hệ');
        } finally {
            setContactToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-[#8B1A1A]" />
                        Phản hồi liên hệ
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Quản lý và tiếp nhận các phản hồi, yêu cầu tư vấn, hỗ trợ từ khách hàng.
                    </p>
                </div>
                <button
                    onClick={fetchContacts}
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
                        placeholder="Tìm kiếm theo Tên, Email, SĐT, Chủ đề..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10 placeholder-gray-400 text-gray-800"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button type="submit" className="hidden" />
                </form>

                {/* Filters */}
                <div className="w-full md:w-auto flex items-center gap-3 self-end md:self-auto">
                    <Filter className="w-4 h-4 text-gray-400 hidden sm:inline" />
                    <span className="text-sm font-medium text-gray-500 hidden sm:inline">Trạng thái:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none transition focus:border-[#8B1A1A] cursor-pointer"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="read">Đã đọc</option>
                        <option value="resolved">Đã giải quyết</option>
                    </select>
                </div>
            </div>

            {/* Contacts Table / Content */}
            {loading ? (
                <div className="bg-white rounded-2xl h-80 flex flex-col items-center justify-center border border-gray-100 shadow-sm space-y-3">
                    <div className="w-8 h-8 border-4 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Đang tải dữ liệu liên hệ...</p>
                </div>
            ) : contacts.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <MessageSquare className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-bold text-gray-900">Không tìm thấy phản hồi nào</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                        {search || statusFilter !== 'all'
                            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái để nhận kết quả.'
                            : 'Hiện tại chưa có khách hàng nào gửi liên hệ phản hồi.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Chủ đề</th>
                                    <th className="px-6 py-4">Nội dung</th>
                                    <th className="px-6 py-4">Ngày gửi</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {contacts.map((contact) => (
                                    <tr
                                        key={contact.contact_id}
                                        className="hover:bg-gray-50/50 transition cursor-pointer"
                                        onClick={() => setSelectedContact(contact)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{contact.fullName}</div>
                                            <div className="flex flex-col gap-0.5 mt-1 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {contact.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {contact.phone}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800 max-w-[150px] truncate">
                                            {contact.subject}
                                        </td>
                                        <td className="px-6 py-4 max-w-[200px] truncate text-gray-600">
                                            {contact.message}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {contact.createdAtFormatted}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                                                ${contact.status === 'PENDING' || contact.status === 'NEW' ? 'bg-amber-100 text-amber-800' : ''}
                                                ${contact.status === 'READ' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${contact.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : ''}
                                            `}>
                                                {contact.statusText}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedContact(contact)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Xem chi tiết & Trả lời"
                                                >
                                                    <Eye className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => setContactToDelete(contact)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Xóa phản hồi"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Detail View */}
            {selectedContact && (
                <ContactDetailModal
                    contact={selectedContact}
                    onClose={() => setSelectedContact(null)}
                    onUpdateStatus={handleUpdateContactInList}
                />
            )}

            {/* Custom Confirm Delete Modal */}
            {contactToDelete && createPortal(
                <div className="fixed inset-0 z-[10000] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-3 bg-red-50 rounded-full">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa phản hồi</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn xóa phản hồi liên hệ của khách hàng <strong>{contactToDelete.fullName}</strong>? 
                            Hành động này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống và không thể hoàn tác.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setContactToDelete(null)}
                                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={executeDeleteContact}
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

export default AdminContacts;
