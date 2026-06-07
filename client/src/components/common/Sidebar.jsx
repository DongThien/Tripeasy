import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, Ticket, Users, Settings, Phone, ChevronDown, Plus, List, Star, MapPin } from "lucide-react";

const menu = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, active: true },
    { label: "Manage Tours", icon: <Map className="w-5 h-5" /> },
    { label: "Bookings", icon: <Ticket className="w-5 h-5" /> },
    { label: "Customers", icon: <Users className="w-5 h-5" /> },
    { label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Liên hệ", icon: <Phone className="w-5 h-5" /> },
];

const Sidebar = () => {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState(null);
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'user') {
                const nextUser = event.newValue ? JSON.parse(event.newValue) : null;
                setUser(nextUser);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const displayName = user?.username || user?.name || user?.email || 'Admin';
    const displayRole = user?.role ? user.role.toUpperCase() : 'ADMIN';
    const avatarLabel = useMemo(() => {
        const source = (user?.username || user?.name || user?.email || 'TR').trim();
        return source
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join('');
    }, [user]);
    return (
        <aside className="w-64 h-screen bg-white border-r flex flex-col fixed left-0 top-0 z-20">
            <Link to="/client" className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100 hover:bg-gray-50/50 transition group select-none">
                <MapPin className="w-7 h-7 text-[#8B1A1A] group-hover:scale-110 transition-transform duration-200" />
                <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tight text-[#8B1A1A]">Tripeasy</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider -mt-1.5 font-mono">Admin Panel</span>
                </div>
            </Link>
            <nav className="flex-1 px-2">
                <ul className="space-y-1 mt-2">
                    <li>
                        <Link
                            to="/admin/dashboard"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${location.pathname === "/admin/dashboard" ? "bg-red-50 text-[#8B1A1A] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <button
                            className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg transition font-semibold ${openMenu === 0 ? "bg-red-50 text-[#8B1A1A]" : "text-gray-500 hover:bg-gray-100"}`}
                            onClick={() => setOpenMenu(openMenu === 0 ? null : 0)}
                        >
                            <Map className="w-5 h-5" />
                            <span>Quản lý Tour</span>
                            <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${openMenu === 0 ? "rotate-180" : ""}`} />
                        </button>
                        {openMenu === 0 && (
                            <ul className="ml-8 mt-1 space-y-1">
                                <li>
                                    <Link
                                        to="/admin/tours/add"
                                        className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-red-100 hover:text-[#8B1A1A] transition ${location.pathname === "/admin/tours/add" ? "bg-red-100 text-[#8B1A1A] font-semibold" : ""}`}
                                    >
                                        <Plus className="w-4 h-4" /> Thêm Tour
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/tours"
                                        className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-red-100 hover:text-[#8B1A1A] transition ${location.pathname === "/admin/tours" ? "bg-red-100 text-[#8B1A1A] font-semibold" : ""}`}
                                    >
                                        <List className="w-4 h-4" /> Danh sách Tour
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link
                            to="/admin/bookings"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${location.pathname === "/admin/bookings" ? "bg-red-50 text-[#8B1A1A] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Ticket className="w-5 h-5" />
                            <span>Đặt chỗ</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/customers"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${location.pathname === "/admin/customers" ? "bg-red-50 text-[#8B1A1A] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Users className="w-5 h-5" />
                            <span>Khách hàng</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/reviews"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${location.pathname === "/admin/reviews" ? "bg-red-50 text-[#8B1A1A] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Star className="w-5 h-5" />
                            <span>Đánh giá</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/settings"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${location.pathname === "/admin/settings" ? "bg-red-50 text-[#8B1A1A] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Settings className="w-5 h-5" />
                            <span>Cài đặt</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/contact"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${location.pathname === "/admin/contact" ? "bg-red-50 text-[#8B1A1A] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Phone className="w-5 h-5" />
                            <span>Liên hệ</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="p-4 mt-auto flex items-center gap-3 border-t">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1A1A] text-xs font-semibold text-white">
                    {avatarLabel}
                </span>
                <div>
                    <div className="font-semibold text-gray-900">{displayName}</div>
                    <div className="text-xs text-gray-400">{displayRole}</div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
