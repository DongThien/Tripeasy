import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const ClientLayout = React.lazy(() => import('./layouts/ClientLayout'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const TourList = React.lazy(() => import('./pages/admin/TourList'));
const AddTour = React.lazy(() => import('./pages/admin/AddTour'));
const AdminBookings = React.lazy(() => import('./pages/admin/AdminBookings'));
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers'));

// Client Pages
const ClientHome = React.lazy(() => import('./pages/client/Home'));
const ClientAbout = React.lazy(() => import('./pages/client/About'));
const ClientTourList = React.lazy(() => import('./pages/client/ClientTourList'));
const TourDetail = React.lazy(() => import('./pages/client/TourDetail'));
const Contact = React.lazy(() => import('./pages/client/Contact'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));

const App = () => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
            <Route path="/" element={<Navigate to="/client" replace />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="tours" element={<TourList />} />
                <Route path="tours/add" element={<AddTour />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="settings" element={<div>Settings Page - Coming Soon</div>} />
                <Route path="contact" element={<div>Contact Page - Coming Soon</div>} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientHome />} />
                <Route path="about" element={<ClientAbout />} />
                <Route path="tours" element={<ClientTourList />} />
                <Route path="tours/:id" element={<TourDetail />} />
                <Route path="contact" element={<Contact />} />
                {/* Thêm các route client khác tại đây */}
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </React.Suspense>
);

export default App;