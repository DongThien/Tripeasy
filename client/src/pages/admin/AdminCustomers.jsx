import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, UserPlus, Users, UserCheck, RefreshCcw, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomerTable from '../../components/admin/customers/CustomerTable';
import userService from '../../services/userService';
import AdminPagination from '../../components/admin/common/AdminPagination';
import CustomerDetailModal from '../../components/admin/customers/CustomerDetailModal';
import CustomerFormModal from '../../components/admin/customers/CustomerFormModal';
import LockConfirmModal from '../../components/admin/customers/LockConfirmModal';

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
    
    // Core Filters
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('Tất cả');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Advanced Filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [spendFilter, setSpendFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [regDateFilter, setRegDateFilter] = useState('all');

    // Modals
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [lockingCustomer, setLockingCustomer] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Logic
    const filtered = useMemo(() => {
        return customers.filter((c) => {
            const matchSearch =
                !search ||
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.phone.includes(search);
            
            const matchTier = tierFilter === 'Tất cả' || c.tier === tierFilter;
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            
            // Spend Filter
            let matchSpend = true;
            if (spendFilter === 'under_5m') {
                matchSpend = c.totalSpentRaw < 5000000;
            } else if (spendFilter === '5m_20m') {
                matchSpend = c.totalSpentRaw >= 5000000 && c.totalSpentRaw < 20000000;
            } else if (spendFilter === '20m_50m') {
                matchSpend = c.totalSpentRaw >= 20000000 && c.totalSpentRaw < 50000000;
            } else if (spendFilter === 'over_50m') {
                matchSpend = c.totalSpentRaw >= 50000000;
            }

            // Role Filter
            const matchRole = roleFilter === 'all' || c.role === roleFilter;

            // Registration Date Filter
            let matchRegDate = true;
            if (regDateFilter !== 'all') {
                if (c.registeredAtRaw) {
                    const regDate = new Date(c.registeredAtRaw);
                    const currentMonth = new Date().getMonth() + 1;
                    const currentYear = new Date().getFullYear();
                    const regMonth = regDate.getMonth() + 1;
                    const regYear = regDate.getFullYear();
                    if (regDateFilter === 'this_month') {
                        matchRegDate = regMonth === currentMonth && regYear === currentYear;
                    } else if (regDateFilter === 'this_year') {
                        matchRegDate = regYear === currentYear;
                    }
                } else if (c.registeredAt) {
                    const parts = c.registeredAt.split('/');
                    if (parts.length === 3) {
                        const [, month, year] = parts;
                        const currentMonth = new Date().getMonth() + 1;
                        const currentYear = new Date().getFullYear();
                        if (regDateFilter === 'this_month') {
                            matchRegDate = parseInt(month) === currentMonth && parseInt(year) === currentYear;
                        } else if (regDateFilter === 'this_year') {
                            matchRegDate = parseInt(year) === currentYear;
                        }
                    }
                }
            }

            return matchSearch && matchTier && matchStatus && matchSpend && matchRole && matchRegDate;
        });
    }, [customers, search, tierFilter, statusFilter, spendFilter, roleFilter, regDateFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCustomers = filtered.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, tierFilter, statusFilter, spendFilter, roleFilter, regDateFilter]);

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

    // Lock/Unlock Confirmed Action
    const handleConfirmLock = async () => {
        if (!lockingCustomer) return;
        try {
            const res = await userService.toggleUserLock(lockingCustomer.id);
            if (res.success || res.user_id || res.id) {
                setCustomers((prev) =>
                    prev.map((c) =>
                        c.id === lockingCustomer.id
                            ? { ...c, status: c.status === 'locked' ? 'active' : 'locked' }
                            : c
                    )
                );
                toast.success(
                    lockingCustomer.status === 'locked' ? 'Đã mở khóa tài khoản thành công!' : 'Đã khóa tài khoản thành công!'
                );
                // Refresh Stats to update lock rates / counts if any
                const statsRes = await userService.getUserStats();
                if (statsRes.success) setStats(statsRes.data);
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái tài khoản');
        }
    };

    // Export CSV with UTF-8 BOM
    const handleExportCSV = () => {
        if (filtered.length === 0) {
            return toast.error('Không có dữ liệu khách hàng để xuất báo cáo');
        }

        const headers = ['Mã khách hàng', 'Họ và tên', 'Email', 'Số điện thoại', 'Ngày đăng ký', 'Tổng chi tiêu (VNĐ)', 'Hạng thành viên', 'Trạng thái'];
        
        const rows = filtered.map(c => [
            c.id,
            `"${c.name.replace(/"/g, '""')}"`,
            c.email,
            c.phone,
            c.registeredAt,
            c.totalSpentRaw,
            c.tier,
            c.status === 'active' ? 'Hoạt động' : 'Bị khóa'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        // \uFEFF signals UTF-8 to Excel
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `danh-sach-khach-hang-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Xuất báo cáo khách hàng thành công!');
    };

    // Reset Filters
    const handleResetFilters = () => {
        setSearch('');
        setTierFilter('Tất cả');
        setStatusFilter('all');
        setSpendFilter('all');
        setRoleFilter('all');
        setRegDateFilter('all');
        toast.success('Đã làm mới bộ lọc!');
    };

    return (
        <div className="font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B1A1A]">Quản lý Khách hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Xem và quản lý tài khoản khách hàng trên hệ thống Tripeasy.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition shadow-sm bg-white"
                        title="Xuất file báo cáo"
                    >
                        <FileText size={16} />
                        Xuất Excel
                    </button>
                    <button 
                        onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#8B1A1A] hover:bg-[#7a1616] text-white text-sm font-semibold rounded-lg transition shadow-sm"
                    >
                        <UserPlus size={16} />
                        Thêm khách hàng
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4 animate-in fade-in duration-200">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-600">
                        <Users size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Tổng khách hàng</p>
                        <p className="text-2xl font-bold text-gray-800 mt-0.5">
                            {isLoading ? '...' : stats.total.toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4 animate-in fade-in duration-200" style={{ animationDelay: '100ms' }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-50 text-orange-500">
                        <UserCheck size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Khách mới (Tháng này)</p>
                        <p className="text-2xl font-bold text-gray-800 mt-0.5">
                            {isLoading ? '...' : `+${stats.new_this_month}`}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4 animate-in fade-in duration-200" style={{ animationDelay: '200ms' }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-green-50 text-green-600">
                        <RefreshCcw size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Tỷ lệ quay lại</p>
                        <p className="text-2xl font-bold text-gray-800 mt-0.5">
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
                            placeholder="Tìm tên, email hoặc số điện thoại..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40"
                        />
                    </div>

                    {/* Tier Filter */}
                    <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 bg-white cursor-pointer"
                    >
                        {TIER_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t === 'Tất cả' ? 'Hạng thành viên' : t}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 bg-white cursor-pointer"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    {/* Reset button */}
                    {(search || tierFilter !== 'Tất cả' || statusFilter !== 'all' || spendFilter !== 'all' || roleFilter !== 'all' || regDateFilter !== 'all') && (
                        <button 
                            onClick={handleResetFilters}
                            className="px-3 py-2 text-xs font-bold text-[#8B1A1A] hover:bg-red-50 rounded-lg transition"
                        >
                            Xóa bộ lọc
                        </button>
                    )}

                    {/* Advanced Filter Toggle */}
                    <button 
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-lg transition-colors cursor-pointer
                            ${showAdvancedFilters ? 'bg-red-50 border-[#8B1A1A]/30 text-[#8B1A1A] font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50 bg-white'}`}
                    >
                        <SlidersHorizontal size={15} />
                        Lọc nâng cao
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-3 duration-250">
                        {/* Spend filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Mức chi tiêu</label>
                            <select
                                value={spendFilter}
                                onChange={(e) => setSpendFilter(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 bg-white cursor-pointer"
                            >
                                <option value="all">Tất cả chi tiêu</option>
                                <option value="under_5m">Dưới 5 triệu</option>
                                <option value="5m_20m">Từ 5 - 20 triệu</option>
                                <option value="20m_50m">Từ 20 - 50 triệu</option>
                                <option value="over_50m">Trên 50 triệu</option>
                            </select>
                        </div>

                        {/* Role filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Quyền hạn (Role)</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 bg-white cursor-pointer"
                            >
                                <option value="all">Tất cả vai trò</option>
                                <option value="customer">User (Khách hàng)</option>
                                <option value="admin">Admin (Quản trị)</option>
                            </select>
                        </div>

                        {/* Registration Date Range */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Thời gian đăng ký</label>
                            <select
                                value={regDateFilter}
                                onChange={(e) => setRegDateFilter(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 bg-white cursor-pointer"
                            >
                                <option value="all">Mọi thời gian</option>
                                <option value="this_month">Trong tháng này</option>
                                <option value="this_year">Trong năm nay</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Customer Table */}
            <CustomerTable
                customers={currentCustomers}
                onView={(c) => setViewingCustomer(c)}
                onEdit={(c) => setEditingCustomer(c)}
                onToggleLock={(c) => setLockingCustomer(c)}
            />

            {/* Footer Pagination */}
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredLength={filtered.length}
                onPageChange={handlePageChange}
                getVisiblePages={getVisiblePages}
                itemLabel="khách hàng"
                className="mt-5"
            />

            {/* Modals Portal Rendering */}
            {viewingCustomer && (
                <CustomerDetailModal
                    customer={viewingCustomer}
                    onClose={() => setViewingCustomer(null)}
                />
            )}

            {isFormOpen && (
                <CustomerFormModal
                    customer={editingCustomer}
                    onClose={() => { setIsFormOpen(false); setEditingCustomer(null); }}
                    onSaved={() => {
                        fetchData(); // reload list
                    }}
                />
            )}

            {editingCustomer && !isFormOpen && (
                <CustomerFormModal
                    customer={editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                    onSaved={(updatedCustomer) => {
                        setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
                    }}
                />
            )}

            {lockingCustomer && (
                <LockConfirmModal
                    customer={lockingCustomer}
                    onClose={() => setLockingCustomer(null)}
                    onConfirm={handleConfirmLock}
                />
            )}
        </div>
    );
};

export default AdminCustomers;
