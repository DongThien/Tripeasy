import React from 'react';
import { Check, X } from 'lucide-react';

const TourDetailServices = ({ included = [], excluded = [] }) => {
    return (
        <div className="space-y-6">
            {/* Section: Included */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="flex items-center gap-3 text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight border-l-4 border-green-600 pl-4">

                    Bao gồm
                </h4>

                {included.length === 0 ? (
                    <p className="text-gray-400 text-sm italic pl-4">Không có thông tin dịch vụ bao gồm.</p>
                ) : (
                    <ul className="space-y-3">
                        {included.map((item, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-4 text-base md:text-lg text-gray-700 bg-[#FDFBF7] p-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors"
                            >
                                <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                                    <Check className="w-4 h-4 stroke-[3]" />
                                </span>
                                <span className="leading-relaxed font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Section: Excluded */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="flex items-center gap-3 text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight border-l-4 border-[#8B1A1A] pl-4">
                    Không bao gồm
                </h4>

                {excluded.length === 0 ? (
                    <p className="text-gray-400 text-sm italic pl-4">Không có thông tin dịch vụ chưa bao gồm.</p>
                ) : (
                    <ul className="space-y-3">
                        {excluded.map((item, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-4 text-base md:text-lg text-gray-700 bg-[#FDFBF7] p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors"
                            >
                                <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-[#8B1A1A] flex-shrink-0">
                                    <X className="w-4 h-4 stroke-[3]" />
                                </span>
                                <span className="leading-relaxed font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TourDetailServices;