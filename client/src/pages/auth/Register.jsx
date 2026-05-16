import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Phone, Plane, ShieldCheck, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../../services/axiosClient';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        const trimmed = typeof value === 'string' ? value.trim() : value;
        switch (name) {
            case 'fullName':
                return trimmed ? '' : 'Vui lòng nhập họ tên';
            case 'email':
                return trimmed ? '' : 'Vui lòng nhập email';
            case 'password':
                return trimmed ? '' : 'Vui lòng nhập mật khẩu';
            case 'confirmPassword':
                if (!trimmed) return 'Vui lòng xác nhận mật khẩu';
                return trimmed !== formData.password ? 'Mật khẩu xác nhận không khớp' : '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const nextErrors = {
            fullName: validateField('fullName', formData.fullName),
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
            confirmPassword: validateField('confirmPassword', formData.confirmPassword)
        };
        if (!formData.agreeTerms) {
            nextErrors.agreeTerms = 'Bạn cần đồng ý với Điều khoản và Chính sách';
        }
        setErrors(nextErrors);
        return Object.values(nextErrors).every((value) => !value);
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const nextValue = type === 'checkbox' ? checked : value;
        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
        }));
        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, nextValue),
            }));
        }
        if (name === 'password' && touched.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField('confirmPassword', formData.confirmPassword),
            }));
        }
    };

    const handleBlur = (event) => {
        const { name, value, type, checked } = event.target;
        const nextValue = type === 'checkbox' ? checked : value;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, nextValue),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validateForm();
        setTouched({
            fullName: true,
            email: true,
            password: true,
            confirmPassword: true,
            agreeTerms: true,
        });
        if (!isValid) return;

        try {
            const response = await axiosClient.post('/users/register', {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                agreeTerms: formData.agreeTerms,
            });
            const { success, message } = response?.data || {};

            if (success) {
                toast.success(message || 'Đăng ký thành công');
                setTimeout(() => {
                    navigate('/login');
                }, 1200);
                return;
            }

            toast.error(message || 'Đăng ký thất bại');
        } catch (error) {
            const message = error?.response?.data?.message || 'Đăng ký thất bại';
            toast.error(message);
        }
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
                                            onBlur={handleBlur}
                                            placeholder="Nguyễn Văn A"
                                            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:ring-2 ${errors.fullName && touched.fullName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#8B1A1A] focus:ring-[#8B1A1A]/20'}`}
                                        />
                                    </div>
                                    {errors.fullName && touched.fullName && (
                                        <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                                    )}
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
                                                onBlur={handleBlur}
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
                                                onBlur={handleBlur}
                                                placeholder="ten@email.com"
                                                className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:ring-2 ${errors.email && touched.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#8B1A1A] focus:ring-[#8B1A1A]/20'}`}
                                            />
                                        </div>
                                        {errors.email && touched.email && (
                                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Mật khẩu</label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="••••••••"
                                            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-11 text-sm text-gray-700 outline-none transition focus:ring-2 ${errors.password && touched.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#8B1A1A] focus:ring-[#8B1A1A]/20'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#8B1A1A]"
                                            aria-label="Đổi trạng thái hiển thị mật khẩu"
                                        >
                                            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="••••••••"
                                            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-11 text-sm text-gray-700 outline-none transition focus:ring-2 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#8B1A1A] focus:ring-[#8B1A1A]/20'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#8B1A1A]"
                                            aria-label="Đổi trạng thái hiển thị xác nhận mật khẩu"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <label className="flex items-start gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                                    />
                                    <span>
                                        Tôi đồng ý với{' '}
                                        <button
                                            type="button"
                                            onClick={() => setShowTerms(true)}
                                            className="text-[#8B1A1A] hover:underline"
                                        >
                                            Điều khoản sử dụng
                                        </button>{' '}
                                        và{' '}
                                        <button
                                            type="button"
                                            onClick={() => setShowPrivacy(true)}
                                            className="text-[#8B1A1A] hover:underline"
                                        >
                                            Chính sách bảo mật
                                        </button>
                                    </span>
                                </label>
                                {errors.agreeTerms && touched.agreeTerms && (
                                    <p className="text-xs text-red-500">{errors.agreeTerms}</p>
                                )}

                                <button
                                    type="submit"
                                    className={`w-full rounded-lg bg-[#8B1A1A] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#a32626] ${!formData.agreeTerms ? 'opacity-70' : ''}`}
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

            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
                    <div className="relative w-[92%] max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <button
                            type="button"
                            onClick={() => setShowTerms(false)}
                            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
                            aria-label="Đóng điều khoản"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-2xl font-bold text-[#111827]">Điều khoản sử dụng</h2>
                        <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-2 text-sm leading-6 text-gray-700">
                            <p>
                                Bằng việc đăng ký và sử dụng dịch vụ của Tripeasy, Quý khách xác nhận đã đọc, hiểu và đồng
                                ý tuân thủ các điều khoản dưới đây. Tripeasy có quyền cập nhật nội dung điều khoản để phù hợp
                                với quy định pháp luật và thực tiễn vận hành.
                            </p>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">1. Đặt chỗ và xác nhận giữ chỗ</h3>
                                <p className="mt-2">
                                    Yêu cầu đặt tour chỉ được xem là hợp lệ khi Tripeasy xác nhận bằng văn bản (email, tin nhắn
                                    hoặc thông báo trong tài khoản). Các suất giữ chỗ có thời hạn; nếu quá thời hạn thanh toán,
                                    Tripeasy có quyền hủy giữ chỗ mà không cần báo trước.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">2. Quy định thanh toán</h3>
                                <p className="mt-2">
                                    Quý khách cần thanh toán đúng thời hạn theo thông báo xác nhận. Tripeasy có thể yêu cầu đặt
                                    cọc để giữ chỗ; phần còn lại phải hoàn tất trước ngày khởi hành theo quy định của từng tour.
                                    Trường hợp chậm thanh toán có thể dẫn đến hủy giữ chỗ hoặc điều chỉnh giá theo tình trạng
                                    chỗ thực tế.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">3. Chính sách hoàn/hủy tour</h3>
                                <p className="mt-2">
                                    Phí hủy áp dụng theo thời điểm Quý khách thông báo hủy so với ngày khởi hành và điều kiện của
                                    từng tour (vé máy bay, khách sạn, dịch vụ liên quan). Các khoản phí đã phát sinh từ đối tác
                                    hoặc nhà cung cấp sẽ không được hoàn lại. Trong trường hợp bất khả kháng, Tripeasy sẽ phối hợp
                                    cùng Quý khách để điều chỉnh lịch trình hoặc cung cấp phương án thay thế phù hợp.
                                </p>
                            </div>
                            <p>
                                Việc tiếp tục sử dụng dịch vụ được xem là đồng ý với toàn bộ điều khoản. Nếu có thắc mắc, Quý
                                khách vui lòng liên hệ đội ngũ hỗ trợ của Tripeasy để được tư vấn.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowTerms(false)}
                            className="mt-6 w-full rounded-lg bg-[#8B1A1A] px-5 py-3 text-base font-semibold text-white hover:bg-[#a32626]"
                        >
                            Tôi đã hiểu
                        </button>
                    </div>
                </div>
            )}

            {showPrivacy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
                    <div className="relative w-[92%] max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <button
                            type="button"
                            onClick={() => setShowPrivacy(false)}
                            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
                            aria-label="Đóng chính sách bảo mật"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-2xl font-bold text-[#111827]">Chính sách bảo mật</h2>
                        <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-2 text-sm leading-6 text-gray-700">
                            <p>
                                Tripeasy cam kết bảo vệ dữ liệu cá nhân của Quý khách theo các tiêu chuẩn bảo mật cao và tuân thủ
                                quy định pháp luật hiện hành. Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp và quản lý
                                dịch vụ du lịch.
                            </p>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">1. Cam kết không bán dữ liệu</h3>
                                <p className="mt-2">
                                    Tripeasy tuyệt đối không mua bán, trao đổi hoặc cho thuê dữ liệu cá nhân của Quý khách dưới
                                    bất kỳ hình thức nào.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">2. Bảo mật và mã hóa dữ liệu</h3>
                                <p className="mt-2">
                                    Thông tin được lưu trữ trên hệ thống an toàn, áp dụng biện pháp mã hóa và kiểm soát truy cập.
                                    Chúng tôi thường xuyên rà soát, cập nhật để giảm thiểu rủi ro truy cập trái phép.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">3. Chia sẻ thông tin với đối tác</h3>
                                <p className="mt-2">
                                    Để thực hiện dịch vụ, Tripeasy có thể chia sẻ một phần thông tin cần thiết với đối tác như
                                    hãng bay, khách sạn hoặc đơn vị vận chuyển. Việc chia sẻ chỉ giới hạn trong phạm vi phục vụ
                                    chuyến đi và luôn đi kèm yêu cầu bảo mật nghiêm ngặt.
                                </p>
                            </div>
                            <p>
                                Quý khách có quyền yêu cầu cập nhật hoặc xóa dữ liệu theo quy định. Mọi thắc mắc về bảo mật vui
                                lòng liên hệ bộ phận hỗ trợ Tripeasy để được giải đáp.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPrivacy(false)}
                            className="mt-6 w-full rounded-lg bg-[#8B1A1A] px-5 py-3 text-base font-semibold text-white hover:bg-[#a32626]"
                        >
                            Tôi đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
