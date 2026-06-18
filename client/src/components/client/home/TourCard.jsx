import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatVND } from '../../../utils/formatHelper';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800";

const TourCard = ({ tour }) => {
    if (!tour) return null;

    const title = tour.title || tour.name || 'Đang cập nhật';
    const region = tour.region || tour.destination || 'Việt Nam';
    const duration = tour.duration || 'Liên hệ';

    // Xử lý ảnh an toàn
    let imageUrl = FALLBACK_IMG;
    if (tour.image_url) imageUrl = tour.image_url;
    else if (tour.image) imageUrl = tour.image;
    else if (Array.isArray(tour.images) && tour.images.length > 0) imageUrl = tour.images[0];

    const currentPrice = tour.price_adult ? formatVND(tour.price_adult) : (tour.price || 'Liên hệ');
    const oldPrice = tour.old_price ? formatVND(tour.old_price) : tour.oldPrice;

    // LINK CHUẨN (Không có /client/)
    const detailLink = `/client/tours/${tour.tour_id || tour.id}`;

    return (
        <Link
            to={detailLink}
            className="bg-white rounded-xl shadow overflow-hidden flex flex-col h-full group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="relative overflow-hidden flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />

                {tour.badge?.text && (
                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full ${tour.badge.color || 'bg-red-500'} shadow`}>
                        {tour.badge.text}
                    </span>
                )}

                <span className="absolute bottom-3 left-3 px-2 py-1 text-xs font-semibold bg-black/70 backdrop-blur-sm text-white rounded shadow-sm">
                    {duration}
                </span>
            </div>

            <div className="flex-1 flex flex-col p-4 justify-between">
                <div>
                    <div className="flex items-center gap-1 text-xs mb-2">
                        <MapPin className="w-3.5 h-3.5 text-[#8B1A1A]" />
                        <span className="font-semibold text-gray-500 uppercase tracking-wide">{region}</span>
                    </div>

                    <div className="min-h-[2.75rem] flex flex-col justify-start mb-3">
                        <h3 className="font-bold text-gray-900 text-base line-clamp-2 max-h-[2.8em] overflow-hidden group-hover:text-[#8B1A1A] transition-colors">
                            {title}
                        </h3>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex flex-col">
                        {oldPrice ? (
                            <span className="text-gray-400 text-xs line-through block">
                                {oldPrice}
                            </span>
                        ) : (
                            <span className="text-transparent text-xs block select-none">&nbsp;</span>
                        )}
                        <span className="text-[#8B1A1A] font-extrabold text-lg leading-none">{currentPrice}</span>
                    </div>
                    <div className="bg-red-50 p-2 rounded-full group-hover:bg-[#8B1A1A] transition-colors duration-300">
                        <ArrowRight className="w-5 h-5 text-[#8B1A1A] group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TourCard;