
import React from "react";
import Navbar from "../../components/home/Navbar";
import HeroSection from "../../components/home/HeroSection";
import WhyChoose from "../../components/home/WhyChoose";
import FeaturedTours from "../../components/home/FeaturedTours";
import PromoBanner from "../../components/home/PromoBanner";
import Footer from "../../components/home/Footer";

const Home = () => (
    <div className="bg-[#FDFBF7] min-h-screen">
        <Navbar />
        <main className="pt-16">
            <HeroSection />
            <WhyChoose />
            <FeaturedTours />
            <PromoBanner />
        </main>
        <Footer />
    </div>
);

export default Home;