'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';

export default function VideoScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (videoRef.current && videoRef.current.duration) {
      // Scrub the video based on scroll percentage
      videoRef.current.currentTime = latest * videoRef.current.duration;
    }
  });

  // Calculate parallax and scale for the laptop container
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.85, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Text fades out faster as you scroll down
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);

  return (
    <div ref={containerRef} style={{ height: '300vh', position: 'relative', background: '#09090b' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Ambient Glow behind the laptop */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '70vw', 
          height: '40vw', 
          background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 60%)', 
          filter: 'blur(80px)', 
          zIndex: 0, 
          pointerEvents: 'none' 
        }}></div>

        {/* Laptop Container */}
        <motion.div 
          style={{ scale, opacity, zIndex: 10, position: 'relative', width: '85vw', maxWidth: '1100px', aspectRatio: '16/10' }}
        >
          {/* Laptop Frame */}
          <div style={{ 
            background: '#18181b', 
            borderRadius: '24px', 
            padding: '16px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 1px rgba(255,255,255,0.1)',
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#27272a' }}></div>
            
            {/* Screen */}
            <div style={{ 
              flex: 1,
              width: '100%', 
              overflow: 'hidden', 
              borderRadius: '12px', 
              background: '#000', 
              position: 'relative' 
            }}>
              <video 
                ref={videoRef}
                src="/video.mp4" 
                muted 
                playsInline 
                preload="auto"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Laptop Base Lip */}
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '105%',
              height: '24px',
              background: 'linear-gradient(to bottom, #27272a, #09090b)',
              borderRadius: '0 0 24px 24px',
              zIndex: -1,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 40px rgba(52,211,153,0.1)'
            }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '15%', height: '4px', background: '#3f3f46', borderRadius: '0 0 4px 4px' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Text overlaying the start of the scroll */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '20%', 
            left: '50%',
            x: '-50%',
            textAlign: 'center',
            opacity: textOpacity,
            y: textY,
            zIndex: 20,
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(52,211,153,0.1)', color: '#34d399', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 16, border: '1px solid rgba(52,211,153,0.2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}></span>
            Reviewly.ai 2.0
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Code reviews,<br/><span style={{ color: '#34d399' }}>reimagined.</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', fontWeight: 500 }}>
            Scroll down to see it in action ↓
          </p>
        </motion.div>
      </div>
    </div>
  );
}
