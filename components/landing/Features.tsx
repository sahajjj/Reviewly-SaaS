'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bug, Sparkles, ShieldCheck, Activity } from 'lucide-react';

const features = [
  {
    title: 'Bug Detection',
    description: 'Instantly spot syntax errors, runtime bugs, and logical flaws before they hit production.',
    icon: Bug,
    color: 'from-orange-500/20 to-red-500/5',
    iconColor: 'text-orange-400'
  },
  {
    title: 'Smart Improvements',
    description: 'Get actionable refactoring advice to make your code cleaner, shorter, and more idiomatic.',
    icon: Sparkles,
    color: 'from-blue-500/20 to-indigo-500/5',
    iconColor: 'text-blue-400'
  },
  {
    title: 'Security Analysis',
    description: 'Identify OWASP vulnerabilities, injection risks, and insecure data handling automatically.',
    icon: ShieldCheck,
    color: 'from-emerald-500/20 to-green-500/5',
    iconColor: 'text-emerald-400'
  },
  {
    title: 'Complexity Insights',
    description: 'Analyze cyclomatic complexity and receive suggestions to simplify deeply nested logic.',
    icon: Activity,
    color: 'from-purple-500/20 to-fuchsia-500/5',
    iconColor: 'text-purple-400'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative z-10 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-6 tracking-tight">Everything you need to ship faster.</h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Reviewly AI acts as your senior engineering partner, analyzing every pull request across 4 critical dimensions.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`p-8 rounded-3xl bg-zinc-900 border border-zinc-800 bg-gradient-to-b ${feature.color} hover:border-zinc-700 transition-all cursor-crosshair group relative overflow-hidden`}
          >
            <div className={`w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 border border-zinc-800 group-hover:bg-zinc-800 transition-colors ${feature.iconColor}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">{feature.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
