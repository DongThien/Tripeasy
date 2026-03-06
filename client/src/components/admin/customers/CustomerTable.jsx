import React from 'react';
import { Eye, Pencil, Lock } from 'lucide-react';

const TIER_MAP = {
    'Đồng': { label: 'ĐỒNG', bg: 'bg-orange-100', text: 'text-orange-700' },
    'Bạc': { label: 'BẠC', bg: 'bg-gray-100', text: 'text-gray-600' },
    'Vàng': { label: 'VÀNG', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'Kim Cương': { label: 'KIM CƯƠNG', bg: 'bg-cyan-100', text: 'text-cyan-700' },
};

const TierBadge = ({ tier }) => {
    const config = TIER_MAP[tier] || { label: tier, bg: 'bg-gray-100', text: 'text-gray-500' };
    return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const isActive = status === 'active';
    return (
        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {isActive ? 'HOẠT ĐỘNG' : 'BỊ KHÓA'}
        </span>
    );
};

const CustomerTable = ({ customers, onView, onEdit, onToggleLock }) => {
    if (!customers || customers.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">Không có khách hàng nào phù hợp.</div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-fixed w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap w-[26%]">Khách hàng</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap w-[14%]">Số điện thoại</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap w-[13%]">Ngày đăng ký</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap w-[15%]">Tổng chi tiêu</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap w-[13%]">Hạng thành viên</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap w-[11%]">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap w-[8%]">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            {/* Khách hàng */}
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=e5e7eb&color=374151&size=40`}
                                        alt={c.name}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-800 truncate">{c.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{c.email}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Số điện thoại */}
                            <td className="py-3 px-4 text-gray-600">{c.phone}</td>

                            {/* Ngày đăng ký */}
                            <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{c.registeredAt}</td>

                            {/* Tổng chi tiêu */}
                            <td className="py-3 px-4 font-semibold text-gray-800 whitespace-nowrap">{c.totalSpent}</td>

                            {/* Hạng thành viên */}
                            <td className="py-3 px-4">
                                <TierBadge tier={c.tier} />
                            </td>

                            {/* Trạng thái */}
                            <td className="py-3 px-4">
                                <StatusBadge status={c.status} />
                            </td>

                            {/* Thao tác */}
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onView?.(c)}
                                        className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEdit?.(c)}
                                        className="p-1.5 rounded hover:bg-yellow-50 text-gray-400 hover:text-yellow-500 transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => onToggleLock?.(c)}
                                        className={`p-1.5 rounded transition-colors ${c.status === 'locked' ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
                                        title={c.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}
                                    >
                                        <Lock size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable;
