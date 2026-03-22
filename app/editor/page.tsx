'use client';

import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ReviewSection from '@/components/ReviewSection';
import { Sparkles, Trash2, Loader2, Code2, History, X, Zap, BarChart3, Layers, Share2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ExportPDFButton = dynamic(() => import('@/components/ExportPDFButton'), { ssr: false });

const languages = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
  { name: 'Java', value: 'java' },
  { name: 'C++', value: 'cpp' },
  { name: 'Go', value: 'go' },
  { name: 'Rust', value: 'rust' },
];

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [code, setCode] = useState<string>('// Paste your code here\n');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [review, setReview] = useState<any>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if (id) {
        setIsAnalyzing(true);
        fetch(`/api/review/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setReview(data.data.response);
              setCode(data.data.code);
              setLanguage(data.data.language);
              setReviewId(data.data._id);
            } else {
              toast.error('Review not found');
            }
          })
          .catch(() => toast.error('Failed to load review'))
          .finally(() => setIsAnalyzing(false));
      }
    }
  }, []);

  useEffect(() => { if (showHistory) fetchHistory(); }, [showHistory]);

  const fetchHistory = async () => {
    try {
      const resp = await fetch('/api/history');
      const data = await resp.json();
      if (data.success) setHistoryItems(data.data);
    } catch { console.error('History fetch failed'); }
  };

  const handleAnalyze = async () => {
    if (!code.trim() || code === '// Paste your code here...') {
      toast.error('Enter some code first.');
      return;
    }
    setIsAnalyzing(true);
    setReview(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const result = await res.json();
      if (result.success) {
        setReview(result.data);
        if (result.id) setReviewId(result.id);
        toast.success('Done!', { style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } });
      } else {
        toast.error(result.error || 'Failed.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFixCode = async () => {
    setIsFixing(true);
    const toastId = toast.loading('AI is fixing your code...', { style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } });
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, review }),
      });
      const result = await res.json();
      if (result.success) {
        setCode(result.fixedCode);
        toast.success('Code fixed successfully!', { id: toastId, style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } });
      } else {
        toast.error(result.error || 'Failed to fix code', { id: toastId });
      }
    } catch {
      toast.error('Something went wrong', { id: toastId });
    } finally {
      setIsFixing(false);
    }
  };

  const clearAll = () => { setCode(''); setReview(null); setReviewId(null); };

  const totalIssues = review
    ? (review.bugs?.length || 0) + (review.improvements?.length || 0) + (review.security?.length || 0) + (review.complexity?.length || 0)
    : 0;

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="ambient-bg"></div>

      {/* ===== HISTORY SIDEBAR ===== */}
      {showHistory && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end' }}
          onClick={() => setShowHistory(false)}>
          <div style={{ width: '100%', maxWidth: 380, background: '#09090b', height: '100%', borderLeft: '1px solid #27272a', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fafafa', display: 'flex', alignItems: 'center', gap: 8 }}>
                <History style={{ width: 15, height: 15, color: '#34d399' }} /> History
              </span>
              <div className="flex items-center gap-3">
              {session?.user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
                  <span>{session.user.name}</span>
                </div>
              )}
              <button 
                onClick={() => setShowHistory(false)} 
                className="btn-icon relative"
                title="Review History"
              >  <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {historyItems.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#3f3f46' }}>
                  <Layers style={{ width: 32, height: 32, marginBottom: 8, opacity: 0.3 }} />
                  <p style={{ fontSize: 12 }}>No reviews yet</p>
                </div>
              ) : (
                historyItems.map((item: any) => (
                  <div key={item._id} className="review-card" style={{ cursor: 'pointer' }}
                    onClick={() => { setReview(item.response); setCode(item.code); setLanguage(item.language); setReviewId(item._id); setShowHistory(false); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.language}</span>
                      <span style={{ fontSize: 10, color: '#3f3f46', fontFamily: 'monospace' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#71717a', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.code.slice(0, 60)}</p>
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: 16, borderTop: '1px solid #27272a' }}>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors font-semibold text-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <header className="app-header">
        <div className="app-logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Code2 style={{ width: 16, height: 16, color: '#09090b', strokeWidth: 3 }} />
          </div>
          <span className="logo-text">reviewly<span>.ai</span></span>
        </div>
        <button className="btn-ghost" onClick={() => setShowHistory(true)}>
          <History style={{ width: 14, height: 14 }} /> History
        </button>
      </header>

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }} className="lg:grid-cols-12">
          <style>{`@media (min-width: 1024px) { .lg\\:grid-cols-12 { grid-template-columns: repeat(12, 1fr); } .lg\\:col-span-7 { grid-column: span 7 / span 7; } .lg\\:col-span-5 { grid-column: span 5 / span 5; } }`}</style>

          {/* LEFT */}
          <div className="lg:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="toolbar">
              <select className="lang-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languages.map((l) => (<option key={l.value} value={l.value}>{l.name}</option>))}
              </select>
              <div className="toolbar-actions">
                <button className="btn-icon" onClick={clearAll}><Trash2 style={{ width: 16, height: 16 }} /></button>
                <button className="btn-primary" onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> : <Sparkles style={{ width: 15, height: 15 }} />}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                </button>
              </div>
            </div>

            <div className="editor-wrap">
              <CodeEditor code={code} language={language} onChange={(val: string | undefined) => setCode(val || '')} />
            </div>

            <div className="status-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div className="status-dot"></div>
                  <span style={{ color: 'rgba(52,211,153,0.6)' }}>ready</span>
                </div>
                <span style={{ color: '#27272a' }}>·</span>
                <span>utf-8</span>
                <span style={{ color: '#27272a' }}>·</span>
                <span>{code.split('\n').length} lines</span>
              </div>
              <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: 12, cursor: 'pointer', fontWeight: 500, padding: '2px 8px', borderRadius: 4 }} className="hover:bg-white/5 transition-colors">
                Return to Home
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            {!review && !isAnalyzing && (
              <div className="empty-state">
                <div className="empty-icon-wrap">
                  <Zap style={{ width: 28, height: 28, color: 'rgba(52,211,153,0.5)' }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#d4d4d8', marginBottom: 8 }}>Paste & Analyze</h3>
                <p style={{ fontSize: 12, color: '#52525b', maxWidth: 220, lineHeight: 1.6 }}>
                  Drop your code in the editor and hit analyze. AI does the rest.
                </p>
                <div className="empty-tags">
                  {['bugs', 'security', 'speed', 'quality'].map((t) => (
                    <span key={t} className="empty-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-bar" style={{ height: 16, width: '40%', marginBottom: 16 }}></div>
                    <div className="skeleton-bar" style={{ height: 56 }}></div>
                  </div>
                ))}
              </div>
            )}

            {review && (
              <div className="fade-in-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #34d399, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart3 style={{ width: 16, height: 16, color: '#09090b' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>Results</div>
                      <div style={{ fontSize: 10, color: '#52525b', fontFamily: 'monospace' }}>{totalIssues} issues</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/?id=${reviewId}`;
                        navigator.clipboard.writeText(url);
                        toast.success('Link copied to clipboard!', {
                          icon: '🔗',
                          style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' }
                        });
                      }}
                      className="btn-secondary"
                      style={{ padding: '0 12px', height: 32, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Share2 style={{ width: 14, height: 14 }} /> Share
                    </button>
                    <ExportPDFButton review={review} code={code} language={language} />
                  </div>
                </div>

                <div style={{ padding: '16px 20px', borderRadius: 12, background: 'linear-gradient(to right, rgba(52,211,153,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles style={{ width: 18, height: 18, color: '#34d399' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>Fix All with AI</div>
                      <div style={{ fontSize: 12, color: '#a1a1aa' }}>Automatically apply all suggested fixes to your code.</div>
                    </div>
                  </div>
                  <button onClick={handleFixCode} disabled={isFixing} className="btn-primary" style={{ height: 36, fontSize: 13, padding: '0 16px', background: '#34d399', color: '#09090b', boxShadow: '0 0 15px rgba(52,211,153,0.4)', border: 'none' }}>
                    {isFixing ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : <Sparkles style={{ width: 16, height: 16 }} />}
                    {isFixing ? 'Fixing...' : 'Fix Code'}
                  </button>
                </div>

                <ReviewSection type="bugs" items={review.bugs} title="Bugs & Problems" />
                <ReviewSection type="improvements" items={review.improvements} title="Improvements" />
                <ReviewSection type="security" items={review.security} title="Security" />
                <ReviewSection type="complexity" items={review.complexity} title="Complexity" />


              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="py-8 mt-8 text-center border-t border-zinc-800/50 text-zinc-500 text-xs flex flex-col items-center gap-1 relative z-10 w-full">
        <p className="font-semibold text-zinc-400">Built with passion by Sahaj Sharma</p>
        <p>© {new Date().getFullYear()} Reviewly.ai. All rights reserved.</p>
      </footer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
