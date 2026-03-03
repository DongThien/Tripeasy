import React from 'react';
import { MapPin, Search } from "lucide-react";

const Navbar = () => (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <MapPin className="w-7 h-7 text-[#8B1A1A]" />
                <span className="font-bold text-xl text-[#8B1A1A]">Tripeasy</span>
            </div>
            {/* Center: Nav Links */}
            <nav className="hidden md:flex gap-7 font-medium text-gray-900">
                <a href="#" className="hover:text-[#8B1A1A] transition">Trang chủ</a>
                <a href="#" className="hover:text-[#8B1A1A] transition">Giới thiệu</a>
                <a href="#" className="hover:text-[#8B1A1A] transition">Tour</a>
                <a href="#" className="hover:text-[#8B1A1A] transition">Điểm đến</a>
                <a href="#" className="hover:text-[#8B1A1A] transition">Liên hệ</a>
                <a href="#" className="text-[#8B1A1A] font-semibold hover:underline">Khuyến mãi</a>
            </nav>
            {/* Right: Search + Login */}
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Search className="w-5 h-5 text-gray-700" />
                </button>
                <button className="bg-[#8B1A1A] text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-[#a83232] transition">
                    Đăng nhập
                </button>
            </div>
        </div>
    </header>
);

export default Navbar;
