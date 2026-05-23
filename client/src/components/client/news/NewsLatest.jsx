import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsLatest = ({ posts }) => (
    <section className="bg-white/60 py-14">
        <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Bài viết mới nhất</h2>
                    <p className="mt-2 text-gray-600">
                        Cập nhật những nội dung du lịch được quan tâm nhất trong tuần.
                    </p>
                </div>
                <button className="rounded-full border border-[#8B1A1A] px-5 py-2 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white">
                    Xem tất cả
                </button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.title} className="overflow-hidden rounded-3xl border border-[#F2E9E4] bg-white shadow-sm">
                        <div className="relative">
                            <div className="aspect-[4/3] w-full">
                                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                            </div>
                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#8B1A1A]">
                                {post.category}
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                            <h3 className="mt-3 text-xl font-semibold text-gray-900">
                                {post.title}
                            </h3>
                            <p className="mt-3 text-sm text-gray-600">
                                {post.excerpt}
                            </p>
                            <Link
                                to={`/client/news/${post.slug}`}
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8B1A1A]"
                            >
                                Đọc tiếp
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

export default NewsLatest;
