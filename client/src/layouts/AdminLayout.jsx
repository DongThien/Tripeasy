import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="flex bg-[#F9F6F4] min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}