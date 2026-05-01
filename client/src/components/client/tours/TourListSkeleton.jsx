import React from 'react';

const SkeletonCard = () => (
    <div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Image Skeleton */}
        <div className="aspect-[4/3] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

        {/* Content Skeleton */}
        <div className="space-y-3 p-4">
            {/* Location */}
            <div className="h-4 w-24 rounded bg-gray-200" />

            {/* Info */}
            <div className="flex gap-3">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200" />
            </div>

            {/* Title */}
            <div className="space-y-2">
                <div className="h-5 w-full rounded bg-gray-200" />
                <div className="h-5 w-3/4 rounded bg-gray-200" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-gray-200" />
                <div className="h-6 w-20 rounded-full bg-gray-200" />
            </div>

            {/* Price & Button */}
            <div className="flex justify-between">
                <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-6 w-24 rounded bg-gray-200" />
                </div>
                <div className="h-10 w-20 rounded-lg bg-gray-200" />
            </div>
        </div>
    </div>
);

const TourListSkeleton = () => (
    <div>
        {/* Loading text */}
        <div className="mb-6 flex items-center justify-center gap-3 rounded-lg bg-blue-50 p-4">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <span className="text-blue-700 font-medium">Đang tải danh sách tour...</span>
        </div>

        {/* Grid of skeleton cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    </div>
);

export default TourListSkeleton;
