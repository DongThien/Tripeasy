import React from 'react';
import { Calendar, Users } from 'lucide-react';

const formatPrice = (value) => `${value.toLocaleString('vi-VN')}đ`;

const TourDetailBookingSidebar = ({
    tour,
    departureDate,
    onDepartureDateChange,
    adultCount,
    childCount,
    onDecreaseAdult,
    onIncreaseAdult,
    onDecreaseChild,
    onIncreaseChild,
    totalPrice,
}) => (
    <aside className="space-y-4 lg:col-span-1">
        <div className="sticky top-24 rounded-xl bg-white p-5 shadow-xl ring-1 ring-gray-100 md:p-6">
            <div className="border-b border-gray-100 pb-4">
                <div className="text-sm text-gray-500">Giá ưu đãi từ</div>
                <div className="mt-1 flex items-end gap-2">
                    <span className="text-3xl font-bold text-[#8B1A1A]">{formatPrice(tour.price_adult)}</span>
                    <span className="text-sm text-gray-400 line-through">{formatPrice(tour.old_price)}</span>
                </div>
                <span className="mt-2 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Tiết kiệm 20%
                </span>
            </div>

            <div className="space-y-4 py-4">
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Ngày khởi hành
                    </label>
                    <div className="relative">
                        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(event) => onDepartureDateChange(event.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pl-10 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A]"
                        />
                    </div>
                </div>

                <div>
                    <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <Users className="h-3.5 w-3.5" />
                        Số lượng khách
                    </div>

                    <div className="space-y-2 rounded-lg border border-gray-100 bg-[#FAF8F8] p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-800">Người lớn</div>
                                <div className="text-xs text-gray-500">&gt; 12 tuổi</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onDecreaseAdult}
                                    className="h-7 w-7 rounded-full border border-gray-200 text-gray-600 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
                                >
                                    -
                                </button>
                                <span className="min-w-5 text-center text-sm font-semibold">{adultCount}</span>
                                <button
                                    type="button"
                                    onClick={onIncreaseAdult}
                                    className="h-7 w-7 rounded-full border border-gray-200 text-gray-600 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-800">Trẻ em</div>
                                <div className="text-xs text-gray-500">5 - 11 tuổi</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onDecreaseChild}
                                    className="h-7 w-7 rounded-full border border-gray-200 text-gray-600 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
                                >
                                    -
                                </button>
                                <span className="min-w-5 text-center text-sm font-semibold">{childCount}</span>
                                <button
                                    type="button"
                                    onClick={onIncreaseChild}
                                    className="h-7 w-7 rounded-full border border-gray-200 text-gray-600 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-gray-600">Tổng cộng</span>
                    <span className="text-2xl font-bold text-[#8B1A1A]">{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-2">
                    <button className="w-full rounded-lg bg-[#8B1A1A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a32626]">
                        Đặt ngay
                    </button>
                    <button className="w-full rounded-lg border border-[#8B1A1A] px-4 py-3 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white">
                        Liên hệ tư vấn
                    </button>
                </div>
            </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            <strong>Cần hỗ trợ?</strong>
            <div>Gọi ngay hotline 1900 1234 để được tư vấn miễn phí.</div>
        </div>
    </aside>
);

export default TourDetailBookingSidebar;