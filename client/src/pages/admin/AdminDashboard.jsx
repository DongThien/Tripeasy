// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";
import MetricCards from "../../components/admin/MetricCards";
import RevenueAnalytics from "../../components/admin/RevenueAnalytics";
import TopSellingTours from "../../components/admin/TopSellingTours";
import RecentBookingsTable from "../../components/admin/RecentBookingsTable";
import RevenueChart from "../../components/admin/RevenueChart";
import { formatVND } from "../../utils/formatHelper";

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
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [statsRes, topToursRes, bookingsRes, chartRes] = await Promise.all([
                    dashboardService.getOverviewStats(),
                    dashboardService.getTopTours(),
                    dashboardService.getRecentBookings(),
                    dashboardService.getRevenueChartData(),
                ]);
                setStats(statsRes);
                setTopTours(topToursRes);
                setRecentBookings(bookingsRes);
                setChartData(chartRes);
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
            <div className="flex items-center justify-center h-96 text-lg">
                Đang tải dữ liệu hệ thống...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Metric Cards */}
            <MetricCards stats={stats} formatVND={formatVND} />

            {/* Analytics & Top Tours */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueAnalytics>
                        <RevenueChart data={chartData} formatVND={formatVND} />
                    </RevenueAnalytics>
                </div>
                <div className="lg:col-span-1">
                    <TopSellingTours tours={topTours} />
                </div>
            </div>

            {/* Recent Bookings Table */}
            <RecentBookingsTable bookings={recentBookings} formatVND={formatVND} />
        </div>
    );
};

export default AdminDashboard;