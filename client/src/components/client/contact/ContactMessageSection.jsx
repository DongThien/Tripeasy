import React from 'react';
import { ChevronDown } from 'lucide-react';

const ContactMessageSection = ({ formData, onInputChange, onSubmit }) => (
    <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="grid lg:grid-cols-5">
                <aside className="relative h-[320px] lg:col-span-2 lg:h-auto">
                    <img
                        src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80"
                        alt="Khám phá cùng Tripeasy"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 text-white">
                        <h3 className="text-3xl font-bold">Cùng Tripeasy khám phá</h3>
                        <p className="mt-2 text-white/90">
                            Mang đến những trải nghiệm đáng nhớ trên mọi nẻo đường Việt Nam.
                        </p>
                    </div>
                </aside>

                <div className="p-6 md:p-8 lg:col-span-3">
                    <h2 className="text-4xl font-bold text-[#8B1A1A]">Gửi tin nhắn cho chúng tôi</h2>
                    <p className="mt-2 text-gray-600">
                        Điền thông tin vào mẫu dưới đây và chúng tôi sẽ phản hồi sớm nhất có thể.
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="text-sm font-medium text-gray-700">
                                Họ và tên
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={onInputChange}
                                    placeholder="Nguyễn Văn A"
                                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A]"
                                />
                            </label>

                            <label className="text-sm font-medium text-gray-700">
                                Số điện thoại
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={onInputChange}
                                    placeholder="0912 345 678"
                                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A]"
                                />
                            </label>
                        </div>

                        <label className="block text-sm font-medium text-gray-700">
                            Email
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onInputChange}
                                placeholder="email@example.com"
                                className="mt-1.5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A]"
                            />
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            Chủ đề
                            <div className="relative mt-1.5">
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={onInputChange}
                                    className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#8B1A1A]"
                                >
                                    <option>Tư vấn đặt tour</option>
                                    <option>Hỗ trợ dịch vụ</option>
                                    <option>Phản ánh chất lượng</option>
                                    <option>Hợp tác doanh nghiệp</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            Nội dung tin nhắn
                            <textarea
                                rows={4}
                                name="message"
                                value={formData.message}
                                onChange={onInputChange}
                                placeholder="Hãy cho chúng tôi biết chi tiết vấn đề của bạn..."
                                className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A]"
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#8B1A1A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a32626]"
                        >
                            Gửi ngay
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
);

export default ContactMessageSection;