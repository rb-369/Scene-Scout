'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Globe, 
  Search, 
  FileText, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles,
  Bot
} from 'lucide-react';
import { AgentActivityStep } from '@/lib/types';

interface AgentTimelineProps {
  steps: AgentActivityStep[];
  currentStepIndex: number;
  sourcesCount: number;
  candidatesFoundCount: number;
  shortlistedCount: number;
  isLoading: boolean;
  mode: 'live' | 'demo';
  onExploreShortlist?: () => void;
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({
  steps,
  currentStepIndex,
  sourcesCount,
  candidatesFoundCount,
  shortlistedCount,
  isLoading,
  mode,
  onExploreShortlist
}) => {
  const isDone = !isLoading && currentStepIndex >= steps.length - 1;
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / Math.max(1, steps.length)) * 100));

  return (
    <div className="glass-panel" style={{
      padding: '20px 24px',
      marginBottom: '32px',
      borderLeft: '4px solid #f59e0b',
      background: 'linear-gradient(135deg, rgba(13, 17, 26, 0.95) 0%, rgba(20, 26, 38, 0.9) 100%)'
    }}>
      {/* Top Bar with Counters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isLoading ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isLoading ? '#f59e0b' : '#10b981'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isLoading ? (
              <Loader2 size={17} color="#f59e0b" className="animate-spin-slow" />
            ) : (
              <CheckCircle2 size={17} color="#10b981" />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Autonomous Scout Pipeline
              </h3>
              {isLoading && (
                <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              )}
              {isDone && (
                <span className="badge badge-verified" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  100% Pipeline Complete
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.78rem', color: isLoading ? '#fbbf24' : '#94a3b8', marginTop: '2px', display: 'block' }}>
              {isLoading 
                ? `Executing: ${steps[currentStepIndex]?.title || 'Analyzing candidate data'} (${progressPercent}%)` 
                : 'All multi-agent research and verification stages complete. Ranked shortlist ready below.'}
            </span>
          </div>
        </div>

        {/* Live Metrics Pills & Explore Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '6px 14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Sources Consulted
            </div>
            <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f4f4f5' }}>
              {sourcesCount}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '6px 14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Candidates Evaluated
            </div>
            <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
              {candidatesFoundCount}
            </div>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            padding: '6px 14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.66rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Shortlisted
            </div>
            <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
              {shortlistedCount}
            </div>
          </div>

          {onExploreShortlist && isDone && (
            <button
              onClick={onExploreShortlist}
              className="btn-cinema btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <span>Explore Shortlist ↓</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Track Bar */}
      <div style={{
        width: '100%',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.06)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: isDone 
            ? 'linear-gradient(90deg, #10b981 0%, #fbbf24 100%)' 
            : 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Stepped Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px'
      }}>
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex && isLoading;

          return (
            <div 
              key={step.id || idx}
              style={{
                background: isCurrent 
                  ? 'rgba(245, 158, 11, 0.12)' 
                  : isCompleted 
                    ? 'rgba(255, 255, 255, 0.03)' 
                    : 'rgba(255, 255, 255, 0.01)',
                border: `1px solid ${
                  isCurrent 
                    ? 'rgba(245, 158, 11, 0.5)' 
                    : isCompleted 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 0.03)'
                }`,
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                opacity: isCompleted || isCurrent ? 1 : 0.45,
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {isCurrent ? (
                  <Loader2 size={16} color="#fbbf24" className="animate-spin-slow" />
                ) : isCompleted ? (
                  <CheckCircle2 size={16} color="#10b981" />
                ) : (
                  <Circle size={16} color="#64748b" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ 
                    fontSize: '0.82rem', 
                    fontWeight: 600, 
                    color: isCurrent ? '#38bdf8' : isCompleted ? '#ffffff' : '#94a3b8' 
                  }}>
                    {step.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                    {step.timestamp}
                  </span>
                </div>

                <p style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.35 }}>
                  {step.description}
                </p>

                {step.toolUsed && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      background: step.toolUsed.toLowerCase().includes('parallel')
                        ? 'rgba(6, 182, 212, 0.15)'
                        : step.toolUsed.toLowerCase().includes('gemini')
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${
                        step.toolUsed.toLowerCase().includes('parallel')
                          ? 'rgba(6, 182, 212, 0.35)'
                          : step.toolUsed.toLowerCase().includes('gemini')
                            ? 'rgba(245, 158, 11, 0.35)'
                            : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      color: step.toolUsed.toLowerCase().includes('parallel')
                        ? '#38bdf8'
                        : step.toolUsed.toLowerCase().includes('gemini')
                          ? '#fbbf24'
                          : '#cbd5e1',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚡ {step.toolUsed}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
