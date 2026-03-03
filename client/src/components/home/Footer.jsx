import React from 'react';
import { MapPin, Facebook, Youtube, Instagram } from "lucide-react";

const Footer = () => (
    <footer className="bg-[#1a1a1a] text-gray-200 mt-20 pt-12 pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-4">
            {/* Logo + desc + social */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-7 h-7 text-white" />
                    <span className="font-bold text-xl text-white">Tripeasy</span>
                </div>
                <p className="text-gray-400 mb-4">
                    Tripeasy là đơn vị lữ hành uy tín hàng đầu, chuyên cung cấp các tour du lịch trong nước với trải nghiệm văn hóa sâu sắc và dịch vụ đẳng cấp.
                </p>
                <div className="flex gap-3">
                    <a href="#" className="bg-gray-800 hover:bg-[#8B1A1A] p-2 rounded-full transition">
                        <Facebook className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="bg-gray-800 hover:bg-[#8B1A1A] p-2 rounded-full transition">
                        <Youtube className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="bg-gray-800 hover:bg-[#8B1A1A] p-2 rounded-full transition">
                        <Instagram className="w-5 h-5 text-white" />
                    </a>
                </div>
            </div>
            {/* About */}
            <div>
                <h4 className="font-semibold mb-3 text-white">Về chúng tôi</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
                    <li><a href="#" className="hover:text-white">Đội ngũ</a></li>
                    <li><a href="#" className="hover:text-white">Tuyển dụng</a></li>
                    <li><a href="#" className="hover:text-white">Tin tức</a></li>
                </ul>
            </div>
            {/* Support */}
            <div>
                <h4 className="font-semibold mb-3 text-white">Hỗ trợ khách hàng</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
                    <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
                    <li><a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
                    <li><a href="#" className="hover:text-white">Chính sách hoàn tiền</a></li>
                    <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                </ul>
            </div>
            {/* Newsletter */}
            <div>
                <h4 className="font-semibold mb-3 text-white">Đăng ký nhận tin</h4>
                <p className="text-gray-400 mb-3">Nhận thông tin ưu đãi mới nhất từ Tripeasy.</p>
                <form className="flex flex-col gap-2">
                    <input
                        type="email"
                        placeholder="Email của bạn"
                        className="bg-[#231313] text-gray-200 px-4 py-2 rounded-full outline-none border border-[#333] focus:border-[#8B1A1A] transition w-full"
                    />
                    <button
                        type="submit"
                        className="bg-[#8B1A1A] hover:bg-[#a83232] text-white px-5 py-2 rounded-full font-semibold transition w-full"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
        <div className="border-t border-[#332222] mt-10 pt-4 text-center text-gray-500 text-xs tracking-wide flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <span>© 2023 Tripeasy Vietnam. All rights reserved.</span>
            <span>
                <a href="#" className="hover:text-white">Privacy Policy</a> &nbsp;|&nbsp;
                <a href="#" className="hover:text-white">Terms of Service</a>
            </span>
        </div>
    </footer>
);

export default Footer;
