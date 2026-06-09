import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, MapPin, User, X as CloseIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../../services/axiosClient';
import userService from '../../services/userService';

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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Social Auth states
    const [showMockModal, setShowMockModal] = useState(false);
    const [mockProvider, setMockProvider] = useState("");
    const [mockEmail, setMockEmail] = useState("");
    const [mockName, setMockName] = useState("");

    const handleGoogleLoginSuccess = async (credential) => {
        try {
            const response = await userService.loginGoogle({ credential });
            handleSocialAuthResponse(response);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng nhập Google thất bại");
        }
    };

    const handleFacebookLoginSuccess = async (accessToken) => {
        try {
            const response = await userService.loginFacebook({ accessToken });
            handleSocialAuthResponse(response);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng nhập Facebook thất bại");
        }
    };

    const handleSocialAuthResponse = (response) => {
        const { success, data, message } = response || {};
        if (success) {
            localStorage.setItem('token', data?.token);
            localStorage.setItem('user', JSON.stringify(data?.user));
            toast.success(message || 'Đăng nhập thành công');
            window.dispatchEvent(new Event('storage'));
            const role = data?.user?.role;
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/client');
            }
        } else {
            toast.error(message || 'Đăng nhập thất bại');
        }
    };

    const handleMockSubmit = async (e) => {
        e.preventDefault();
        if (!mockEmail.trim()) {
            toast.error("Vui lòng nhập email");
            return;
        }
        try {
            let response;
            if (mockProvider === "google") {
                response = await userService.loginGoogle({
                    isMock: true,
                    mockEmail: mockEmail.trim(),
                    mockName: mockName.trim()
                });
            } else {
                response = await userService.loginFacebook({
                    isMock: true,
                    mockEmail: mockEmail.trim(),
                    mockName: mockName.trim()
                });
            }
            handleSocialAuthResponse(response);
            setShowMockModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng nhập giả lập thất bại");
        }
    };

    useEffect(() => {
        // Load Google GIS Script
        const googleScript = document.createElement("script");
        googleScript.src = "https://accounts.google.com/gsi/client";
        googleScript.async = true;
        googleScript.defer = true;
        document.body.appendChild(googleScript);

        googleScript.onload = () => {
            const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            if (googleClientId && window.google) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: (res) => {
                        handleGoogleLoginSuccess(res.credential);
                    },
                });
                
                const container = document.getElementById("googleBtnContainer");
                if (container) {
                    window.google.accounts.id.renderButton(container, {
                        theme: "outline",
                        size: "large",
                        width: 200,
                    });
                }
            }
        };

        // Load Facebook SDK
        const fbScript = document.createElement("script");
        fbScript.src = "https://connect.facebook.net/vi_VN/sdk.js";
        fbScript.async = true;
        fbScript.defer = true;
        document.body.appendChild(fbScript);

        fbScript.onload = () => {
            const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
            if (fbAppId && window.FB) {
                window.FB.init({
                    appId: fbAppId,
                    cookie: true,
                    xfbml: true,
                    version: "v18.0",
                });
            }
        };

        return () => {
            try {
                document.body.removeChild(googleScript);
                document.body.removeChild(fbScript);
            } catch (e) {
                // Ignore if already removed
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            toast.error('Vui lòng nhập email/số điện thoại và mật khẩu');
            return;
        }
        try {
            const response = await axiosClient.post('/users/login', { email, password });
            const { success, data, message } = response?.data || {};

            if (success) {
                localStorage.setItem('token', data?.token);
                localStorage.setItem('user', JSON.stringify(data?.user));
                toast.success(message || 'Đăng nhập thành công');
                const role = data?.user?.role;
                if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/client');
                }
                return;
            }

            toast.error(message || 'Đăng nhập thất bại');
        } catch (error) {
            const message = error?.response?.data?.message || 'Đăng nhập thất bại';
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
                            <h1 className="text-5xl font-bold tracking-tight text-[#111827]">Chào mừng trở lại!</h1>
                            <p className="mt-3 text-lg text-gray-500">
                                Tiếp tục hành trình khám phá Việt Nam cùng chúng tôi.
                            </p>

                            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Email hoặc Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            placeholder="example@email.com"
                                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-base text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/forgot-password')}
                                            className="text-sm font-medium text-[#8B1A1A] hover:underline"
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-11 text-base text-gray-700 outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#8B1A1A]"
                                            aria-label="Đổi trạng thái hiển thị mật khẩu"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-[#8B1A1A] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#a32626]"
                                >
                                    Đăng nhập
                                </button>
                            </form>

                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-sm text-gray-500">Hoặc tiếp tục với</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                 {/* Google Button */}
                                 <div className="relative inline-flex items-center justify-center">
                                     <button 
                                         type="button"
                                         onClick={() => {
                                             if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
                                                 setMockProvider("google");
                                                 setMockEmail("google-test@gmail.com");
                                                 setMockName("Google User Test");
                                                 setShowMockModal(true);
                                             }
                                         }}
                                         className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 cursor-pointer"
                                     >
                                         <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                                             <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.21 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                             <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z" />
                                             <path fill="#4CAF50" d="M24 44c5.168 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.147 35.091 26.676 36 24 36c-5.188 0-9.618-3.324-11.283-7.946l-6.522 5.025C9.5 39.556 16.227 44 24 44z" />
                                             <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.793 2.374-2.318 4.401-4.274 5.57l6.19 5.238C36.8 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                                         </svg>
                                         Google
                                     </button>
                                     {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                                         <div id="googleBtnContainer" className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden z-10"></div>
                                     )}
                                 </div>

                                 {/* Facebook Button */}
                                 <button 
                                     type="button"
                                     onClick={() => {
                                         const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
                                         if (fbAppId && window.FB) {
                                             window.FB.login((res) => {
                                                 if (res.authResponse) {
                                                     handleFacebookLoginSuccess(res.authResponse.accessToken);
                                                 }
                                             }, { scope: 'email' });
                                         } else {
                                             setMockProvider("facebook");
                                             setMockEmail("facebook-test@gmail.com");
                                             setMockName("Facebook User Test");
                                             setShowMockModal(true);
                                         }
                                     }}
                                     className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 cursor-pointer"
                                 >
                                     <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                         <path fill="#1877F2" d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.099 4.388 23.094 10.125 24v-8.438H7.078v-3.49h3.047V9.414c0-3.017 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.962h-1.514c-1.491 0-1.956.931-1.956 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.099 24 12.073z" />
                                     </svg>
                                     Facebook
                                 </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto mt-10 text-sm text-gray-500">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="font-bold text-[#8B1A1A] hover:underline">
                            Đăng ký ngay
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

            {/* Mock Login Modal for Developer / Local testing */}
            {showMockModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="relative w-[92%] max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#8B1A1A] text-xs font-bold text-white uppercase font-mono">
                                    {mockProvider === "google" ? "G" : "F"}
                                </span>
                                Đăng nhập {mockProvider === "google" ? "Google" : "Facebook"} Giả lập
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowMockModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="mt-3 text-xs text-gray-400 leading-relaxed bg-amber-50 text-amber-800 p-3.5 rounded-2xl border border-amber-100">
                            Hệ thống đang chạy ở chế độ **Phát triển (Local Dev)** và chưa được cấu hình Google Client ID hay Facebook App ID. Bạn có thể nhập thông tin tùy ý dưới đây để kiểm tra luồng tự động đăng nhập/đăng ký tài khoản mới.
                        </p>
                        <form className="mt-5 space-y-4" onSubmit={handleMockSubmit}>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Họ và tên</label>
                                <input
                                    type="text"
                                    value={mockName}
                                    onChange={(e) => setMockName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    value={mockEmail}
                                    onChange={(e) => setMockEmail(e.target.value)}
                                    placeholder="user-test@gmail.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition"
                                />
                            </div>
                            <div className="mt-6 flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowMockModal(false)}
                                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-[#8B1A1A] hover:bg-[#a32626] py-2.5 text-xs font-bold text-white transition cursor-pointer shadow-md shadow-red-950/10"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
