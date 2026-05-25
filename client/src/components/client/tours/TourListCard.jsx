import React from 'react';
import { Clock, Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";

const TourListCard = ({ tour, isFavorite = false, onToggleFavorite }) => {
    if (!tour) return null;

    // Lấy ảnh an toàn
    const getImageUrl = () => {
        if (tour.image_url) return tour.image_url;
        if (tour.image) return tour.image;
        if (Array.isArray(tour.images) && tour.images.length > 0) return tour.images[0];
        return FALLBACK_IMG;
    };

    const imageUrl = getImageUrl();
    const badges = tour.badges || [];
    const tags = tour.tags || [];
    const rating = tour.rating_avg || tour.rating || null;
    const reviewsCount = tour.review_count || tour.reviews_count || 0;

    // Đồng bộ trường dữ liệu DB
    const oldPrice = tour.old_price || tour.oldPrice || null;
    const currentPrice = tour.price_adult || tour.price || 0;
    const duration = tour.duration || 'Liên hệ';
    const destination = tour.destination || tour.region || 'Không xác định';
    const title = tour.title || tour.name || 'Tour không xác định';

    // LINK CHUẨN (Không có /client/)
    const tourLink = `/client/tours/${tour.tour_id || tour.id}`;

    return (
        <Link to={tourLink} className="block group">
            <article className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

                    {badges.length > 0 && (
                        <div className="absolute left-3 top-3 flex gap-2">
                            {badges.map((badge) => (
                                <span key={badge} className={`rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide text-white ${badge === 'ECO' ? 'bg-emerald-600' : 'bg-[#8B1A1A]'}`}>
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onToggleFavorite) {
                                onToggleFavorite(tour.tour_id || tour.id);
                            }
                        }}
                        className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition ${
                            isFavorite 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-500 hover:text-[#8B1A1A]'
                        }`}
                    >
                        <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <div className="space-y-3 p-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 text-[#8B1A1A]" />
                        <span>{destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {duration}
                        </span>
                        {rating ? (
                            <span className="inline-flex items-center gap-1.5">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {Number(rating).toFixed(1)} ({reviewsCount})
                            </span>
                        ) : null}
                    </div>

                    <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[#8B1A1A] transition-colors">
                        {title}
                    </h3>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-end justify-between gap-3 pt-1 border-t border-gray-50">
                        <div>
                            {oldPrice ? (
                                <div className="text-sm text-gray-400 line-through">
                                    {formatCurrency(oldPrice)}
                                </div>
                            ) : null}
                            <div className="text-xl font-bold text-[#8B1A1A]">
                                {formatCurrency(currentPrice)}
                            </div>
                        </div>

                        <button type="button" className="rounded-lg bg-[#8B1A1A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a62a2a]">
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default TourListCard;