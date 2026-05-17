import React from 'react';

const TourDetailHighlights = ({ highlights }) => (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight border-l-4 border-[#8B1A1A] pl-4">
            Điểm nhấn hành trình
        </h3>
        <div className="space-y-5">
            {highlights.map((item, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-2xl flex gap-4 border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#8B1A1A] text-white flex items-center justify-center shrink-0 font-bold text-base">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                        <p className="text-base text-gray-600 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default TourDetailHighlights;