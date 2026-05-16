import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";

const Header = () => {
    const navigate = useNavigate();
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

    const displayName = user?.username || user?.name || user?.email || 'Admin';
    const displayRole = user?.role ? user.role.toUpperCase() : 'ADMIN';
    const avatarLabel = useMemo(() => {
        const source = (user?.username || user?.name || user?.email || 'TR').trim();
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
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white flex items-center justify-between px-8 border-b">
            <div className="flex items-center w-1/2">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-lg">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search for bookings, tours or customers..."
                        className="bg-transparent outline-none w-full text-sm"
                    />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Bell className="w-6 h-6 text-gray-500" />
                    <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B1A1A] text-xs font-semibold text-white">
                        {avatarLabel}
                    </span>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold text-gray-900">{displayName}</div>
                        <div className="text-xs text-gray-400">{displayRole}</div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="ml-2 inline-flex items-center gap-2 rounded-full border border-[#8B1A1A] px-3 py-1 text-xs font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
