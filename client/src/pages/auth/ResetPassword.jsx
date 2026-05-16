import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, MapPin, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../../services/axiosClient';

const HERO_SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80',
        location: 'Cầu Vàng, Đà Nẵng',
        title: '"Khám phá vẻ đẹp bất tận"',
        description: 'Việt Nam ẩn chứa những kỳ quan thiên nhiên đang chờ bạn trải nghiệm.',
    },
    {
        image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80',
        location: 'Sapa, Lào Cai',
        title: '"Săn mây giữa núi rừng"',
        description: 'Chạm vào thiên nhiên nguyên bản với hành trình đầy cảm hứng.',
    },
    {
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
        location: 'Ninh Bình, Việt Nam',
        title: '"Nơi thiên nhiên kể chuyện"',
        description: 'Mỗi cung đường mở ra một khung cảnh ngoạn mục đang chờ bạn khám phá.',
    },
];

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!token) {
            toast.error('Thiếu mã đặt lại mật khẩu');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const response = await axiosClient.post('/users/reset-password', {
                token,
                newPassword,
            });
            const { success, message } = response?.data || {};

            if (success) {
                toast.success(message || 'Đặt lại mật khẩu thành công');
                setTimeout(() => {
                    navigate('/login');
                }, 1200);
                return;
            }

            toast.error(message || 'Đặt lại mật khẩu thất bại');
        } catch (error) {
            const message = error?.response?.data?.message || 'Đặt lại mật khẩu thất bại';
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <div className="grid min-h-screen lg:grid-cols-2">
                <section className="flex min-h-screen flex-col bg-[#FDFBF7] px-6 py-10 md:px-10 lg:px-14">
                    <div className="w-full max-w-md mx-auto">
                        <Link to="/client" className="inline-flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#8B1A1A] text-lg font-bold text-white">
                                T
                            </span>
                            <span className="text-4xl font-bold text-[#111827]">Tripeasy</span>
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center">
                        <div className="w-full max-w-md mx-auto">
                            <h1 className="text-5xl font-bold tracking-tight text-[#111827]">Tạo mật khẩu mới</h1>
                            <p className="mt-3 text-lg text-gray-500">
                                Chọn một mật khẩu đủ mạnh để bảo vệ tài khoản của bạn.
                            </p>

                            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(event) => setNewPassword(event.target.value)}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-base text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(event) => setConfirmPassword(event.target.value)}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-base text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-[#8B1A1A] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#a32626]"
                                >
                                    Đặt lại mật khẩu
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto mt-10 text-sm text-gray-500">
                        Quay lại{' '}
                        <Link to="/login" className="font-bold text-[#8B1A1A] hover:underline">
                            Đăng nhập
                        </Link>
                    </div>
                </section>

                <section className="relative hidden min-h-screen overflow-hidden lg:block">
                    {HERO_SLIDES.map((slide, index) => (
                        <img
                            key={slide.image}
                            src={slide.image}
                            alt={slide.title}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-12 text-white">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-md">
                            <MapPin className="h-4 w-4" />
                            {HERO_SLIDES[currentSlide].location}
                        </span>

                        <h2 className="mt-4 max-w-md text-5xl font-bold leading-tight">
                            {HERO_SLIDES[currentSlide].title}
                        </h2>
                        <p className="mt-3 max-w-lg text-xl text-gray-200">
                            {HERO_SLIDES[currentSlide].description}
                        </p>

                        <div className="mt-7 flex items-center gap-2">
                            {HERO_SLIDES.map((slide, index) => (
                                <span
                                    key={slide.image}
                                    className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'w-10 bg-white' : 'w-6 bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ResetPassword;
