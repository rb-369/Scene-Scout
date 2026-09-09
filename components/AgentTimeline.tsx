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
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({
  steps,
  currentStepIndex,
  sourcesCount,
  candidatesFoundCount,
  shortlistedCount,
  isLoading,
  mode
}) => {
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
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isLoading ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isLoading ? '#f59e0b' : '#10b981'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isLoading ? (
              <Loader2 size={16} color="#f59e0b" className="animate-spin-slow" />
            ) : (
              <CheckCircle2 size={16} color="#10b981" />
            )}
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Autonomous Scout Activity
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              {isLoading ? 'Agent actively researching and verifying web sources...' : 'Research completed. Shortlist compiled.'}
            </span>
          </div>
        </div>

        {/* Live Metrics Pills */}
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
            <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
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
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '8px',
            padding: '6px 14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.66rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Shortlisted
            </div>
            <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
              {shortlistedCount}
            </div>
          </div>
        </div>
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
                  ? 'rgba(245, 158, 11, 0.08)' 
                  : isCompleted 
                    ? 'rgba(255, 255, 255, 0.03)' 
                    : 'rgba(255, 255, 255, 0.01)',
                border: `1px solid ${
                  isCurrent 
                    ? 'rgba(245, 158, 11, 0.4)' 
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
                  <Loader2 size={16} color="#f59e0b" className="animate-spin-slow" />
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
                    color: isCurrent ? '#fbbf24' : isCompleted ? '#ffffff' : '#94a3b8' 
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
