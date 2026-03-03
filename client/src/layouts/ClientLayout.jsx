import React from 'react';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                {/* Outlet chính là nơi Home.jsx sẽ được render vào */}
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout;