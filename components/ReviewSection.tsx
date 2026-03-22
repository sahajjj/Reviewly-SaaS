'use client';

import React from 'react';
import { Bug, Lightbulb, ShieldAlert, Cpu, CheckCircle2, Copy, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ReviewItem {
  title: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
  fix?: string;
}

interface ReviewSectionProps {
  title: string;
  items: ReviewItem[];
  type: 'bugs' | 'improvements' | 'security' | 'complexity';
}

const severityStyles: Record<string, { bg: string; color: string; dotColor: string }> = {
  low:    { bg: 'rgba(52,211,153,0.1)',  color: '#34d399', dotColor: '#34d399' },
  medium: { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', dotColor: '#fbbf24' },
  high:   { bg: 'rgba(251,113,133,0.1)', color: '#fb7185', dotColor: '#fb7185' },
};

const sectionStyles = {
  bugs:         { icon: Bug,         iconBg: 'rgba(251,113,133,0.1)', iconColor: '#fb7185', barColor: '#fb7185', lineGradient: 'linear-gradient(90deg, rgba(251,113,133,0.3), transparent)' },
  improvements: { icon: Lightbulb,   iconBg: 'rgba(251,191,36,0.1)',  iconColor: '#fbbf24', barColor: '#fbbf24', lineGradient: 'linear-gradient(90deg, rgba(251,191,36,0.3), transparent)' },
  security:     { icon: ShieldAlert, iconBg: 'rgba(56,189,248,0.1)',  iconColor: '#38bdf8', barColor: '#38bdf8', lineGradient: 'linear-gradient(90deg, rgba(56,189,248,0.3), transparent)' },
  complexity:   { icon: Cpu,         iconBg: 'rgba(167,139,250,0.1)', iconColor: '#a78bfa', barColor: '#a78bfa', lineGradient: 'linear-gradient(90deg, rgba(167,139,250,0.3), transparent)' },
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, items, type }) => {
  const config = sectionStyles[type];
  const Icon = config.icon;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!', { style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a', fontSize: '13px' } });
  };

  return (
    <div className="fade-in-up" style={{ marginBottom: 28 }}>
      {/* Header */}
      <div className="section-header">
        <div className="section-icon" style={{ background: config.iconBg }}>
          <Icon style={{ width: 16, height: 16, color: config.iconColor }} />
        </div>
        <span className="section-title">{title}</span>
        <div className="section-line" style={{ background: config.lineGradient }}></div>
        <span className="section-count">{items?.length || 0}</span>
      </div>

      {/* Content */}
      {(!items || items.length === 0) ? (
        <div className="all-clear">
          <CheckCircle2 style={{ width: 28, height: 28, color: 'rgba(52,211,153,0.2)', margin: '0 auto 8px' }} />
          <p style={{ fontSize: 12, color: '#52525b', fontWeight: 500 }}>All clear — no issues</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, idx) => {
            const sev = severityStyles[item.severity] || severityStyles.low;
            return (
              <div key={idx} className="review-card">
                <div className="review-card-bar" style={{ background: config.barColor }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                  <span className="card-title">{item.title}</span>
                  <span className="severity-badge" style={{ background: sev.bg, color: sev.color }}>
                    <span className="dot" style={{ background: sev.dotColor }}></span>
                    {item.severity}
                  </span>
                </div>

                <p className="card-explanation">{item.explanation}</p>

                {item.fix && (
                  <div className="code-block">
                    <div className="code-block-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="traffic-lights">
                          <div className="traffic-light" style={{ background: 'rgba(251,113,133,0.5)' }}></div>
                          <div className="traffic-light" style={{ background: 'rgba(251,191,36,0.5)' }}></div>
                          <div className="traffic-light" style={{ background: 'rgba(52,211,153,0.5)' }}></div>
                        </div>
                        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>suggestion</span>
                      </div>
                      <button className="copy-btn" onClick={() => handleCopy(item.fix!)}>
                        <Copy style={{ width: 11, height: 11 }} /> Copy
                      </button>
                    </div>
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                      <SyntaxHighlighter 
                        language="typescript" 
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '16px', background: 'transparent', fontSize: '13px', lineHeight: '1.5', fontFamily: "'JetBrains Mono', monospace" }}
                        wrapLines={true}
                        wrapLongLines={true}
                      >
                        {item.fix}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
