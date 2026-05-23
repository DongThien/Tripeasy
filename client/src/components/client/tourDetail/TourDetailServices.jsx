import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const TourDetailServices = ({ included, excluded }) => (
    <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="flex items-center gap-2 text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Bao gồm
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {included.map((item, i) => (
                    <li key={i} className="flex gap-3 text-lg md:text-xl text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600/70 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="flex items-center gap-2 text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                <XCircle className="w-5 h-5 text-[#8B1A1A]" /> Không bao gồm
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {excluded.map((item, i) => (
                    <li key={i} className="flex gap-3 text-lg md:text-xl text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#8B1A1A]/70 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default TourDetailServices;