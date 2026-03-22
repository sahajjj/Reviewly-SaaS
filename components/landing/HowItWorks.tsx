'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ClipboardPaste, Cpu, ListChecks } from 'lucide-react';

const steps = [
  {
    title: 'Paste Code',
    description: 'Drop any block of code or entire script directly into our secure, browser-based editor.',
    icon: ClipboardPaste,
    delay: 0
  },
  {
    title: 'Analyze with AI',
    description: 'Our custom models process your logic, checking for bugs, security holes, and complexity.',
    icon: Cpu,
    delay: 0.2
  },
  {
    title: 'Get Insights & Fix',
    description: 'Review the high-fidelity structured feedback or click one button to instantly fix all issues.',
    icon: ListChecks,
    delay: 0.4
  }
];

export default function HowItWorks() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 60%"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);
  
  // Highlight each step based on vertical scroll thresholds
  const step1Glow = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const step2Glow = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const step3Glow = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const glows = [step1Glow, step2Glow, step3Glow];

  return (
    <section ref={containerRef} id="how-it-works" className="py-40 relative z-10 bg-[#09090b] border-t border-b border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-6 tracking-tight">How it works</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Follow this simple workflow to drastically improve your code quality in seconds.</p>
        </motion.div>

        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute top-[48px] bottom-[48px] left-[39px] md:left-[47px] w-[2px] bg-zinc-800/50 rounded-full">
            <motion.div 
              className="w-full bg-green-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="flex flex-col gap-24">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: step.delay }}
                className="relative flex items-start gap-8 md:gap-16 group w-full"
              >
                {/* Icon Circle mapped to the line */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-950 border-4 border-[#09090b] shadow-[0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center shrink-0 relative z-10 transition-colors">
                  {/* Scroll-driven glow */}
                  <motion.div 
                    style={{ opacity: glows[idx] }} 
                    className="absolute inset-0 bg-green-500/20 rounded-full blur-[20px] transition-opacity duration-300" 
                  />
                  
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-zinc-300 relative z-10 group-hover:text-green-400 transition-colors" />
                  
                  <motion.div 
                    style={{
                      borderColor: useTransform(glows[idx], [0, 1], ["rgba(63,63,70,1)", "rgba(52,211,153,0.5)"]),
                      color: useTransform(glows[idx], [0, 1], ["#a1a1aa", "#34d399"]),
                      boxShadow: useTransform(glows[idx], [0, 1], ["0 0 0px transparent", "0 0 15px rgba(52,211,153,0.3)"])
                    }}
                    className="absolute -top-3 -right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs md:text-sm font-mono transition-all duration-300"
                  >
                    {idx + 1}
                  </motion.div>
                </div>
                
                {/* Step Content */}
                <div className="pt-2 md:pt-4 flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4 tracking-tight group-hover:text-green-400 transition-colors">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-base md:text-lg max-w-md">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
