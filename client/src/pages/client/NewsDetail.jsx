import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, Tag, Share2 } from 'lucide-react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import { NEWS_POSTS } from '../../data/newsData';

const NewsDetail = () => {
    const { slug } = useParams();
    const post = useMemo(() => NEWS_POSTS.find((item) => item.slug === slug), [slug]);

    if (!post) {
        return (
            <div className="min-h-screen bg-[#FDFBF7]">
                <ClientNavbar />
                <main className="pt-20 px-6">
                    <div className="mx-auto max-w-4xl rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
                        Không tìm thấy bài viết. Vui lòng quay lại trang tin tức.
                    </div>
                    <div className="mt-6 text-center">
                        <Link to="/client/news" className="text-sm font-semibold text-[#8B1A1A]">
                            Quay lại Tin tức
                        </Link>
                    </div>
                </main>
                <ClientFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <ClientNavbar />

            <main className="pt-16">
                <section className="bg-white border-b border-gray-100">
                    <div className="mx-auto max-w-5xl px-6 py-12">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                            <Link to="/client/news" className="text-[#8B1A1A]">Tin tức</Link>
                            <span>•</span>
                            <span>{post.category}</span>
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-5xl">
                            {post.title}
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            {post.summary || post.excerpt}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> {post.date}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {post.readTime}
                            </span>
                            <div className="inline-flex items-center gap-2">
                                <Share2 className="h-4 w-4" /> Chia sẻ
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-6 py-12">
                    <div className="overflow-hidden rounded-3xl border border-[#F2E9E4] bg-white shadow-sm">
                        <div className="h-72 w-full md:h-96">
                            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-8">
                            <div className="flex flex-wrap gap-2">
                                {post.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-full bg-[#FDF0F0] px-3 py-1 text-xs font-semibold text-[#8B1A1A]"
                                    >
                                        <Tag className="h-3 w-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-6 grid gap-8 md:grid-cols-[0.7fr_0.3fr]">
                                <article className="space-y-8 text-base leading-relaxed text-gray-700 md:text-lg">
                                    {post.sections?.map((section) => (
                                        <div key={section.heading} className="space-y-4">
                                            <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
                                            {section.paragraphs?.map((text) => (
                                                <p key={text}>{text}</p>
                                            ))}
                                            {section.bullets && (
                                                <ul className="space-y-2">
                                                    {section.bullets.map((bullet) => (
                                                        <li key={bullet} className="flex items-start gap-2">
                                                            <span className="mt-2 h-2 w-2 rounded-full bg-[#8B1A1A]" />
                                                            <span>{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}

                                    {post.callout && (
                                        <div className="rounded-2xl border border-[#F3D4D4] bg-[#FFF7F7] p-5 text-base text-gray-700">
                                            <span className="font-semibold text-[#8B1A1A]">Ghi chú:</span> {post.callout}
                                        </div>
                                    )}

                                    {post.tips && (
                                        <div className="rounded-2xl border border-[#E8EEF8] bg-[#F6F9FF] p-5">
                                            <h3 className="text-xl font-semibold text-[#1E3A8A]">Mẹo hay</h3>
                                            <ul className="mt-3 space-y-2 text-gray-700">
                                                {post.tips.map((tip) => (
                                                    <li key={tip} className="flex items-start gap-2">
                                                        <span className="mt-2 h-2 w-2 rounded-full bg-[#1E3A8A]" />
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </article>

                                <aside className="space-y-6">
                                    <div className="rounded-2xl border border-gray-100 bg-[#FDFBF7] p-5">
                                        <h3 className="text-lg font-semibold text-gray-900">Mục lục</h3>
                                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                            {post.sections?.map((section) => (
                                                <li key={section.heading} className="flex items-start gap-2">
                                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8B1A1A]" />
                                                    <span>{section.heading}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                                        <h3 className="text-lg font-semibold text-gray-900">Gợi ý đọc thêm</h3>
                                        <ul className="mt-3 space-y-3 text-sm text-gray-600">
                                            {NEWS_POSTS.filter((item) => item.slug !== post.slug)
                                                .slice(0, 3)
                                                .map((item) => (
                                                    <li key={item.slug}>
                                                        <Link to={`/client/news/${item.slug}`} className="hover:text-[#8B1A1A]">
                                                            {item.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ClientFooter />
        </div>
    );
};

export default NewsDetail;
