import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";
import { formatVND as formatVNDHelper } from "../../../utils/formatHelper";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px #eee",
                padding: 12,
                color: "#8B1A1A",
                border: "1px solid #f3eaea"
            }}>
                <div style={{ fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 16 }}>
                    {formatVNDHelper(payload[0].value)}
                </div>
            </div>
        );
    }
    return null;
};

const RevenueChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-base border-2 border-dashed border-gray-200 rounded-xl">
                Chưa có dữ liệu
            </div>
        );
    }
    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B1A1A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontWeight: 500, fontSize: 13 }} />
                <YAxis tickFormatter={formatVNDHelper} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8B1A1A"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;
