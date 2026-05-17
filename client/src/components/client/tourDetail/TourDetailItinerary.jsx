import React, { useState } from 'react';
import { Utensils, ChevronDown, ChevronUp } from 'lucide-react';

const TourDetailItinerary = ({ itinerary }) => {
    if (!itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
        return (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                Chưa có thông tin lịch trình chi tiết cho tour này.
            </div>
        );
    }

    const [expandedDays, setExpandedDays] = useState([0]);

    const toggleDay = (index) => {
        setExpandedDays((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    // Hàm tự động quét và format màu sắc văn bản
    const formatActivities = (content) => {
        if (!content) return null;

        const lines = Array.isArray(content) ? content : content.split('\n');

        return lines
            .filter((line) => line.trim() !== '')
            .map((line, idx) => {
                let htmlStr = line;
                let isMainPoint = false;

                // 1. Dò mốc thời gian đầu dòng -> Xanh đậm & Đánh dấu đây là dòng CHÍNH (Cần thụt lề)
                const timeRegex = /^(Sáng:|Trưa:|Chiều:|Tối:|Sáng|Trưa|Chiều|Tối|\d{1,2}[hH]\d{2}:?)/i;
                if (timeRegex.test(htmlStr)) {
                    isMainPoint = true;
                    htmlStr = htmlStr.replace(
                        timeRegex,
                        "<strong class='text-[#004b87] uppercase mr-1'>$&</strong>"
                    );
                }

                // 2. Highlight từ khóa Ăn uống (Ăn sáng, Ăn trưa, Ăn tối...) ở BẤT CỨ ĐÂU -> Đỏ đậm
                htmlStr = htmlStr.replace(
                    /(Ăn sáng|Ăn trưa|Ăn tối|Dùng bữa sáng|Dùng bữa trưa|Dùng bữa tối)/gi,
                    "<strong class='text-[#8B1A1A]'>$&</strong>"
                );

                // 3. Highlight địa danh trong ngoặc kép " " hoặc “ ” -> Xanh đậm
                htmlStr = htmlStr.replace(
                    /(["“])([^"”]+)(["”])/g,
                    "<strong class='text-[#004b87]'>$1$2$3</strong>"
                );

                // 4. Highlight nội dung trong ngoặc đơn ( ) -> Đỏ mận, in nghiêng
                htmlStr = htmlStr.replace(
                    /\(([^)]+)\)/g,
                    "<span class='text-[#8B1A1A] font-medium italic'>($1)</span>"
                );

                // KẾT QUẢ RENDER: Dòng chính thì lùi vào & có dấu chấm. Dòng phụ thì sát lề.
                if (isMainPoint) {
                    return (
                        <div key={idx} className="relative pl-6 mb-3.5 text-gray-800 text-[16px] md:text-[17px] leading-relaxed text-justify">
                            {/* Căn chỉnh dấu chấm cho khớp với dòng chữ to hơn */}
                            <span className="absolute left-0 top-[11px] h-1.5 w-1.5 rounded-full bg-[#8B1A1A]"></span>
                            <span dangerouslySetInnerHTML={{ __html: htmlStr }} />
                        </div>
                    );
                } else {
                    return (
                        <div key={idx} className="mb-3.5 text-gray-800 text-[16px] md:text-[17px] leading-relaxed text-justify">
                            <span dangerouslySetInnerHTML={{ __html: htmlStr }} />
                        </div>
                    );
                }
            });
    };

    return (
        <div className="mt-12" id="itinerary">
            <h2 className="text-2xl font-extrabold text-[#111827] mb-8 uppercase tracking-wide">
                Chương trình tour
            </h2>

            <div className="relative border-l-[3px] border-[#8B1A1A]/20 ml-3 md:ml-4 space-y-6">
                {itinerary.map((day, index) => {
                    const isExpanded = expandedDays.includes(index);

                    const rawDay = day.day ? String(day.day).toUpperCase() : '';
                    const dayLabel = rawDay.includes('NGÀY') ? rawDay : `NGÀY ${rawDay || index + 1}`;

                    return (
                        <div key={index} className="relative pl-8 md:pl-10">
                            <span className="absolute -left-[13px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#8B1A1A] ring-[6px] ring-white shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                            </span>

                            <div
                                onClick={() => toggleDay(index)}
                                className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${isExpanded
                                        ? 'border-[#8B1A1A]/30 bg-white shadow-md ring-1 ring-[#8B1A1A]/10'
                                        : 'border-gray-100 bg-gray-50/80 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex flex-wrap items-center justify-between p-5 md:px-7 gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="inline-block rounded-md bg-[#8B1A1A] px-3 py-1 text-[13px] font-bold text-white tracking-wide whitespace-nowrap">
                                                {dayLabel}
                                            </span>
                                            <h3 className={`text-lg md:text-[19px] font-bold uppercase leading-snug transition-colors ${isExpanded ? 'text-[#8B1A1A]' : 'text-gray-900'}`}>
                                                {day.title || 'Lịch trình tham quan chi tiết'}
                                            </h3>
                                        </div>

                                        {day.meals && (
                                            <div className="mt-2.5">
                                                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 bg-gray-200/60 px-2.5 py-1 rounded-md">
                                                    <Utensils className="h-3.5 w-3.5 text-[#8B1A1A]" />
                                                    Bữa ăn: <strong className="text-gray-800">{day.meals}</strong>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isExpanded ? 'bg-[#8B1A1A]/10 text-[#8B1A1A]' : 'bg-gray-200/70 text-gray-500'}`}>
                                        {isExpanded ? <ChevronUp size={20} strokeWidth={2.5} /> : <ChevronDown size={20} strokeWidth={2.5} />}
                                    </div>
                                </div>

                                <div className={`grid transition-all duration-[400ms] ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="p-5 md:p-7 md:pt-2 border-t border-gray-100 bg-white">
                                            {/* Xóa thẻ <ul> đi vì chúng ta chuyển sang dùng <div> riêng lẻ cho từng đoạn */}
                                            <div className="space-y-1">
                                                {formatActivities(day.activities || day.content || day.description)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TourDetailItinerary;