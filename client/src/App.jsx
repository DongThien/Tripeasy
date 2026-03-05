import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const ClientLayout = React.lazy(() => import('./layouts/ClientLayout'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const TourList = React.lazy(() => import('./pages/admin/TourList'));
const AddTour = React.lazy(() => import('./pages/admin/AddTour'));

// Client Pages
const ClientHome = React.lazy(() => import('./pages/client/Home'));

const App = () => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route path="/" element={<Navigate to="/client" replace />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="tours" element={<TourList />} />
                <Route path="tours/add" element={<AddTour />} />
                <Route path="bookings" element={<div>Bookings Page - Coming Soon</div>} />
                <Route path="customers" element={<div>Customers Page - Coming Soon</div>} />
                <Route path="settings" element={<div>Settings Page - Coming Soon</div>} />
                <Route path="contact" element={<div>Contact Page - Coming Soon</div>} />
            </Route>
            <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientHome />} />
                {/* Thêm các route client khác tại đây */}
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </React.Suspense>
);

export default App;