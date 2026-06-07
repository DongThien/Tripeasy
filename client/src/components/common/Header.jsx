import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";
import dashboardService from "../../services/dashboardService";

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    // Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ tours: [], bookings: [], customers: [] });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Notification States
    const [notifications, setNotifications] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);

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

    // Fetch notifications on mount
    useEffect(() => {
        const fetchNotis = async () => {
            try {
                const res = await dashboardService.getNotifications();
                setNotifications(res || []);
                if (res && res.length > 0) {
                    setHasNewNotification(true);
                }
            } catch (err) {
                console.error("Notifications API error:", err);
            }
        };
        fetchNotis();
    }, []);

    // Global Search Debounce Effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ tours: [], bookings: [], customers: [] });
            return;
        }
        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await dashboardService.globalSearch(searchQuery);
                setSearchResults(res || { tours: [], bookings: [], customers: [] });
            } catch (err) {
                console.error("Global search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Handle clicks outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.global-search-container') && !e.target.closest('.notification-bell-container')) {
                setIsSearchOpen(false);
                setIsNotiOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white flex items-center justify-between px-8 border-b">
            {/* Left: Global Search Container */}
            <div className="flex items-center w-1/2 global-search-container">
                <div className="relative w-full max-w-lg">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            placeholder="Search for bookings, tours or customers..."
                            className="bg-transparent outline-none w-full text-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-gray-400 hover:text-gray-650 text-xs font-semibold px-2 transition-colors"
                            >
                                Xóa
                            </button>
                        )}
                    </div>

                    {/* Global Search Results Popup */}
                    {isSearchOpen && searchQuery.trim() && (
                        <div className="absolute top-12 left-0 right-0 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto p-4 space-y-4 animate-in fade-in duration-200">
                            {isSearching ? (
                                <div className="text-xs text-gray-400 text-center py-4">Đang tìm kiếm kết quả...</div>
                            ) : (!searchResults.tours?.length && !searchResults.bookings?.length && !searchResults.customers?.length) ? (
                                <div className="text-xs text-gray-400 text-center py-4">Không tìm thấy kết quả nào</div>
                            ) : (
                                <>
                                    {/* Tours */}
                                    {searchResults.tours && searchResults.tours.length > 0 && (
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">Tours Du Lịch</div>
                                            <div className="space-y-0.5">
                                                {searchResults.tours.map(t => (
                                                    <div 
                                                        key={t.id}
                                                        onClick={() => {
                                                            navigate(`/admin/tours`);
                                                            setIsSearchOpen(false);
                                                            setSearchQuery("");
                                                        }}
                                                        className="flex flex-col px-3 py-1.5 rounded-xl hover:bg-red-50/50 cursor-pointer transition"
                                                    >
                                                        <div className="text-xs font-semibold text-gray-800">{t.name}</div>
                                                        <div className="text-[10px] text-gray-400">{t.detail}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bookings */}
                                    {searchResults.bookings && searchResults.bookings.length > 0 && (
                                        <div className="border-t border-gray-50 pt-2">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">Đơn Đặt Chỗ</div>
                                            <div className="space-y-0.5">
                                                {searchResults.bookings.map(b => (
                                                    <div 
                                                        key={b.id}
                                                        onClick={() => {
                                                            navigate(`/admin/bookings`);
                                                            setIsSearchOpen(false);
                                                            setSearchQuery("");
                                                        }}
                                                        className="flex flex-col px-3 py-1.5 rounded-xl hover:bg-red-50/50 cursor-pointer transition"
                                                    >
                                                        <div className="text-xs font-semibold text-gray-800">{b.name}</div>
                                                        <div className="text-[10px] text-gray-400">{b.detail}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Customers */}
                                    {searchResults.customers && searchResults.customers.length > 0 && (
                                        <div className="border-t border-gray-50 pt-2">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">Khách Hàng</div>
                                            <div className="space-y-0.5">
                                                {searchResults.customers.map(c => (
                                                    <div 
                                                        key={c.id}
                                                        onClick={() => {
                                                            navigate(`/admin/customers`);
                                                            setIsSearchOpen(false);
                                                            setSearchQuery("");
                                                        }}
                                                        className="flex flex-col px-3 py-1.5 rounded-xl hover:bg-red-50/50 cursor-pointer transition"
                                                    >
                                                        <div className="text-xs font-semibold text-gray-800">{c.name}</div>
                                                        <div className="text-[10px] text-gray-400">{c.detail}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center gap-6">
                {/* Notification Bell Dropdown */}
                <div className="relative notification-bell-container">
                    <button
                        type="button"
                        onClick={() => {
                            setIsNotiOpen(!isNotiOpen);
                            setHasNewNotification(false);
                        }}
                        className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer outline-none border-0 bg-transparent"
                    >
                        <Bell className="w-6 h-6" />
                        {hasNewNotification && (
                            <span className="absolute top-1.5 right-1.5 block w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </button>

                    {isNotiOpen && (
                        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-200">
                            <div className="px-4 py-3 bg-[#8B1A1A] text-white text-xs font-bold tracking-wider flex items-center justify-between">
                                <span>THÔNG BÁO MỚI</span>
                                {notifications.length > 0 && (
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                        {notifications.length} tin
                                    </span>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-xs text-gray-400">
                                        Không có thông báo mới nào
                                    </div>
                                ) : (
                                    notifications.map((n, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                if (n.type === 'booking') {
                                                    navigate('/admin/bookings');
                                                } else {
                                                    navigate('/admin/contact');
                                                }
                                                setIsNotiOpen(false);
                                            }}
                                            className="p-3.5 hover:bg-red-50/20 cursor-pointer transition flex flex-col gap-0.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full
                                                    ${n.type === 'booking' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {n.type === 'booking' ? 'Booking' : 'Liên hệ'}
                                                </span>
                                                <span className="text-[9px] text-gray-400">
                                                    {new Date(n.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="text-xs font-bold text-gray-800 mt-1">{n.title}</div>
                                            <div className="text-[10px] text-gray-500 leading-normal line-clamp-2">{n.desc}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Info & Logout */}
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B1A1A] text-xs font-semibold text-white">
                        {avatarLabel}
                    </span>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold text-gray-900">{displayName}</div>
                        <div className="text-xs text-gray-400">{displayRole}</div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="ml-2 inline-flex items-center gap-2 rounded-full border border-[#8B1A1A] px-3 py-1 text-xs font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white cursor-pointer"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
