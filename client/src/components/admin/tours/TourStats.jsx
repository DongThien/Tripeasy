import React from 'react';
import { Map, CheckCircle2, Inbox } from "lucide-react";

const TourStats = ({ totalTours, activeTours, draftTours }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
                <Inbox className="w-8 h-8 text-[#8B1A1A]" />
                <div>
                    <div className="text-lg font-bold">{totalTours}</div>
                    <div className="text-gray-500 text-sm">Tổng số Tour</div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                    <div className="text-lg font-bold">{activeTours}</div>
                    <div className="text-gray-500 text-sm">Đang hoạt động</div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
                <Map className="w-8 h-8 text-gray-400" />
                <div>
                    <div className="text-lg font-bold">{draftTours}</div>
                    <div className="text-gray-500 text-sm">Bản nháp</div>
                </div>
            </div>
        </div>
    );
};

export default TourStats;