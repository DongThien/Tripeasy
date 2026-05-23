import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsFeatured = ({ post }) => (
    <article className="overflow-hidden rounded-3xl border border-[#F2E9E4] bg-white shadow-sm">
        <div className="relative">
            <div className="h-60 w-full md:h-72 lg:h-80">
                <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                />
            </div>
            <span className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#8B1A1A]">
                {post.category}
            </span>
        </div>
        <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                </span>
                <span>{post.readTime}</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {post.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
                {post.excerpt}
            </p>
            <Link
                to={`/client/news/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8B1A1A]"
            >
                Đọc bài viết
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    </article>
);

export default NewsFeatured;
