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
const AdminContacts = React.lazy(() => import('./pages/admin/AdminContacts'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));

// Client Pages
const ClientHome = React.lazy(() => import('./pages/client/Home'));
const ClientAbout = React.lazy(() => import('./pages/client/About'));
const ClientTourList = React.lazy(() => import('./pages/client/ClientTourList'));
const TourDetail = React.lazy(() => import('./pages/client/TourDetail'));
const Contact = React.lazy(() => import('./pages/client/Contact'));
const Careers = React.lazy(() => import('./pages/client/Careers'));
const News = React.lazy(() => import('./pages/client/News'));
const NewsDetail = React.lazy(() => import('./pages/client/NewsDetail'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const Checkout = React.lazy(() => import('./pages/client/Checkout'));
const MyBookings = React.lazy(() => import('./pages/client/MyBookings'));

// === THÊM COMPONENT BẢO VỆ NÀY ===
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Nếu không có Token hoặc không phải Admin -> Đuổi về trang đăng nhập
    if (!token || user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    // Nếu hợp lệ -> Cho phép đi vào giao diện Admin
    return children;
};

const App = () => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
            <Route path="/" element={<Navigate to="/client" replace />} />
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="tours" element={<TourList />} />
                <Route path="tours/add" element={<AddTour />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="contact" element={<AdminContacts />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientHome />} />
                <Route path="about" element={<ClientAbout />} />
                <Route path="tours" element={<ClientTourList />} />
                <Route path="tours/:id" element={<TourDetail />} />
                <Route path="tours/:id/checkout" element={<Checkout />} />
                <Route path="my-bookings" element={<MyBookings />} />
                <Route path="news" element={<News />} />
                <Route path="news/:slug" element={<NewsDetail />} />
                <Route path="careers" element={<Careers />} />
                <Route path="contact" element={<Contact />} />
                {/* Thêm các route client khác tại đây */}
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </React.Suspense>
);

export default App;
