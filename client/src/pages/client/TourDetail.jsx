import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';

import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import TourDetailHeaderGallery from '../../components/client/tourDetail/TourDetailHeaderGallery';
import TourDetailBookingSidebar from '../../components/client/tourDetail/TourDetailBookingSidebar';
import TourDetailHighlights from '../../components/client/tourDetail/TourDetailHighlights';
import TourDetailItinerary from '../../components/client/tourDetail/TourDetailItinerary';
import TourDetailServices from '../../components/client/tourDetail/TourDetailServices';
import TourDetailPolicies from '../../components/client/tourDetail/TourDetailPolicies';
import TourDetailRelated from '../../components/client/tourDetail/TourDetailRelated';

const TourDetail = () => {
    const { id } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);

    const sectionRefs = {
        highlights: useRef(null),
        itinerary: useRef(null),
        services: useRef(null),
        policies: useRef(null)
    };

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axiosClient.get(`/tours/${id}`);
                if (res.data.success) setTour(res.data.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchTour();
        window.scrollTo(0, 0);
    }, [id]);

    const scrollToSection = (section) => {
        const yOffset = -150;
        const element = sectionRefs[section].current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    const ensureArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try { return JSON.parse(data); } catch { return []; }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F6F4]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B1A1A]"></div>
        </div>
    );

    if (!tour) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F6F4]">
            <p className="text-gray-500 font-bold">Không tìm thấy tour này trong hệ thống Tripeasy.</p>
        </div>
    );

    return (
        <div className="bg-[#F9F6F4] min-h-screen pb-20 pt-[65px]">
            <ClientNavbar />

            <TourDetailHeaderGallery tour={tour} />

            {/* FIX MỞ RỘNG: max-w-[1440px] thay vì max-w-7xl */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

                    {/* CỘT TRÁI (Nội dung): Chiếm không gian rộng hơn (72%) trên màn hình lớn */}
                    <div className="lg:w-[68%] xl:w-[72%] space-y-12">

                        <div className="sticky top-[80px] z-20 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                            <button onClick={() => scrollToSection('highlights')} className="px-6 py-3 text-base font-bold text-gray-600 hover:text-[#8B1A1A] transition-colors whitespace-nowrap">Điểm nhấn</button>
                            <button onClick={() => scrollToSection('itinerary')} className="px-6 py-3 text-base font-bold text-gray-600 hover:text-[#8B1A1A] transition-colors whitespace-nowrap">Lịch trình</button>
                            <button onClick={() => scrollToSection('services')} className="px-6 py-3 text-base font-bold text-gray-600 hover:text-[#8B1A1A] transition-colors whitespace-nowrap">Dịch vụ</button>
                            <button onClick={() => scrollToSection('policies')} className="px-6 py-3 text-base font-bold text-gray-600 hover:text-[#8B1A1A] transition-colors whitespace-nowrap">Chính sách</button>
                        </div>

                        <section ref={sectionRefs.highlights} className="scroll-mt-40"><TourDetailHighlights highlights={ensureArray(tour.highlights)} /></section>
                        <section ref={sectionRefs.itinerary} className="scroll-mt-40"><TourDetailItinerary itinerary={ensureArray(tour.itinerary)} /></section>
                        <section ref={sectionRefs.services} className="scroll-mt-40"><TourDetailServices included={ensureArray(tour.included)} excluded={ensureArray(tour.excluded)} /></section>
                        <section ref={sectionRefs.policies} className="scroll-mt-40"><TourDetailPolicies tour={tour} /></section>
                    </div>

                    {/* CỘT PHẢI (Sidebar): Giữ tỷ lệ vừa phải (28%) để không bị phình to */}
                    <div className="lg:w-[32%] xl:w-[28%]">
                        <div className="sticky top-28 z-10">
                            <TourDetailBookingSidebar tour={tour} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <TourDetailRelated currentTourId={id} category={tour.category} />
            </div>

            <ClientFooter />
        </div>
    );
};

export default TourDetail;