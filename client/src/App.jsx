import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const ClientLayout = React.lazy(() => import('./layouts/ClientLayout'));

// Pages (có thể tạo file rỗng cho các page này)
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ClientHome = React.lazy(() => import('./pages/client/Home'));

const App = () => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route path="/" element={<Navigate to="/client" replace />} />
            <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                {/* Thêm các route admin khác tại đây */}
            </Route>
            <Route path="/client/*" element={<ClientLayout />}>
                <Route index element={<ClientHome />} />
                {/* Thêm các route client khác tại đây */}
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </React.Suspense>
);

export default App;