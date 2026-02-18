'use client'
import React from 'react';
import Navbar from '@/components/beef/Navbar';
import HeroSection from '@/components/beef/HeroSection';
import ValueChain from '@/components/beef/ValueChain';
import FeedlotDashboard from '@/components/beef/FeedlotDashboard';
import ServicesSection from '@/components/beef/ServicesSection';
import InvestmentSection from '@/components/beef/InvestmentSection';
import PhotoGallery from '@/components/beef/PhotoGallery';
import Testimonials from '@/components/beef/Testimonials';
import ContactSection from '@/components/beef/ContactSection';
import Footer from '@/components/beef/Footer';
import { SafeUser } from './types';
interface MainClientProps {
  currentUser?: SafeUser|null|undefined; // Replace 'any' with your User type
}

const MainClient: React.FC<MainClientProps> = ({ currentUser }) => {
  return (
    <div className="min-h-screen bg-ranch-cream font-sans">
      {/* Now passing the currentUser prop down to Navbar */}
      <Navbar currentUser={currentUser}/>
      <main>
        <HeroSection />
        <ValueChain />
        <FeedlotDashboard />
        <ServicesSection />
        <InvestmentSection />
        <PhotoGallery />
        {/* <Testimonials /> */}
        <ContactSection currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
};

export default MainClient;