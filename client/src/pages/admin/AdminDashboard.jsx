// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";
import MetricCards from "../../components/admin/dashboard/MetricCards";
import RevenueAnalytics from "../../components/admin/dashboard/RevenueAnalytics";
import TopSellingTours from "../../components/admin/dashboard/TopSellingTours";
import RecentBookingsTable from "../../components/admin/dashboard/RecentBookingsTable";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
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
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [statsRes, topToursRes, bookingsRes] = await Promise.all([
                    dashboardService.getOverviewStats(),
                    dashboardService.getTopTours(),
                    dashboardService.getRecentBookings(),
                ]);
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

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const chartRes = await dashboardService.getRevenueChartData(startDate, endDate);
                setChartData(chartRes);
            } catch (err) {
                console.error('Chart API error:', err);
            }
        };
        fetchChartData();
    }, [startDate, endDate]);

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
                    <RevenueAnalytics
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                    >
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