import React from "react";
import { LayoutDashboard, Map, Ticket, Users, Settings, Phone } from "lucide-react";

const menu = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, active: true },
    { label: "Manage Tours", icon: <Map className="w-5 h-5" /> },
    { label: "Bookings", icon: <Ticket className="w-5 h-5" /> },
    { label: "Customers", icon: <Users className="w-5 h-5" /> },
    { label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Liên hệ", icon: <Phone className="w-5 h-5" /> },
];

const Sidebar = () => (
    <aside className="w-64 h-screen bg-white border-r flex flex-col fixed left-0 top-0 z-20">
        <div className="p-6 text-2xl font-bold text-[#8B1A1A]">Tripeasy Admin</div>
        <nav className="flex-1 px-2">
            <ul className="space-y-1 mt-2">
                {menu.map((item) => (
                    <li key={item.label}>
                        <a
                            href="#"
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${item.active ? "bg-red-50 text-[#8B1A1A] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="p-4 mt-auto flex items-center gap-3 border-t">
            <img
                src="https://randomuser.me/api/portraits/men/41.jpg"
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
            />
            <div>
                <div className="font-semibold text-gray-900">Alex Johnson</div>
                <div className="text-xs text-gray-400">Super Admin</div>
            </div>
        </div>
    </aside>
);

export default Sidebar;
