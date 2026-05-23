import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, UserPlus, Users, UserCheck, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomerTable from '../../components/admin/customers/CustomerTable';
import userService from '../../services/userService';
import AdminPagination from '../../components/admin/common/AdminPagination';



const TIER_OPTIONS = ['Tất cả', 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'];
const STATUS_OPTIONS = [
    { value: 'all', label: 'Trạng thái' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'locked', label: 'Bị khóa' },
];

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState({ total: 0, new_this_month: 0, return_rate: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('Tất cả');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [usersRes, statsRes] = await Promise.all([
                    userService.getAllUsers(),
                    userService.getUserStats(),
                ]);
                if (usersRes.success) setCustomers(usersRes.data);
                if (statsRes.success) setStats(statsRes.data);
            } catch {
                toast.error('Không thể tải dữ liệu khách hàng');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        return customers.filter((c) => {
            const matchSearch =
                !search ||
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.phone.includes(search);
            const matchTier = tierFilter === 'Tất cả' || c.tier === tierFilter;
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchSearch && matchTier && matchStatus;
        });
    }, [customers, search, tierFilter, statusFilter]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCustomers = filtered.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, tierFilter, statusFilter]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i && totalPages > 1);
    };

    const handleToggleLock = async (target) => {
        try {
            const res = await userService.toggleUserLock(target.id);
            if (res.success) {
                setCustomers((prev) =>
                    prev.map((c) =>
                        c.id === target.id
                            ? { ...c, status: c.status === 'locked' ? 'active' : 'locked' }
                            : c
                    )
                );
                toast.success(
                    target.status === 'locked' ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản'
                );
            }
        } catch {
            toast.error('Không thể thay đổi trạng thái tài khoản');
        }
    };

    const handleView = (c) => console.log('Xem chi tiết:', c);
    const handleEdit = (c) => console.log('Chỉnh sửa:', c);

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B1A1A]">Quản lý Khách hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Xem và quản lý thông tin khách hàng trên hệ thống.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#8B1A1A] hover:bg-[#7a1616] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex-shrink-0">
                    <UserPlus size={16} />
                    Thêm khách hàng
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
                        <Users size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tổng khách hàng</p>
                        <p className="text-xl font-bold text-gray-800 mt-0.5">
                            {isLoading ? '...' : stats.total.toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100 text-orange-500">
                        <UserCheck size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Khách hàng mới (Tháng này)</p>
                        <p className="text-xl font-bold text-gray-800 mt-0.5">
                            {isLoading ? '...' : `+${stats.new_this_month}`}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100 text-green-600">
                        <RefreshCcw size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tỷ lệ quay lại</p>
                        <p className="text-xl font-bold text-gray-800 mt-0.5">
                            {isLoading ? '...' : `${stats.return_rate}%`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px]">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên, email hoặc SĐT..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40"
                        />
                    </div>

                    {/* Tier Filter */}
                    <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 bg-white"
                    >
                        {TIER_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t === 'Tất cả' ? 'Hạng thành viên' : t}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 bg-white"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    {/* Advanced Filter */}
                    <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                        <SlidersHorizontal size={15} />
                        Lọc nâng cao
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CustomerTable
                    customers={currentCustomers}
                    onView={handleView}
                    onEdit={handleEdit}
                    onToggleLock={handleToggleLock}
                />

                {/* Footer */}
                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    filteredLength={filtered.length}
                    onPageChange={handlePageChange}
                    getVisiblePages={getVisiblePages}
                    itemLabel="khách hàng"
                />
            </div>
        </div>
    );
};

export default AdminCustomers;
