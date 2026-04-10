import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TourListPagination = () => (
    <div className="mt-10 flex items-center justify-center gap-2">
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]">
            <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B1A1A] bg-[#8B1A1A] font-semibold text-white shadow-sm">
            1
        </button>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]">
            2
        </button>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]">
            3
        </button>
        <span className="px-1 text-gray-400">...</span>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]">
            12
        </button>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]">
            <ChevronRight className="h-4 w-4" />
        </button>
    </div>
);

export default TourListPagination;