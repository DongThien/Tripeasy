import React from 'react';

const TourPagination = ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    filteredLength,
    onPageChange,
    getVisiblePages
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 border-t">
            <div>
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredLength)} trong số {filteredLength} tour
            </div>

            <div className="flex items-center gap-1">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded transition ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    Trước
                </button>

                {/* Page numbers */}
                {getVisiblePages().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="px-2 py-1">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded transition ${currentPage === page
                                    ? 'bg-[#8B1A1A] text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded transition ${currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default TourPagination;