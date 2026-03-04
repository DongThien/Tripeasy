import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

const Header = () => (
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
            <div className="flex items-center gap-2 cursor-pointer">
                <img
                    src="https://randomuser.me/api/portraits/men/41.jpg"
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
        </div>
    </header>
);

export default Header;
