import React from 'react';
import { Flame } from 'lucide-react';

const NewsHero = ({ categories, trendingTopics }) => (
    <section className="relative overflow-hidden bg-[#111827] text-white">
        <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 -right-10 h-56 w-56 rounded-full bg-[#8B1A1A]/40" />
            <div className="absolute bottom-0 left-12 h-44 w-44 rounded-full bg-white/20" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                    <Flame className="h-4 w-4" />
                    Tin tức du lịch
                </span>
                <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                    Cập nhật nhanh nhất về{' '}
                    <span className="text-[#F8B4B4]">xu hướng</span> và{' '}
                    <span className="text-[#FDE68A]">cẩm nang</span> du lịch
                </h1>
                <p className="mt-4 text-lg text-white/80">
                    Tổng hợp tin tức,{' '}
                    <span className="font-semibold text-white">góc kinh nghiệm</span> và các nội dung{' '}
                    <span className="font-semibold text-white">truyền cảm hứng</span> cho chuyến đi sắp tới.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-sm rounded-3xl bg-white/10 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Chủ đề đang quan tâm</span>
                    <span>{trendingTopics.length} bài viết</span>
                </div>
                <div className="mt-5 space-y-3">
                    {trendingTopics.map((topic, index) => (
                        <div
                            key={topic}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                                {index + 1}
                            </span>
                            <p className="text-sm font-medium text-white/90">{topic}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default NewsHero;
