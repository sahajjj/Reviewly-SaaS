'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-32 overflow-hidden border-t border-zinc-800">
      <div className="absolute inset-0 bg-green-500/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8">
            Ready to review your code?
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Join thousands of developers shipping cleaner, safer, and faster code with Reviewly AI.
          </p>
          <Link href="/editor" className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-green-400 text-zinc-950 font-bold text-xl hover:bg-green-300 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)] group">
            Start Reviewing For Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
