import React from 'react';

const capitalizeSentences = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text
        .split(/([.!?]\s+)/)
        .map((part, index) => {
            if (index % 2 === 1) return part;
            const trimmed = part.trimStart();
            if (!trimmed) return part;
            return part.replace(trimmed[0], trimmed[0].toUpperCase());
        })
        .join('');
};

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
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900">{item.title}</h4>
                        <p className="text-lg md:text-xl text-gray-600 mt-2 leading-relaxed">
                            {capitalizeSentences(item.desc)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default TourDetailHighlights;