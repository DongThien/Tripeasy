import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Facebook, Youtube, Instagram } from 'lucide-react';
import contactService from '../../services/contactService';
import toast from 'react-hot-toast';

const ClientFooter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            toast.error("Vui lòng nhập địa chỉ email của bạn!");
            return;
        }

        try {
            setLoading(true);
            const res = await contactService.subscribeNewsletter(trimmedEmail);
            if (res.success) {
                toast.success(res.message || "Đăng ký nhận tin thành công!");
                setEmail('');
            } else {
                toast.error(res.message || "Đăng ký thất bại");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Lỗi hệ thống khi đăng ký nhận tin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-[#1a1a1a] text-gray-200 mt-20 pt-12 pb-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-4">
                {/* Logo + desc + social */}
                <div>
                    <Link to="/client" className="flex items-center gap-2 mb-3">
                        <MapPin className="w-7 h-7 text-white" />
                        <span className="font-black text-2xl text-white">Tripeasy</span>
                    </Link>
                    <p className="text-gray-400 mb-4 text-base leading-relaxed">
                        Tripeasy là đơn vị lữ hành uy tín hàng đầu, chuyên cung cấp các tour du lịch trong nước với trải nghiệm văn hóa sâu sắc và dịch vụ đẳng cấp.
                    </p>
                    <div className="flex gap-3">
                        <a href="#" className="bg-gray-800 hover:bg-[#8B1A1A] p-2 rounded-full transition" aria-label="Facebook">
                            <Facebook className="w-5 h-5 text-white" />
                        </a>
                        <a href="#" className="bg-gray-800 hover:bg-[#8B1A1A] p-2 rounded-full transition" aria-label="Youtube">
                            <Youtube className="w-5 h-5 text-white" />
                        </a>
                        <a href="#" className="bg-gray-800 hover:bg-[#8B1A1A] p-2 rounded-full transition" aria-label="Instagram">
                            <Instagram className="w-5 h-5 text-white" />
                        </a>
                    </div>
                </div>

                {/* About */}
                <div>
                    <h4 className="font-bold text-xl mb-4 text-white">Về chúng tôi</h4>
                    <ul className="space-y-2.5 text-gray-400 text-base">
                        <li><Link to="/client/about" className="hover:text-white transition-colors">Giới thiệu</Link></li>
                        <li><Link to="/client/support?tab=team" className="hover:text-white transition-colors">Đội ngũ</Link></li>
                        <li><Link to="/client/careers" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
                        <li><Link to="/client/news" className="hover:text-white transition-colors">Tin tức</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="font-bold text-xl mb-4 text-white">Hỗ trợ khách hàng</h4>
                    <ul className="space-y-2.5 text-gray-400 text-base">
                        <li><Link to="/client/support?tab=faq" className="hover:text-white transition-colors">Trung tâm trợ giúp</Link></li>
                        <li><Link to="/client/support?tab=privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                        <li><Link to="/client/support?tab=terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
                        <li><Link to="/client/support?tab=refund" className="hover:text-white transition-colors">Chính sách hoàn tiền</Link></li>
                        <li><Link to="/client/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="font-bold text-xl mb-4 text-white">Đăng ký nhận tin</h4>
                    <p className="text-gray-400 mb-3 text-base">Nhận thông tin ưu đãi mới nhất từ Tripeasy.</p>
                    <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email của bạn"
                            disabled={loading}
                            className="bg-[#231313] text-gray-200 px-4 py-2 rounded-full outline-none border border-[#333] focus:border-[#8B1A1A] transition w-full text-base"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#8B1A1A] hover:bg-[#a83232] text-white px-5 py-2.5 rounded-full font-bold transition w-full text-base disabled:opacity-50 active:scale-[0.99]"
                        >
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-[#332222] mt-10 pt-4 px-4 text-gray-500 text-[15px] tracking-wide flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <span>© 2026 Tripeasy Vietnam. All rights reserved.</span>
                <span>
                    <Link to="/client/support?tab=privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    &nbsp;|&nbsp;
                    <Link to="/client/support?tab=terms" className="hover:text-white transition-colors">Terms of Service</Link>
                </span>
            </div>
        </footer>
    );
};

export default ClientFooter;
