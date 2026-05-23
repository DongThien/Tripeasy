import React from 'react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import NewsFeatured from '../../components/client/news/NewsFeatured';
import NewsHero from '../../components/client/news/NewsHero';
import NewsLatest from '../../components/client/news/NewsLatest';
import NewsSidebar from '../../components/client/news/NewsSidebar';
import { NEWS_POSTS } from '../../data/newsData';

const FEATURED_POST = NEWS_POSTS.find((post) => post.featured);
const POSTS = NEWS_POSTS.filter((post) => !post.featured);
const NEWS_CATEGORIES = ['Tất cả', ...new Set(NEWS_POSTS.map((post) => post.category))];
const TRENDING_TOPICS = NEWS_POSTS.map((post) => post.title).slice(0, 4);

const News = () => (
    <div className="min-h-screen bg-[#FDFBF7]">
        <ClientNavbar />

        <main className="pt-16">
            <NewsHero categories={NEWS_CATEGORIES} trendingTopics={TRENDING_TOPICS} />

            <section className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
                    {FEATURED_POST && <NewsFeatured post={FEATURED_POST} />}
                    <NewsSidebar categories={NEWS_CATEGORIES.slice(1)} />
                </div>
            </section>

            <NewsLatest posts={POSTS} />
        </main>

        <ClientFooter />
    </div>
);

export default News;
