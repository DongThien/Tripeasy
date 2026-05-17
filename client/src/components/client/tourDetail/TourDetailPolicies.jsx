import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TourDetailPolicies = ({ tour }) => {
    // Hàm bảo vệ chống sập khi parse dữ liệu từ Database
    const ensureArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch { return [data]; }
        }
        return [];
    };

    const PolicySection = ({ title, items, isRed = false }) => {
        const validItems = ensureArray(items);
        if (validItems.length === 0) return null;

        return (
            <div className={`mb-6 last:mb-0 rounded-2xl border ${isRed ? 'border-[#F3D4D4] bg-[#FFF7F7]' : 'border-gray-100 bg-gray-50'} p-5`}>
                <h4 className={`text-lg font-bold mb-3 ${isRed ? 'text-[#8B1A1A]' : 'text-gray-900'}`}>{title}</h4>
                <ul className="space-y-3">
                    {validItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-base text-gray-700 leading-relaxed">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isRed ? 'bg-[#8B1A1A]' : 'bg-gray-400'}`} />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-8 border-l-4 border-[#8B1A1A] pl-4">
                <ShieldCheck className="w-6 h-6 text-[#8B1A1A]" />
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Chính sách & Lưu ý</h3>
            </div>

            <div className="animate-fadeIn">
                <PolicySection title="CHÍNH SÁCH TRẺ EM" items={tour?.policy_child} />

                {ensureArray(tour?.policy_child).length > 0 && <div className="h-px bg-gray-100 my-6" />}

                <PolicySection title="QUY ĐỊNH HOÀN HỦY" items={tour?.policy_cancel} isRed={true} />

                {ensureArray(tour?.policy_cancel).length > 0 && <div className="h-px bg-gray-100 my-6" />}

                <PolicySection title="LƯU Ý QUAN TRỌNG" items={tour?.policy_other} />
            </div>
        </div>
    );
};

export default TourDetailPolicies;