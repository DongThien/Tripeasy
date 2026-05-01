import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

const TourListPagination = ({ totalTours = 0, currentPage = 1, onPageChange = () => { } }) => {
    const totalPages = Math.ceil(totalTours / ITEMS_PER_PAGE);

    // Generate page numbers for pagination
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Add first page
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Add page range
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    // Hide pagination if no tours or only 1 page
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        onPageChange(Math.max(1, currentPage - 1));
    };

    const handleNext = () => {
        onPageChange(Math.min(totalPages, currentPage + 1));
    };

    const handlePageClick = (page) => {
        if (typeof page === 'number') {
            onPageChange(page);
        }
    };

    return (
        <div className="mt-10 flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`dots-${index}`} className="px-1 text-gray-400">
                            ...
                        </span>
                    );
                }

                const isActive = page === currentPage;
                return (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition ${isActive
                            ? 'border border-[#8B1A1A] bg-[#8B1A1A] text-white shadow-sm'
                            : 'border border-gray-200 bg-white text-gray-700 hover:border-[#8B1A1A] hover:text-[#8B1A1A]'
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export default TourListPagination;