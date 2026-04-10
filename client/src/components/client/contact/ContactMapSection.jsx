import React from 'react';
import { MapPin } from 'lucide-react';

const ContactMapSection = () => (
    <section className="relative mt-14 h-[400px] overflow-hidden">
        <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
            alt="Bản đồ văn phòng Tripeasy"
            className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 text-center shadow-xl ring-1 ring-gray-100">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A]">
                <MapPin className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-3xl font-bold text-gray-900">Văn phòng Tripeasy</h3>
            <p className="mt-2 text-gray-600">123 Cầu Giấy, Hà Nội</p>
            <button className="mt-4 rounded-full bg-[#8B1A1A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#a32626]">
                Chỉ đường
            </button>
        </div>
    </section>
);

export default ContactMapSection;