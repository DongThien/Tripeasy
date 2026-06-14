import React from 'react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { getTodayDateString, calculateEndDate } from '../../../utils/dateHelper';

const TourDeparturesSection = ({ departures, addDeparture, removeDeparture, updateDeparture, duration }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <CalendarDays className="w-5 h-5 text-[#8B1A1A]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Lịch khởi hành</h3>
                        <p className="text-xs text-gray-500">Tạo danh sách các ngày khách hàng có thể đặt tour</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={addDeparture}
                    className="flex items-center gap-2 px-4 py-2 text-[#8B1A1A] hover:bg-red-50 rounded-lg transition-colors border border-[#8B1A1A]/20"
                >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium text-sm">Thêm ngày đi</span>
                </button>
            </div>

            <div className="space-y-3">
                {departures.map((dep, index) => (
                    <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Ngày đi</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#8B1A1A]"
                                value={dep.start_date}
                                min={getTodayDateString()}
                                onChange={(e) => {
                                    const newStart = e.target.value;
                                    updateDeparture(index, 'start_date', newStart);
                                    if (duration && newStart) {
                                        const calculatedEnd = calculateEndDate(newStart, duration);
                                        if (calculatedEnd) {
                                            updateDeparture(index, 'end_date', calculatedEnd);
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Ngày về</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#8B1A1A]"
                                value={dep.end_date}
                                min={dep.start_date || getTodayDateString()}
                                onChange={(e) => updateDeparture(index, 'end_date', e.target.value)}
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Số chỗ</label>
                            <input
                                type="number"
                                placeholder="20"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#8B1A1A]"
                                value={dep.stock}
                                onChange={(e) => updateDeparture(index, 'stock', e.target.value)}
                            />
                        </div>
                        <div className="pt-5">
                            <button
                                type="button"
                                onClick={() => removeDeparture(index)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TourDeparturesSection;