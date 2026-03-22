'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Code2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const isAuth = !!session;

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#09090b]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-green-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold text-zinc-100 tracking-tight">Reviewly<span className="text-green-400">.ai</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">How it Works</a>
          <Link href={isAuth ? "/editor" : "/login"} className={`px-5 py-2.5 rounded-full border border-white/10 transition-all ${isAuth ? 'bg-white/5 text-zinc-500 blur-[0.5px] opacity-60 hover:opacity-100 hover:blur-none pointer-events-none' : 'bg-white/5 hover:bg-white/10 text-zinc-100 hover:scale-105 active:scale-95'}`}>
            {isAuth ? 'Signed In' : 'Sign In'}
          </Link>
          <Link href={isAuth ? "/editor" : "/register"} className={`px-5 py-2.5 rounded-full font-semibold transition-all ${isAuth ? 'bg-green-500/20 text-green-100/80 blur-[0.5px] opacity-80 hover:blur-none hover:opacity-100 hover:scale-105 border border-green-500/30' : 'bg-green-400 text-zinc-950 hover:bg-green-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] hover:scale-105 active:scale-95'}`}>
            {isAuth ? 'Go to Editor' : 'Start Reviewing'}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
