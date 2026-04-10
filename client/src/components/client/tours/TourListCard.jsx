import React from 'react';
import { Clock, Heart, MapPin, Star } from 'lucide-react';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')}đ`;

const TourListCard = ({ tour }) => (
    <article className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
            <img
                src={tour.image_url}
                alt={tour.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

            <div className="absolute left-3 top-3 flex gap-2">
                {tour.badges.map((badge) => (
                    <span
                        key={badge}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide text-white ${badge === 'ECO' ? 'bg-emerald-600' : 'bg-[#8B1A1A]'}`}
                    >
                        {badge}
                    </span>
                ))}
            </div>

            <button
                type="button"
                aria-label="Thả tim tour"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur transition hover:text-[#8B1A1A]"
            >
                <Heart className="h-4.5 w-4.5" />
            </button>
        </div>

        <div className="space-y-3 p-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-[#8B1A1A]" />
                <span>{tour.destination}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {tour.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {tour.rating} ({tour.reviews_count})
                </span>
            </div>

            <h3 className="line-clamp-2 text-lg font-bold text-gray-900">
                {tour.title}
            </h3>

            <div className="flex flex-wrap gap-2">
                {tour.tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-end justify-between gap-3 pt-1">
                <div>
                    {tour.old_price ? (
                        <div className="text-sm text-gray-400 line-through">
                            {formatCurrency(tour.old_price)}
                        </div>
                    ) : null}
                    <div className="text-xl font-bold text-[#8B1A1A]">
                        {formatCurrency(tour.price_adult)}
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

export default TourListCard;