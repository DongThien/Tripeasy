import React from 'react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import AboutHero from '../../components/client/about/AboutHero';
import BrandStory from '../../components/client/about/BrandStory';
import CoreValues from '../../components/client/about/CoreValues';
import StatsBar from '../../components/client/about/StatsBar';
import TeamSection from '../../components/client/about/TeamSection';
import AboutCTA from '../../components/client/about/AboutCTA';

const About = () => (
    <div className="bg-[#FDFBF7] min-h-screen">
        <ClientNavbar />
        <main className="pt-16">
            <AboutHero />
            <BrandStory />
            <CoreValues />
            <StatsBar />
            <TeamSection />
            <AboutCTA />
        </main>
        <ClientFooter />
    </div>
);

export default About;
