'use client';

import React from 'react';
import { 
  Compass, 
  Bookmark, 
  Layers, 
  History, 
  Sparkles, 
  Radio, 
  Film,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  SlidersHorizontal,
  Cloud,
  HardDrive
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
  isLiveConfigured
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
    <aside style={{
      width: '260px',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      background: '#090c13',
      borderRight: '1px solid rgba(255, 255, 255, 0.07)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      zIndex: 100,
      overflowY: 'auto'
    }}>
      {/* Top Header & Branding */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', paddingLeft: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <Film size={20} color="#07090e" strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Scene<span style={{ color: '#f59e0b' }}>Scout</span>
            </h1>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Production Agent
            </div>
          </div>
        </div>

        {/* Live vs Demo Badge */}
        <div style={{ marginTop: '16px', marginBottom: '20px' }}>
          <div style={{
            background: isDemoMode ? 'rgba(245, 158, 11, 0.08)' : 'rgba(6, 182, 212, 0.08)',
            border: `1px solid ${isDemoMode ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.25)'}`,
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
                color: isDemoMode ? '#fbbf24' : '#38bdf8'
              }}>
                <Radio size={12} className={!isDemoMode ? 'animate-pulse-subtle' : ''} />
                {isDemoMode ? 'DEMO MODE' : 'LIVE RESEARCH'}
              </span>
              
              <button 
                onClick={() => setIsDemoMode(!isDemoMode)}
                title="Toggle Demo Mode vs Live Mode"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.3 }}>
              {isDemoMode 
                ? 'Simulated research data (no API key required)' 
                : 'Parallel Search API + Gemini active'}
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
              background: currentTab === 'scout' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: currentTab === 'scout' ? '#fbbf24' : '#94a3b8',
              border: currentTab === 'scout' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
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
              background: currentTab === 'saved' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: currentTab === 'saved' ? '#fbbf24' : '#94a3b8',
              border: currentTab === 'saved' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
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
                background: '#f59e0b',
                color: '#07090e',
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
              background: currentTab === 'compare' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: currentTab === 'compare' ? '#fbbf24' : '#94a3b8',
              border: currentTab === 'compare' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
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
                background: '#06b6d4',
                color: '#ffffff',
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
              background: currentTab === 'history' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: currentTab === 'history' ? '#fbbf24' : '#94a3b8',
              border: currentTab === 'history' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
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
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                    background: '#f59e0b',
                    color: '#07090e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.78rem'
                  }}>
                    {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'P'}
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
                      {profile?.full_name || user?.email?.split('@')[0] || 'Guest Creator'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      {user ? 'Authenticated' : 'Local Preview'}
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
                    color: '#64748b',
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
                  background: 'rgba(245, 158, 11, 0.12)',
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
                  <span>{personaMeta?.label || 'Indie Filmmaker'}</span>
                </span>
                <SlidersHorizontal size={11} color="#f59e0b" />
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '8px' }}>
                Join to sync bookmarks & custom scout briefs to Supabase.
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#07090e',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
                }}
              >
                <LogIn size={13} strokeWidth={2.4} />
                <span>Sign In / Join</span>
              </button>
            </div>
          )}

          {/* Cloud vs Local Sync Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.66rem',
            color: '#64748b'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isConfigured ? <Cloud size={11} color="#10b981" /> : <HardDrive size={11} color="#38bdf8" />}
              <span>{isConfigured ? 'Supabase Cloud' : 'Local Persistence'}</span>
            </span>
            <span style={{ color: isConfigured ? '#10b981' : '#38bdf8', fontWeight: 600 }}>
              {isConfigured ? 'Live' : 'Active'}
            </span>
          </div>
        </div>

        {/* Footer / Attribution */}
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.72rem',
          color: '#64748b'
        }}>
          <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10b981" />
            Agentic Cinema Hackathon
          </div>
          <div>Powered by <strong>Gemini</strong></div>
          <div>Integrated with <strong>Parallel API</strong></div>
          <div>Database: <strong>Supabase</strong></div>
        </div>
      </div>
    </aside>
  );
};
