import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Search, Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { label: 'Trang chủ', to: '/client' },
    { label: 'Giới thiệu', to: '/client/about' },
    { label: 'Tour', to: '/client/tours' },
    { label: 'Điểm đến', to: '/client/destinations' },
    { label: 'Liên hệ', to: '/client/contact' },
];

const ClientNavbar = () => {
    const { pathname } = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

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
                    <a href="#" className="text-[#8B1A1A] font-semibold hover:underline">
                        Khuyến mãi
                    </a>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <Search className="w-5 h-5 text-gray-700" />
                    </button>
                    <Link
                        to="/login"
                        className="hidden md:block bg-[#8B1A1A] text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-[#a83232] transition"
                    >
                        Đăng nhập
                    </Link>
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
                    <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="w-full bg-[#8B1A1A] text-white py-2 rounded-full font-semibold hover:bg-[#a83232] transition text-center"
                    >
                        Đăng nhập
                    </Link>
                </div>
            )}
        </header>
    );
};

export default ClientNavbar;
