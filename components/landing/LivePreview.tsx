'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Bug, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function LivePreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scanLineY = useTransform(scrollYProgress, [0, 0.4], ["-10%", "110%"]);
  const scanLineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.35, 0.4], [0, 1, 1, 0]);

  const codeOpacity = useTransform(scrollYProgress, [0.5, 0.6], [1, 0]);
  const fixedCodeOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  
  const bug1Opacity = useTransform(scrollYProgress, [0.15, 0.2, 0.5, 0.55], [0, 1, 1, 0]);
  const bug2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#09090b]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center mb-12 relative z-20">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight mb-4 text-shadow-sm">Watch the AI work</h2>
          <p className="text-zinc-400 text-lg">Scroll down to scan the code, spot the bugs, and apply the fix instantly.</p>
        </div>

        <div className="relative w-full max-w-4xl rounded-2xl bg-[#0a0a0c] border border-zinc-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden z-10">
          
          <div className="h-12 bg-[#18181b] border-b border-white/5 flex items-center px-4 gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1.5 rounded-md bg-[#27272a]/50 border border-white/5 text-xs text-zinc-400 font-mono flex items-center gap-2">
                payment-logic.js
              </div>
            </div>
            <div className="w-[52px]"></div> 
          </div>

          <div className="relative p-6 md:p-10 min-h-[380px] font-mono text-sm md:text-[15px] text-zinc-300 leading-[1.7] overflow-hidden bg-[#0a0a0c]">
            
            <motion.div style={{ opacity: codeOpacity }} className="absolute inset-0 p-6 md:p-10 pointer-events-none">
              <pre><span className="text-pink-400">function</span> <span className="text-blue-400">calculateTotal</span><span className="text-zinc-300">(items) {'{'}</span></pre>
              <pre className="pl-6"><span className="text-pink-400">let</span> <span className="text-zinc-100">total = </span><span className="text-orange-400">0</span><span className="text-zinc-300">;</span></pre>
              <pre className="pl-6 mt-2 relative">
                <span className="text-pink-400">for</span><span className="text-zinc-300">(</span><span className="text-[#facc15] underline decoration-wavy decoration-red-500/50 underline-offset-4">var</span> <span className="text-zinc-300">i=</span><span className="text-orange-400">0</span><span className="text-zinc-300">; i&lt;items.</span><span className="text-blue-400">length</span><span className="text-zinc-300">; i++) {'{'}</span>
              </pre>
              <pre className="pl-12 mt-2">
                <span className="text-zinc-300">total = total + items[i].</span><span className="text-[#facc15] underline decoration-wavy decoration-orange-500/50 underline-offset-4">price</span><span className="text-zinc-300">;</span>
              </pre>
              <pre className="pl-6">{'}'}</pre>
              <pre className="pl-6 mt-2"><span className="text-pink-400">return</span> <span className="text-zinc-300">total;</span></pre>
              <pre>{'}'}</pre>
            </motion.div>

            <motion.div style={{ opacity: fixedCodeOpacity }} className="absolute inset-0 p-6 md:p-10 pointer-events-none bg-[#0a0a0c]">
              <div className="absolute top-6 right-6 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <Sparkles className="w-4 h-4" /> Fixed with AI
              </div>
              <pre><span className="text-pink-400">export const</span> <span className="text-blue-400">calculateTotal</span> <span className="text-zinc-300">= (items: Item[]) =&gt; {'{'}</span></pre>
              <pre className="pl-6 mt-2"><span className="text-pink-400">return</span> <span className="text-zinc-300">items.</span><span className="text-blue-400">reduce</span><span className="text-zinc-300">((total, item) =&gt; total + item.price, </span><span className="text-orange-400">0</span><span className="text-zinc-300">);</span></pre>
              <pre className="mt-2 text-zinc-300">{'}'};</pre>
            </motion.div>

            <motion.div 
              style={{ top: scanLineY, opacity: scanLineOpacity }}
              className="absolute left-0 right-0 h-[2px] bg-green-400 shadow-[0_0_20px_4px_rgba(52,211,153,0.6)] z-20 pointer-events-none"
            >
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-green-500/10 to-transparent -z-10" />
            </motion.div>

            <motion.div 
              style={{ opacity: bug1Opacity }} 
              className="absolute top-[38%] left-[45%] md:left-[35%] bg-zinc-900 border border-red-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-xl p-3 z-30 max-w-[220px] backdrop-blur-md"
            >
               <div className="flex items-center gap-2 text-red-400 font-sans font-bold text-[11px] uppercase tracking-wider mb-1.5 ">
                 <Bug className="w-3.5 h-3.5" /> Scope Leak
               </div>
               <div className="text-zinc-400 font-sans text-[13px] leading-snug">Avoid using <code className="text-zinc-200 bg-zinc-800 px-1 rounded">var</code> inside loops. Use <code className="text-zinc-200">let</code> instead.</div>
            </motion.div>

            <motion.div 
              style={{ opacity: bug2Opacity }} 
              className="absolute top-[60%] left-[55%] md:left-[60%] bg-zinc-900 border border-yellow-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-xl p-3 z-30 max-w-[220px] backdrop-blur-md"
            >
               <div className="flex items-center gap-2 text-yellow-400 font-sans font-bold text-[11px] uppercase tracking-wider mb-1.5 ">
                 <AlertTriangle className="w-3.5 h-3.5" /> Logical flaw
               </div>
               <div className="text-zinc-400 font-sans text-[13px] leading-snug">Cannot guarantee <code className="text-zinc-200">item.price</code> exists. Use optional chaining or rewrite to array methods.</div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
