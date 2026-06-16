import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Search, Menu, X, User, Lock, Trash2, Settings } from 'lucide-react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

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

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState("profile"); // "profile" | "password" | "delete"
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [navbarSearchVal, setNavbarSearchVal] = useState("");

    const handleNavbarSearch = () => {
        if (navbarSearchVal.trim()) {
            sessionStorage.removeItem('tripeasy_client_tours_page');
            navigate(`/client/tours?q=${encodeURIComponent(navbarSearchVal.trim())}`);
            setSearchExpanded(false);
            setNavbarSearchVal("");
        }
    };

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'user' || event.type === 'storage') {
                const raw = localStorage.getItem('user');
                const nextUser = raw ? JSON.parse(raw) : null;
                setUser(nextUser);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-dropdown-container')) {
                setDropdownOpen(false);
            }
            if (!e.target.closest('.navbar-search-container')) {
                setSearchExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
        setDropdownOpen(false);
        navigate('/login');
    };

    const handleUserUpdate = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow z-30 font-sans">
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
                            onClick={() => {
                                if (to === '/client/tours') {
                                    sessionStorage.removeItem('tripeasy_client_tours_page');
                                }
                            }}
                            className={`hover:text-[#8B1A1A] transition-colors ${pathname === to ? 'text-[#8B1A1A] font-semibold' : ''
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center relative navbar-search-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tour..."
                            value={navbarSearchVal}
                            onChange={(e) => setNavbarSearchVal(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleNavbarSearch();
                                }
                            }}
                            className={`bg-gray-50 border border-gray-250 text-xs rounded-full py-1.5 pl-4 pr-10 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                                searchExpanded ? 'w-48 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-4 pointer-events-none'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (searchExpanded) {
                                    if (navbarSearchVal.trim()) {
                                        handleNavbarSearch();
                                    } else {
                                        setSearchExpanded(false);
                                    }
                                } else {
                                    setSearchExpanded(true);
                                }
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 transition ml-1"
                        >
                            <Search className="w-5 h-5 text-gray-750" />
                        </button>
                    </div>
                    {user ? (
                        <div className="hidden md:flex items-center gap-3">
                            {/* User Profile Dropdown Trigger */}
                            <div className="relative user-dropdown-container">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3 py-1.5 cursor-pointer transition select-none"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B1A1A] text-xs font-semibold text-white">
                                        {avatarLabel}
                                    </span>
                                    <span className="max-w-[140px] truncate text-sm font-semibold text-gray-750">
                                        {displayName}
                                    </span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 py-2 divide-y divide-gray-100 animate-in fade-in duration-200">
                                        <div className="px-4 py-2 flex flex-col gap-0.5">
                                            <div className="text-xs font-bold text-gray-800 truncate">{displayName}</div>
                                            <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/client/my-bookings"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50/50 hover:text-[#8B1A1A]"
                                            >
                                                Lịch sử đặt tour
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSettingsTab("profile");
                                                    setIsSettingsOpen(true);
                                                    setDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50/50 hover:text-[#8B1A1A] border-0 bg-transparent cursor-pointer"
                                            >
                                                Cập nhật profile
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSettingsTab("password");
                                                    setIsSettingsOpen(true);
                                                    setDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50/50 hover:text-[#8B1A1A] border-0 bg-transparent cursor-pointer"
                                            >
                                                Thay đổi mật khẩu
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSettingsTab("delete");
                                                    setIsSettingsOpen(true);
                                                    setDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/50 border-0 bg-transparent cursor-pointer"
                                            >
                                                Xóa tài khoản
                                            </button>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-xs font-semibold text-[#8B1A1A] hover:bg-red-50/50 border-0 bg-transparent cursor-pointer"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                            onClick={() => {
                                setMobileOpen(false);
                                if (to === '/client/tours') {
                                    sessionStorage.removeItem('tripeasy_client_tours_page');
                                }
                            }}
                            className={`font-medium transition-colors ${pathname === to ? 'text-[#8B1A1A] font-semibold' : 'text-gray-700'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                    {user ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 rounded-2xl border border-gray-150 p-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1A1A] text-sm font-semibold text-white">
                                    {avatarLabel}
                                </span>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800">{displayName}</div>
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
                                <Link
                                    to="/client/my-bookings"
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full text-left py-2 px-3 text-xs font-semibold text-gray-700 hover:bg-red-50/50 hover:text-[#8B1A1A] rounded-xl"
                                >
                                    Lịch sử đặt tour
                                </Link>
                                <button
                                    onClick={() => {
                                        setSettingsTab("profile");
                                        setIsSettingsOpen(true);
                                        setMobileOpen(false);
                                    }}
                                    className="block w-full text-left py-2 px-3 text-xs font-semibold text-gray-700 hover:bg-red-50/50 hover:text-[#8B1A1A] rounded-xl border-0 bg-transparent cursor-pointer"
                                >
                                    Cập nhật profile
                                </button>
                                <button
                                    onClick={() => {
                                        setSettingsTab("password");
                                        setIsSettingsOpen(true);
                                        setMobileOpen(false);
                                    }}
                                    className="block w-full text-left py-2 px-3 text-xs font-semibold text-gray-700 hover:bg-red-50/50 hover:text-[#8B1A1A] rounded-xl border-0 bg-transparent cursor-pointer"
                                >
                                    Thay đổi mật khẩu
                                </button>
                                <button
                                    onClick={() => {
                                        setSettingsTab("delete");
                                        setIsSettingsOpen(true);
                                        setMobileOpen(false);
                                    }}
                                    className="block w-full text-left py-2 px-3 text-xs font-semibold text-red-600 hover:bg-red-50/50 rounded-xl border-0 bg-transparent cursor-pointer"
                                >
                                    Xóa tài khoản
                                </button>
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

            {/* Account Settings Modal */}
            <AccountSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
                onUserUpdate={handleUserUpdate}
                activeTab={settingsTab}
                setActiveTab={setSettingsTab}
            />
        </header>
    );
};

// Modal Component for Account Settings
const AccountSettingsModal = ({ isOpen, onClose, user, onUserUpdate, activeTab, setActiveTab }) => {
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Password fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Delete fields
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setPhone(user.phone || "");
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error("Họ và tên không được để trống");
            return;
        }
        setIsUpdatingProfile(true);
        try {
            const res = await userService.updateUser(user.id, { username, phone_number: phone });
            if (res.success) {
                toast.success("Cập nhật thông tin thành công!");
                onUserUpdate({ ...user, username, phone });
                onClose();
            } else {
                toast.error(res.message || "Lỗi cập nhật thông tin");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Lỗi cập nhật");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ các trường");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải dài tối thiểu 6 ký tự");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return;
        }
        setIsUpdatingPassword(true);
        try {
            const res = await userService.changePassword(user.id, currentPassword, newPassword);
            if (res.success) {
                toast.success("Thay đổi mật khẩu thành công!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                onClose();
            } else {
                toast.error(res.message || "Lỗi đổi mật khẩu");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Mật khẩu hiện tại không đúng");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleDeleteAccountSubmit = async (e) => {
        e.preventDefault();
        if (confirmText !== "DELETE") {
            toast.error("Vui lòng nhập đúng 'DELETE' để xác nhận");
            return;
        }
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này vĩnh viễn không? Hành động này sẽ xóa mọi đơn hàng và không thể phục hồi!")) {
            return;
        }
        setIsDeleting(true);
        try {
            const res = await userService.deleteUser(user.id);
            if (res.success) {
                toast.success("Xóa tài khoản thành công!");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            } else {
                toast.error(res.message || "Lỗi xóa tài khoản");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Lỗi xóa tài khoản");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 bg-[#8B1A1A] text-white flex items-center justify-between">
                    <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                        <Settings className="w-4 h-4" />
                        Thiết lập tài khoản
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1
                            ${activeTab === "profile" 
                                ? "border-[#8B1A1A] text-[#8B1A1A] bg-white" 
                                : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        <User className="w-3.5 h-3.5" />
                        Thông tin
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("password")}
                        className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1
                            ${activeTab === "password" 
                                ? "border-[#8B1A1A] text-[#8B1A1A] bg-white" 
                                : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        <Lock className="w-3.5 h-3.5" />
                        Mật khẩu
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("delete")}
                        className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1
                            ${activeTab === "delete" 
                                ? "border-red-650 text-red-650 bg-white" 
                                : "border-transparent text-gray-500 hover:text-red-500"}`}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa account
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Tab: Profile */}
                    {activeTab === "profile" && (
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Họ và tên</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Nhập họ và tên..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Số điện thoại</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-450 uppercase">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full bg-gray-100 border border-gray-200 text-gray-400 rounded-xl px-4 py-2 text-sm cursor-not-allowed"
                                />
                                <span className="text-[10px] text-gray-400 block px-1">Email tài khoản không thể chỉnh sửa.</span>
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdatingProfile}
                                className="w-full bg-[#8B1A1A] hover:bg-[#A32222] text-white py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md shadow-red-950/10"
                            >
                                {isUpdatingProfile ? "Đang cập nhật..." : "Lưu thay đổi"}
                            </button>
                        </form>
                    )}

                    {/* Tab: Password */}
                    {activeTab === "password" && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Tối thiểu 6 ký tự..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdatingPassword}
                                className="w-full bg-[#8B1A1A] hover:bg-[#A32222] text-white py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md shadow-red-950/10"
                            >
                                {isUpdatingPassword ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                            </button>
                        </form>
                    )}

                    {/* Tab: Delete Account */}
                    {activeTab === "delete" && (
                        <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
                            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs leading-relaxed border border-red-105 space-y-2">
                                <p className="font-bold flex items-center gap-1">
                                    ⚠️ Cảnh báo nguy hiểm!
                                </p>
                                <p>Hành động này **không thể hoàn tác**. Toàn bộ thông tin tài khoản, lịch sử đặt tour, đánh giá và dữ liệu chat của bạn sẽ bị **xóa sạch vĩnh viễn** khỏi hệ thống.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">
                                    Vui lòng nhập <span className="text-red-650 font-extrabold">DELETE</span> để xác nhận
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition font-bold tracking-wider"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isDeleting || confirmText !== "DELETE"}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md shadow-red-950/10"
                            >
                                {isDeleting ? "Đang xóa..." : "Xác nhận xóa tài khoản vĩnh viễn"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientNavbar;
