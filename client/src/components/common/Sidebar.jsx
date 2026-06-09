import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, Ticket, Users, Settings, Phone, ChevronDown, Plus, List, Star, MapPin } from "lucide-react";

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

    // Automatically expand submenu if on a child page
    useEffect(() => {
        if (location.pathname.startsWith("/admin/tours")) {
            setOpenMenu(0);
        }
    }, [location.pathname]);

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

    const getLinkClass = (isActive) => {
        return `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
            isActive
                ? "bg-gradient-to-r from-[#8B1A1A] to-[#a32222] text-white font-medium shadow-md shadow-red-950/20"
                : "text-gray-500 hover:text-[#8B1A1A] hover:bg-red-50/50 hover:translate-x-1"
        }`;
    };

    const isTourActive = location.pathname.startsWith("/admin/tours");
    const getDropdownBtnClass = (isOpen, isActive) => {
        return `flex items-center w-full gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
            isActive
                ? "bg-red-50 text-[#8B1A1A] font-semibold border-l-4 border-[#8B1A1A] rounded-l-none pl-3"
                : isOpen
                ? "bg-gray-50 text-[#8B1A1A] font-semibold"
                : "text-gray-500 hover:text-[#8B1A1A] hover:bg-red-50/50 hover:translate-x-1"
        }`;
    };

    const getSubLinkClass = (isActive) => {
        return `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
            isActive
                ? "bg-red-50 text-[#8B1A1A] font-semibold"
                : "text-gray-500 hover:text-[#8B1A1A] hover:bg-red-50/30"
        }`;
    };

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20 shadow-sm">
            <Link to="/client" className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 hover:bg-gray-50/50 transition group select-none">
                <MapPin className="w-9 h-9 text-[#8B1A1A] group-hover:scale-110 transition-transform duration-200" />
                <div className="flex flex-col">
                    <span className="font-black text-2xl tracking-tight text-[#8B1A1A]">Tripeasy</span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest -mt-1 font-sans">Admin</span>
                </div>
            </Link>
            
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <ul className="space-y-1.5">
                    <li>
                        <Link
                            to="/admin/dashboard"
                            className={getLinkClass(location.pathname === "/admin/dashboard")}
                        >
                            <LayoutDashboard className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    
                    <li>
                        <button
                            className={getDropdownBtnClass(openMenu === 0, isTourActive)}
                            onClick={() => setOpenMenu(openMenu === 0 ? null : 0)}
                        >
                            <Map className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Quản lý Tour</span>
                            <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-200 ${openMenu === 0 ? "rotate-180" : ""}`} />
                        </button>
                        {openMenu === 0 && (
                            <ul className="ml-6 mt-1.5 space-y-1 border-l border-gray-100 pl-3">
                                <li>
                                    <Link
                                        to="/admin/tours/add"
                                        className={getSubLinkClass(location.pathname === "/admin/tours/add")}
                                    >
                                        <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" /> 
                                        <span>Thêm Tour</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/tours"
                                        className={getSubLinkClass(location.pathname === "/admin/tours")}
                                    >
                                        <List className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" /> 
                                        <span>Danh sách Tour</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    
                    <li>
                        <Link
                            to="/admin/bookings"
                            className={getLinkClass(location.pathname === "/admin/bookings")}
                        >
                            <Ticket className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Đặt chỗ</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link
                            to="/admin/customers"
                            className={getLinkClass(location.pathname === "/admin/customers")}
                        >
                            <Users className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Khách hàng</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link
                            to="/admin/reviews"
                            className={getLinkClass(location.pathname === "/admin/reviews")}
                        >
                            <Star className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Đánh giá</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link
                            to="/admin/settings"
                            className={getLinkClass(location.pathname === "/admin/settings")}
                        >
                            <Settings className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Cài đặt</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link
                            to="/admin/contact"
                            className={getLinkClass(location.pathname === "/admin/contact")}
                        >
                            <Phone className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Liên hệ</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            
            <div className="p-4 mt-auto border-t border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition duration-200">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B1A1A] text-sm font-bold text-white shadow-sm">
                        {avatarLabel}
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[14px] text-gray-800 truncate" title={displayName}>{displayName}</div>
                        <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">{displayRole}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
