import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, Phone, Plane, ShieldCheck, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <div className="grid min-h-screen lg:grid-cols-2">
                <section className="flex min-h-screen flex-col bg-[#FDFBF7] px-6 py-10 md:px-10 lg:px-14">
                    <div className="w-full max-w-md mx-auto">
                        <Link to="/client" className="inline-flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#8B1A1A] text-white">
                                <Plane className="h-5 w-5" />
                            </span>
                            <span className="text-4xl font-bold text-[#111827]">Tripeasy</span>
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center">
                        <div className="w-full max-w-md mx-auto">
                            <h1 className="text-5xl font-bold tracking-tight text-[#111827]">Tạo tài khoản mới</h1>
                            <p className="mt-3 text-lg text-gray-500">
                                Tham gia cộng đồng du lịch lớn nhất Việt Nam.
                            </p>

                            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Họ và tên</label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Nguyễn Văn A"
                                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">Số điện thoại</label>
                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="0912 345 678"
                                                className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="ten@email.com"
                                                className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Mật khẩu</label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-start gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                                    />
                                    <span>
                                        Tôi đồng ý với <button type="button" className="text-[#8B1A1A]">Điều khoản sử dụng</button> và <button type="button" className="text-[#8B1A1A]">Chính sách bảo mật</button>
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-[#8B1A1A] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#a32626]"
                                >
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto mt-10 text-sm text-gray-500">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="font-bold text-[#8B1A1A] hover:underline">
                            Đăng nhập
                        </Link>
                    </div>
                </section>

                <section className="relative hidden min-h-screen overflow-hidden lg:block">
                    <img
                        src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80"
                        alt="Hành trình cùng Tripeasy"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-12 text-white">
                        <span className="inline-block h-1.5 w-12 rounded-full bg-white" />
                        <h2 className="mt-6 max-w-xl text-5xl font-bold leading-tight">
                            Hơn 10.000+ chuyến đi đang chờ bạn
                        </h2>
                        <p className="mt-3 max-w-lg text-xl text-gray-200">
                            Khám phá vẻ đẹp tiềm ẩn của Việt Nam và kết nối với những người bạn đồng hành tuyệt vời trên mọi nẻo đường.
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <img
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                                    alt="traveler 1"
                                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80"
                                    alt="traveler 2"
                                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                    alt="traveler 3"
                                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                                />
                            </div>
                            <div>
                                <div className="text-sm font-semibold">4.9/5 đánh giá</div>
                                <div className="text-yellow-400">★★★★★</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Register;