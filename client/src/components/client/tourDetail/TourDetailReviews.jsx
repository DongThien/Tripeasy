import React from 'react';
import { Star } from 'lucide-react';

const TourDetailReviews = () => (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
            <button className="text-sm font-medium text-[#8B1A1A]">Xem tất cả</button>
        </div>

        <article className="rounded-lg border border-gray-100 bg-[#FAF8F8] p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                        alt="Avatar khách hàng"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                        <div className="font-semibold text-gray-900">Anh Tuấn</div>
                        <div className="mt-1 inline-flex items-center gap-1 text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                        </div>
                    </div>
                </div>
                <span className="text-xs text-gray-400">12/10/2023</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">
                Chuyến đi rất tuyệt vời. Hướng dẫn viên nhiệt tình, hiểu biết sâu rộng về lịch sử.
                Khách sạn sạch sẽ, gần biển. Đồ ăn ngon. Cảm ơn Tripeasy!
            </p>
        </article>
    </section>
);

export default TourDetailReviews;