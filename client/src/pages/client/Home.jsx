
import React from "react";
import ClientNavbar from "../../components/common/ClientNavbar";
import ClientFooter from "../../components/common/ClientFooter";
import HeroSection from "../../components/client/home/HeroSection";
import WhyChoose from "../../components/client/home/WhyChoose";
import FeaturedTours from "../../components/client/home/FeaturedTours";
import PromoBanner from "../../components/client/home/PromoBanner";

const Home = () => (
    <div className="bg-[#FDFBF7] min-h-screen">
        <ClientNavbar />
        <main className="pt-16">
            <HeroSection />
            <WhyChoose />
            <FeaturedTours />
            <PromoBanner />
        </main>
        <ClientFooter />
    </div>
);

export default Home;