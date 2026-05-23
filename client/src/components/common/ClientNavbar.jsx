import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Search, Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { label: 'Trang chủ', to: '/client' },
    { label: 'Giới thiệu', to: '/client/about' },
    { label: 'Tour', to: '/client/tours' },
    { label: 'Tin tức', to: '/client/news' },
    { label: 'Tuyển dụng', to: '/client/careers' },
    { label: 'Liên hệ', to: '/client/contact' },
];

const ClientNavbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
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

    const displayName = user?.username || user?.name || user?.email || 'Tài khoản';
    const avatarLabel = useMemo(() => {
        const source = (user?.username || user?.name || user?.email || 'TRI').trim();
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
        setMobileOpen(false);
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
                {/* Logo */}
                <Link to="/client" className="flex items-center gap-2 flex-shrink-0">
                    <MapPin className="w-7 h-7 text-[#8B1A1A]" />
                    <span className="font-bold text-xl text-[#8B1A1A]">Tripeasy</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-7 font-medium text-gray-700">
                    {NAV_LINKS.map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`hover:text-[#8B1A1A] transition-colors ${pathname === to ? 'text-[#8B1A1A] font-semibold' : ''
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <Search className="w-5 h-5 text-gray-700" />
                    </button>
                    {user ? (
                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B1A1A] text-xs font-semibold text-white">
                                    {avatarLabel}
                                </span>
                                <span className="max-w-[140px] truncate text-sm font-semibold text-gray-700">
                                    {displayName}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full border border-[#8B1A1A] px-4 py-1.5 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link
                                to="/login"
                                className="bg-[#8B1A1A] text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-[#a83232] transition"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full border border-[#8B1A1A] px-4 py-2 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
                    {NAV_LINKS.map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMobileOpen(false)}
                            className={`font-medium transition-colors ${pathname === to ? 'text-[#8B1A1A] font-semibold' : 'text-gray-700'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                    {user ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1A1A] text-sm font-semibold text-white">
                                    {avatarLabel}
                                </span>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800">{displayName}</div>
                                    <div className="text-xs text-gray-500">Tài khoản Tripeasy</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full rounded-full border border-[#8B1A1A] py-2 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="w-full bg-[#8B1A1A] text-white py-2 rounded-full font-semibold hover:bg-[#a83232] transition text-center"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileOpen(false)}
                                className="w-full rounded-full border border-[#8B1A1A] py-2 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white text-center"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default ClientNavbar;
