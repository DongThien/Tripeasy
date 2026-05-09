import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const TourDetailServices = ({ included, excluded }) => (
    <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase tracking-tight"><CheckCircle2 className="w-5 h-5 text-green-600" /> Bao gồm</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {included.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">{item}</li>
                ))}
            </ul>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase tracking-tight"><XCircle className="w-5 h-5 text-[#8B1A1A]" /> Không bao gồm</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {excluded.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">{item}</li>
                ))}
            </ul>
        </div>
    </div>
);

export default TourDetailServices;