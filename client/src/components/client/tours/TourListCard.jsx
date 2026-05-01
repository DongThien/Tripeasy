import React from 'react';
import { Clock, Heart, MapPin, Star } from 'lucide-react';

// Format currency to VND
const formatCurrency = (value) => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const TourListCard = ({ tour }) => {
    // Handle image - take first image from images array or use fallback
    const getImageUrl = () => {
        if (tour.images && tour.images.length > 0) {
            const firstImage = tour.images[0];
            // Handle both object and string formats
            if (typeof firstImage === 'object' && firstImage.image_url) {
                return firstImage.image_url;
            }
            if (typeof firstImage === 'string') {
                return firstImage;
            }
        }
        return tour.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
    };

    const imageUrl = getImageUrl();

    // Default values for optional fields
    const badges = tour.badges || [];
    const tags = tour.tags || [];
    const rating = tour.rating || null;
    const reviewsCount = tour.reviews_count || 0;
    const oldPrice = tour.old_price || null;
    const duration = tour.duration || 'Liên hệ';
    const destination = tour.destination || 'Không xác định';

    return (
        <article className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                <img
                    src={imageUrl}
                    alt={tour.title || 'Tour'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src =
                            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

                {/* Badges */}
                {badges.length > 0 && (
                    <div className="absolute left-3 top-3 flex gap-2">
                        {badges.map((badge) => (
                            <span
                                key={badge}
                                className={`rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide text-white ${badge === 'ECO' ? 'bg-emerald-600' : 'bg-[#8B1A1A]'
                                    }`}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    type="button"
                    aria-label="Thêm vào yêu thích"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur transition hover:text-[#8B1A1A]"
                >
                    <Heart className="h-4.5 w-4.5" />
                </button>
            </div>

            {/* Content */}
            <div className="space-y-3 p-4">
                {/* Destination */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-[#8B1A1A]" />
                    <span>{destination}</span>
                </div>

                {/* Duration & Rating */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {duration}
                    </span>
                    {rating ? (
                        <span className="inline-flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {rating.toFixed(1)} ({reviewsCount})
                        </span>
                    ) : null}
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 text-lg font-bold text-gray-900">
                    {tour.title || 'Tour không xác định'}
                </h3>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Price & Button */}
                <div className="flex items-end justify-between gap-3 pt-1">
                    <div>
                        {oldPrice ? (
                            <div className="text-sm text-gray-400 line-through">
                                {formatCurrency(oldPrice)}
                            </div>
                        ) : null}
                        <div className="text-xl font-bold text-[#8B1A1A]">
                            {formatCurrency(tour.price_adult || 0)}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="rounded-lg bg-[#8B1A1A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a62a2a]"
                    >
                        Đặt ngay
                    </button>
                </div>
            </div>
        </article>
    );
};

export default TourListCard;