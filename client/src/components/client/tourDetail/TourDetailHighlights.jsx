import React from 'react';

const TourDetailHighlights = ({ highlights }) => (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight border-l-4 border-[#8B1A1A] pl-4">Điểm nhấn hành trình</h3>
        <div className="space-y-4">
            {highlights.map((item, index) => (
                <div key={index} className="p-5 bg-gray-50 rounded-2xl flex gap-4 border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-[#8B1A1A] text-white flex items-center justify-center shrink-0 font-bold text-sm">{index + 1}</div>
                    <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default TourDetailHighlights;