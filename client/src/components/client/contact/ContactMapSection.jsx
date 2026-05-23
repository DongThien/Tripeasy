import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const ContactMapSection = () => {
    const address = "Số 3 đường Cầu Giấy, phường Láng Thượng, quận Đống Đa, Hà Nội";
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

    return (
        <section className="relative mt-20 h-[450px] w-full overflow-hidden border-t border-b border-gray-100 shadow-inner">
            {/* Google Maps Interactive IFrame */}
            <iframe
                title="Bản đồ văn phòng Tripeasy"
                src={mapEmbedUrl}
                className="w-full h-full border-0 grayscale-[15%] contrast-[110%] filter"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Float Overlay Card */}
            <div className="absolute left-4 right-4 bottom-4 md:left-12 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:w-[360px] rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-2xl border border-white/50 flex flex-col items-center md:items-start text-center md:text-left transition-all duration-300 hover:shadow-red-950/5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B1A1A]/10 text-[#8B1A1A] mb-4">
                    <MapPin className="h-6 h-6" />
                </span>

                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Văn phòng Tripeasy</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed font-medium">
                    {address}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                    Thời gian làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 7)
                </p>

                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B1A1A] hover:bg-[#6e1414] text-white px-6 py-3 text-sm font-bold shadow-lg shadow-red-950/10 transition active:scale-[0.98]"
                >
                    <Navigation className="w-4 h-4" />
                    Chỉ đường đi
                </a>
            </div>
        </section>
    );
};

export default ContactMapSection;