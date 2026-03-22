import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import LivePreview from '@/components/landing/LivePreview';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import CTA from '@/components/landing/CTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-green-400/30">
      <Navbar />
      <Hero />
      <LivePreview />
      <Features />
      <HowItWorks />
      <CTA />
      
      <footer className="py-12 text-center border-t border-zinc-800 text-zinc-500 text-sm flex flex-col items-center gap-1">
        <p className="font-medium text-zinc-400">Built with passion by Sahaj Sharma</p>
        <p>© {new Date().getFullYear()} Reviewly.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
