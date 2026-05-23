import React from 'react';
import { Tag } from 'lucide-react';

const NewsSidebar = ({ categories }) => (
    <aside className="space-y-6">
        <div className="rounded-3xl border border-[#F2E9E4] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Nhận tin nổi bật</h3>
            <p className="mt-2 text-sm text-gray-600">
                Nhận thông tin tour mới, góc kinh nghiệm và ưu đãi độc quyền qua email.
            </p>
            <form className="mt-4 flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none transition focus:border-[#8B1A1A]"
                />
                <button
                    type="submit"
                    className="rounded-full bg-[#8B1A1A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a83232]"
                >
                    Đăng ký
                </button>
            </form>
        </div>
        <div className="rounded-3xl border border-[#F2E9E4] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Chủ đề nhanh</h3>
            <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                    <span
                        key={category}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600"
                    >
                        <Tag className="h-3 w-3 text-[#8B1A1A]" />
                        {category}
                    </span>
                ))}
            </div>
        </div>
    </aside>
);

export default NewsSidebar;
