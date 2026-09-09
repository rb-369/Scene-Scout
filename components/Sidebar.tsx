'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Compass, 
  Bookmark, 
  Layers, 
  History, 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  SlidersHorizontal, 
  Database, 
  HardDrive,
  ArrowLeft,
  PanelLeftClose
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FilmmakerType } from '@/lib/supabase/types';

interface SidebarProps {
  currentTab: 'scout' | 'saved' | 'compare' | 'history';
  setCurrentTab: (tab: 'scout' | 'saved' | 'compare' | 'history') => void;
  savedCount: number;
  compareCount: number;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  isLiveConfigured: boolean;
  onBackToLanding?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const PERSONA_LABELS: Record<FilmmakerType, { label: string; icon: string }> = {
  indie: { label: 'Indie Filmmaker', icon: '🎬' },
  commercial: { label: 'Commercial House', icon: '🏢' },
  line_producer: { label: 'Line Producer', icon: '📍' },
  student: { label: 'Film Student', icon: '🎓' },
  documentary: { label: 'Documentary', icon: '🎥' }
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  savedCount,
  compareCount,
  isDemoMode,
  setIsDemoMode,
  onBackToLanding,
  isOpen = true,
  onToggle
}) => {
  const { 
    user, 
    profile, 
    isConfigured, 
    setShowAuthModal, 
    setShowOnboardingModal, 
    signOut, 
    demoPersona, 
    setDemoPersona 
  } = useAuth();

  const activePersona = profile?.filmmaker_type || demoPersona;
  const personaMeta = activePersona ? PERSONA_LABELS[activePersona] : null;

  return (
    <aside className="scene-sidebar" style={{
      width: '260px',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      background: '#07090f',
      borderRight: '1px solid rgba(148, 163, 184, 0.12)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
      zIndex: 100,
      overflowY: 'auto',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Top Header & Branding */}
      <div>
        {/* Logo, Wordmark and Close Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingLeft: '4px' }}>
          <div style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 0 14px rgba(245, 158, 11, 0.25)',
            flexShrink: 0
          }}>
            <Image 
              src="/logo.png" 
              alt="SceneScout" 
              fill 
              sizes="38px"
              style={{ objectFit: 'cover' }} 
              priority
            />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.22rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Scene<span style={{ color: '#fbbf24' }}>Scout</span>
            </h1>
            <div style={{ fontSize: '0.64rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Find Stories Around You
            </div>
          </div>
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="btn-cinema btn-ghost"
              style={{
                marginLeft: 'auto',
                padding: '6px',
                borderRadius: '6px',
                color: '#94a3b8'
              }}
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>

        {/* Back to Landing Page button */}
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#d4d4d8',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '8px 10px',
              cursor: 'pointer',
              marginBottom: '14px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={14} color="#fbbf24" />
            <span>Back to Overview</span>
          </button>
        )}

        {/* Live vs Demo Badge */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            background: isDemoMode ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${isDemoMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.28)'}`,
            borderRadius: '8px',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.74rem', 
                fontWeight: 700,
                color: isDemoMode ? '#fbbf24' : '#10b981'
              }}>
                <Radio size={12} className={!isDemoMode ? 'animate-pulse-subtle' : ''} />
                {isDemoMode ? 'DEMO REEL' : 'LIVE PRODUCTION'}
              </span>
              
              <button 
                onClick={() => setIsDemoMode(!isDemoMode)}
                title="Toggle Demo Mode vs Live Mode"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  fontSize: '0.66rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Switch
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#a1a1aa', lineHeight: 1.3 }}>
              {isDemoMode 
                ? 'Curated Mumbai industrial thriller dataset' 
                : 'Parallel Search API + Gemini 2.5 active'}
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setCurrentTab('scout')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              background: currentTab === 'scout' ? 'rgba(245, 158, 11, 0.14)' : 'transparent',
              color: currentTab === 'scout' ? '#fbbf24' : '#a1a1aa',
              border: currentTab === 'scout' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass size={18} />
              <span>Scout Brief</span>
            </div>
            <Sparkles size={14} style={{ opacity: currentTab === 'scout' ? 1 : 0 }} />
          </button>

          <button
            onClick={() => setCurrentTab('saved')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              background: currentTab === 'saved' ? 'rgba(245, 158, 11, 0.14)' : 'transparent',
              color: currentTab === 'saved' ? '#fbbf24' : '#a1a1aa',
              border: currentTab === 'saved' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bookmark size={18} />
              <span>Saved Locations</span>
            </div>
            {savedCount > 0 && (
              <span style={{
                fontSize: '0.7rem',
                background: '#fbbf24',
                color: '#07080a',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '10px'
              }}>
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('compare')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              background: currentTab === 'compare' ? 'rgba(245, 158, 11, 0.14)' : 'transparent',
              color: currentTab === 'compare' ? '#fbbf24' : '#a1a1aa',
              border: currentTab === 'compare' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={18} />
              <span>Compare Candidates</span>
            </div>
            {compareCount > 0 && (
              <span style={{
                fontSize: '0.7rem',
                background: '#fbbf24',
                color: '#07080a',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '10px'
              }}>
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              background: currentTab === 'history' ? 'rgba(245, 158, 11, 0.14)' : 'transparent',
              color: currentTab === 'history' ? '#fbbf24' : '#a1a1aa',
              border: currentTab === 'history' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History size={18} />
              <span>Scout History</span>
            </div>
          </button>
        </nav>
      </div>

      {/* User Identity & Persona Card */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.025)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {user || demoPersona ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                    color: '#07080a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.78rem'
                  }}>
                    {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'D'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      maxWidth: '120px'
                    }}>
                      {profile?.full_name || user?.email?.split('@')[0] || 'Film Director'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>
                      {user ? 'Production Head' : 'Director Preview'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (user) {
                      signOut();
                    } else {
                      setDemoPersona(null);
                    }
                  }}
                  title="Sign out"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>

              {/* Active Persona Pill (Clickable to change) */}
              <button
                type="button"
                onClick={() => setShowOnboardingModal(true)}
                title="Click to switch your production persona"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{personaMeta?.icon || '🎬'}</span>
                  <span>{personaMeta?.label || 'Director of Photography'}</span>
                </span>
                <SlidersHorizontal size={11} color="#fbbf24" />
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.74rem', color: '#a1a1aa', marginBottom: '8px' }}>
                Sync location dossiers to MongoDB Atlas cloud.
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="btn-cinema btn-primary"
                style={{
                  width: '100%',
                  fontSize: '0.78rem',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}
              >
                <LogIn size={13} strokeWidth={2.4} />
                <span>Sign In / Join</span>
              </button>
            </div>
          )}

          {/* Database Persistence Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.66rem',
            color: '#71717a'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Database size={11} color="#fbbf24" />
              <span>MongoDB Atlas</span>
            </span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>
              Connected
            </span>
          </div>
        </div>

        {/* Footer / Attribution */}
        <div style={{
          padding: '10px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.7rem',
          color: '#64748b'
        }}>
          <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={13} color="#34d399" />
            Agentic Cinema Hackathon
          </div>
          <div>Orchestrator: <strong>Gemini 2.5</strong></div>
          <div>Web Retrieval: <strong>Parallel API</strong></div>
          <div>Database: <strong>MongoDB Atlas</strong></div>
        </div>
      </div>
    </aside>
  );
};
