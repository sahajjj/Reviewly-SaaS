'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

const languages = ['JavaScript', 'Python', 'Go', 'Rust', 'TypeScript', 'Java'];

export default function Hero() {
  const [langIndex, setLangIndex] = useState(0);
  const { data: session } = useSession();
  const isAuth = !!session;

  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % languages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center px-6 max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Reviewly 2.0 is now live</span>
        </div>

        <h1 className="text-5xl md:text-[5rem] font-extrabold text-zinc-100 tracking-tight leading-[1.05] mb-8">
          Ship Better Code. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Instantly.</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed">
          AI-powered code reviews that catch bugs, improve performance, and secure your code in seconds. <br className="hidden md:block"/>
          <span className="inline-flex items-center gap-2 mt-4">
            Analyzing
            <span className="w-[120px] text-left inline-flex relative h-7 overflow-hidden ml-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={langIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute text-zinc-100 font-bold"
                >
                  {languages[langIndex]}...
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href={isAuth ? "/editor" : "/register"} className={`w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group ${isAuth ? 'bg-green-500/20 text-green-200/80 blur-[0.5px] opacity-80 hover:blur-none hover:opacity-100 hover:scale-105 border border-green-500/30' : 'bg-green-400 text-zinc-950 hover:bg-green-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] active:scale-95'}`}>
            {isAuth ? 'Go to Editor' : 'Start Reviewing'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-100 font-bold text-lg hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
            View Demo
          </a>
        </div>
      </motion.div>
    </section>
  );
}
