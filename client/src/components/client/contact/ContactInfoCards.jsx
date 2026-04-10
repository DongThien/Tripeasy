import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactInfoCards = () => (
    <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
            {[
                { icon: MapPin, title: 'Địa chỉ', value: '123 Cầu Giấy, Hà Nội' },
                { icon: Phone, title: 'Hotline', value: '1900 1234', sub: 'Hỗ trợ 24/7' },
                { icon: Mail, title: 'Email', value: 'support@tripeasy.vn' },
            ].map((item) => {
                const Icon = item.icon;

                return (
                    <article
                        key={item.title}
                        className="rounded-xl bg-white p-6 text-center shadow-lg ring-1 ring-gray-100"
                    >
                        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A]">
                            <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-4 text-2xl font-bold text-[#8B1A1A]">{item.title}</h3>
                        <p className="mt-2 text-gray-700">{item.value}</p>
                        {item.sub ? <p className="mt-1 text-sm text-gray-500">{item.sub}</p> : null}
                    </article>
                );
            })}
        </div>
    </section>
);

export default ContactInfoCards;