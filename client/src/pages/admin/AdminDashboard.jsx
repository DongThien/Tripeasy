// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import dashboardService from "../../services/dashboardService";
import MetricCards from "../../components/admin/MetricCards";
import RevenueAnalytics from "../../components/admin/RevenueAnalytics";
import TopSellingTours from "../../components/admin/TopSellingTours";
import RecentBookingsTable from "../../components/admin/RecentBookingsTable";

const formatVND = (num) =>
    num?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0₫";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTours: 0,
        newBookings: 0,
        totalUsers: 0,
    });
    const [topTours, setTopTours] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [statsRes, topToursRes, bookingsRes] = await Promise.all([
                    dashboardService.getOverviewStats(),
                    dashboardService.getTopTours(),
                    dashboardService.getRecentBookings(),
                ]);
                console.log('Dashboard stats:', statsRes);
                console.log('Top tours:', topToursRes);
                console.log('Recent bookings:', bookingsRes);
                setStats(statsRes);
                setTopTours(topToursRes);
                setRecentBookings(bookingsRes);
            } catch (err) {
                console.error('Dashboard API error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 text-lg">
                Đang tải dữ liệu hệ thống...
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-8 flex flex-col gap-6 bg-gray-50">
                    {/* Metric Cards */}
                    <MetricCards stats={stats} formatVND={formatVND} />

                    {/* Analytics & Top Tours */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <RevenueAnalytics />
                        <TopSellingTours tours={topTours} />
                    </div>

                    {/* Recent Bookings Table */}
                    <RecentBookingsTable bookings={recentBookings} formatVND={formatVND} />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;