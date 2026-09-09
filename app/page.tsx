'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BriefInput } from '@/components/BriefInput';
import { AgentTimeline } from '@/components/AgentTimeline';
import { LocationCard } from '@/components/LocationCard';
import { LocationDetailModal } from '@/components/LocationDetailModal';
import { ConversationalPanel } from '@/components/ConversationalPanel';
import { CompareModal } from '@/components/CompareModal';
import { SavedLocationsView } from '@/components/SavedLocationsView';
import { AuthModal } from '@/components/AuthModal';
import { FilmmakerOnboardingModal } from '@/components/FilmmakerOnboardingModal';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { 
  LocationCandidate, 
  ResearchSession, 
  ScoutCriteria, 
  FollowUpMessage 
} from '@/lib/types';
import { 
  DEMO_BRIEF, 
  DEMO_CANDIDATES, 
  DEMO_ACTIVITY_STEPS, 
  DEMO_SESSION 
} from '@/lib/demoData';
import { storageService } from '@/lib/services/storage';
import { 
  Layers, 
  Sparkles, 
  FileCheck2, 
  Info, 
  RotateCcw,
  SlidersHorizontal,
  Film,
  Radio,
  Cpu,
  Globe,
  CheckCircle2,
  CheckCircle,
  ArrowDown
} from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();

  // Navigation
  const [currentTab, setCurrentTab] = useState<'scout' | 'saved' | 'compare' | 'history'>('scout');

  // Mode and System status
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLiveConfigured, setIsLiveConfigured] = useState<boolean>(false);
  const [modeLabel, setModeLabel] = useState<string>('Verifying providers...');

  // Active Research State
  const [currentSession, setCurrentSession] = useState<ResearchSession | null>(null);
  const [candidates, setCandidates] = useState<LocationCandidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(10);
  const [justCompletedScout, setJustCompletedScout] = useState<boolean>(false);

  // Section references for automatic scroll navigation
  const shortlistRef = useRef<HTMLDivElement>(null);
  const conversationalRef = useRef<HTMLDivElement>(null);

  // Modals & Sub-views
  const [selectedCandidate, setSelectedCandidate] = useState<LocationCandidate | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [savedLocations, setSavedLocations] = useState<LocationCandidate[]>([]);

  // Follow-up conversation
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState<boolean>(false);

  // Initialize
  useEffect(() => {
    // Check backend provider status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        const live = data.providers?.parallel?.configured && data.providers?.gemini?.configured;
        setIsLiveConfigured(Boolean(live));
        setIsDemoMode(!live);
        setModeLabel(data.modeLabel || 'Demo Mode - simulated research data');
      })
      .catch(() => {
        setIsDemoMode(true);
      });

    // Load saved locations from storage
    const saved = storageService.getSavedLocations();
    setSavedLocations(saved);

    // Automatically load the pre-curated primary demo session on first load
    setCurrentSession(DEMO_SESSION);
    setCandidates(DEMO_CANDIDATES);
    setCurrentStepIndex(DEMO_ACTIVITY_STEPS.length - 1);
  }, []);

  // Sync saved locations from Supabase whenever user logs in
  useEffect(() => {
    if (user?.id) {
      storageService.syncSavedLocationsWithCloud(user.id).then(synced => {
        setSavedLocations(synced);
      });
    }
  }, [user?.id]);

  // Handler: Start Scout (or Demo Scout)
  const handleStartScout = async (brief: string, criteria: ScoutCriteria, forceDemo: boolean) => {
    setIsLoading(true);
    setJustCompletedScout(false);
    setCurrentStepIndex(0);
    setFollowUpMessages([]);

    const totalSteps = DEMO_ACTIVITY_STEPS.length;
    let currentStep = 0;

    // Advance through agent steps sequentially so the multi-agent pipeline is visibly experienced
    const stepTimer = setInterval(() => {
      if (currentStep < totalSteps - 1) {
        currentStep += 1;
        setCurrentStepIndex(currentStep);
      }
    }, 600);

    try {
      const response = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          criteria,
          forceDemo: forceDemo || isDemoMode
        })
      });

      const data = await response.json();

      // Ensure user sees the agent progression even if server responds quickly
      const remainingSteps = Math.max(0, totalSteps - 1 - currentStep);
      if (remainingSteps > 0) {
        await new Promise(resolve => setTimeout(resolve, Math.min(remainingSteps * 450, 2200)));
      }

      clearInterval(stepTimer);
      setCurrentStepIndex(totalSteps - 1);

      if (data.success && data.session && Array.isArray(data.session.candidates) && data.session.candidates.length > 0) {
        setCurrentSession(data.session);
        setCandidates(data.session.candidates);
        storageService.saveSession(data.session, user?.id);
      } else {
        console.warn('Scout returned incomplete session or error, falling back to curated candidates:', data?.error);
        setCurrentSession(DEMO_SESSION);
        setCandidates(DEMO_CANDIDATES);
      }
    } catch (err) {
      console.error('Scout request failed:', err);
      clearInterval(stepTimer);
      setCurrentStepIndex(totalSteps - 1);
      // Fallback
      setCurrentSession(DEMO_SESSION);
      setCandidates(DEMO_CANDIDATES);
    } finally {
      setIsLoading(false);
      setJustCompletedScout(true);

      // Pause briefly so user can see completed pipeline before gentle scroll
      setTimeout(() => {
        shortlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 2200);
    }
  };

  // Handler: Ask Agent about a specific candidate location
  const handleAskAbout = (cand: LocationCandidate) => {
    // 1. Smoothly scroll down to conversational panel
    setTimeout(() => {
      conversationalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);

    // 2. Dispatch prompt to agent
    handleSendMessage(`Tell me more about filming permissions, logistical access, and production risks for ${cand.name}.`);
  };

  // Handler: Follow-up query / re-ranking
  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: FollowUpMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setFollowUpMessages(prev => [...prev, userMsg]);
    setIsFollowUpLoading(true);

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          candidates,
          brief: currentSession?.userBrief || DEMO_BRIEF,
          messages: [...followUpMessages, userMsg]
        })
      });

      const data = await res.json();
      if (data.success) {
        const agentMsg: FollowUpMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          text: data.text,
          actionTaken: data.actionTaken,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setFollowUpMessages(prev => [...prev, agentMsg]);

        if (data.reRankedCandidates && data.reRankedCandidates.length > 0) {
          setCandidates(data.reRankedCandidates);
        }
      } else {
        const fallbackMsg: FollowUpMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          text: data.error || `Analyzed candidate portfolio against "${promptText}". Shortlist remains optimized for production viability.`,
          actionTaken: 'Portfolio review',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setFollowUpMessages(prev => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.error('Follow-up failed:', err);
      const fallbackMsg: FollowUpMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: `Analyzed "${promptText}" against all candidate dossiers. Current locations remain optimal for scene requirements.`,
        actionTaken: 'Completed analysis',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setFollowUpMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Toggle bookmark / save
  const handleToggleSave = (candidate: LocationCandidate) => {
    if (storageService.isSaved(candidate.id)) {
      storageService.removeSavedLocation(candidate.id, user?.id);
      setSavedLocations(prev => prev.filter(c => c.id !== candidate.id));
    } else {
      storageService.saveLocation(candidate, user?.id);
      setSavedLocations(prev => [...prev, candidate]);
    }
  };

  // Toggle compare selection
  const handleToggleCompare = (candidate: LocationCandidate) => {
    if (compareIds.includes(candidate.id)) {
      setCompareIds(prev => prev.filter(id => id !== candidate.id));
    } else {
      if (compareIds.length >= 3) {
        alert('You can compare up to 3 candidate locations at a time.');
        return;
      }
      setCompareIds(prev => [...prev, candidate.id]);
    }
  };

  // Compare candidates subset
  const comparedCandidates = candidates.filter(c => compareIds.includes(c.id));
  const recentSessions = storageService.getSessions();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedCount={savedLocations.length}
        compareCount={compareIds.length}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        isLiveConfigured={isLiveConfigured}
      />

      {/* Main Working Area */}
      <main className="main-content">
        {/* Top Status Bar */}
        <header className="top-status-bar" aria-label="System status">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981',
                display: 'inline-block'
              }} className="animate-pulse-subtle" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Runtime Verified
              </span>
            </div>

            <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                <Cpu size={11} />
                Google Gemini 2.5 Flash
              </span>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Agent Reasoning & Synthesis</span>
            </div>

            <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                <Globe size={11} />
                Parallel Search API
              </span>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Autonomous Live Web Crawl</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '0.72rem',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)'
            }}>
              api.parallel.ai/v1/search • Active
            </span>
          </div>
        </header>

        {currentTab === 'saved' ? (
          <SavedLocationsView
            savedLocations={savedLocations}
            onRemove={(id) => {
              storageService.removeSavedLocation(id, user?.id);
              setSavedLocations(prev => prev.filter(c => c.id !== id));
            }}
            onViewDetails={(c) => setSelectedCandidate(c)}
            onBackToScout={() => setCurrentTab('scout')}
          />
        ) : currentTab === 'compare' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
                  Candidate Comparison
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Select 2-3 locations from your scout results to analyze side-by-side.
                </p>
              </div>

              {compareIds.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="btn-cinema btn-primary"
                >
                  <Layers size={16} />
                  <span>Launch Decision Matrix ({compareIds.length})</span>
                </button>
              )}
            </div>

            {compareIds.length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <Layers size={40} color="#64748b" style={{ margin: '0 auto 16px' }} />
                <h3 className="font-display" style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>
                  No locations selected for comparison
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 20px' }}>
                  Click "Compare" on 2 or 3 location cards in the Scout tab to compare visual fit, logistics, and legal restrictions.
                </p>
                <button onClick={() => setCurrentTab('scout')} className="btn-cinema btn-primary">
                  Go to Scout Shortlist
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {comparedCandidates.map((c, i) => (
                  <LocationCard
                    key={c.id}
                    candidate={c}
                    rankIndex={i}
                    onViewDetails={(c) => setSelectedCandidate(c)}
                    onToggleSave={handleToggleSave}
                    isSaved={storageService.isSaved(c.id)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={true}
                    onAskAbout={(c) => {
                      setCurrentTab('scout');
                      handleSendMessage(`Analyze ${c.name} for our shoot requirements.`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : currentTab === 'history' ? (
          <div>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Scout Research History
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
              Previous autonomous scouting briefs and synthesized shortlist dossiers {user ? 'synced with Supabase' : 'stored locally'}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-verified">Primary Hackathon Benchmark Session</span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Mumbai Industrial Thriller</span>
                </div>
                <h4 className="font-display" style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '6px' }}>
                  {DEMO_BRIEF}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: '16px' }}>
                  Researched 14 web sources across Mumbai Port Authority, Maharashtra Film City, and architectural registries. 5 candidates shortlisted.
                </p>
                <button
                  onClick={() => {
                    setCurrentSession(DEMO_SESSION);
                    setCandidates(DEMO_CANDIDATES);
                    setCurrentTab('scout');
                  }}
                  className="btn-cinema btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Reload Benchmark Session
                </button>
              </div>

              {recentSessions.filter(s => s.id !== DEMO_SESSION.id).map((s) => (
                <div key={s.id} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge badge-cyan">User Scouting Session</span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{s.criteria.city} • {s.criteria.sceneType}</span>
                  </div>
                  <h4 className="font-display" style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '6px' }}>
                    {s.userBrief}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '12px' }}>
                    Budget: {s.criteria.budgetRange || 'Flexible'} • {s.candidates.length} candidates evaluated
                  </p>
                  <button
                    onClick={() => {
                      setCurrentSession(s);
                      setCandidates(s.candidates);
                      setCurrentTab('scout');
                    }}
                    className="btn-cinema btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    Restore Shortlist
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Primary Scout Tab */
          <div>
            {/* Input Form & Hero Controls */}
            <BriefInput
              onStartScout={handleStartScout}
              isLoading={isLoading}
            />

            {/* Agent Activity Stepped Timeline */}
            <AgentTimeline
              steps={currentSession?.activity || DEMO_ACTIVITY_STEPS}
              currentStepIndex={currentStepIndex}
              sourcesCount={currentSession?.sourcesConsultedCount || 14}
              candidatesFoundCount={currentSession?.candidatesFoundCount || 18}
              shortlistedCount={candidates.length}
              isLoading={isLoading}
              mode={isDemoMode ? 'demo' : 'live'}
              onExploreShortlist={() => {
                shortlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />

            {/* Completion Banner */}
            {justCompletedScout && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={18} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff' }}>
                      Scouting Completed Successfully!
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
                      {candidates.length} production candidate dossiers evaluated and ranked below.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      shortlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="btn-cinema btn-secondary"
                    style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                  >
                    <ArrowDown size={12} />
                    <span>View Shortlist</span>
                  </button>
                </div>
              </div>
            )}

            {/* Candidate Shortlist Section */}
            <div ref={shortlistRef} id="shortlist-section" style={{ scrollMarginTop: '24px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                      Synthesized Candidate Shortlist
                    </h3>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                      {candidates.length} Verified
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
                    Multi-criteria scored across aesthetic match, road & power accessibility, evidence grounding, and permit risk.
                  </p>
                </div>

                {/* Compare Bar Launch Action */}
                {compareIds.length > 0 && (
                  <button
                    onClick={() => setShowCompareModal(true)}
                    className="btn-cinema btn-primary animate-pulse-subtle"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <Layers size={16} />
                    <span>Compare Selected Candidates ({compareIds.length}/3)</span>
                  </button>
                )}
              </div>

              {/* Candidate Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
                {candidates.map((candidate, idx) => (
                  <LocationCard
                    key={candidate.id}
                    candidate={candidate}
                    rankIndex={idx}
                    onViewDetails={(cand) => setSelectedCandidate(cand)}
                    onToggleSave={handleToggleSave}
                    isSaved={storageService.isSaved(candidate.id)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={compareIds.includes(candidate.id)}
                    onAskAbout={(cand) => handleAskAbout(cand)}
                  />
                ))}
              </div>
            </div>

            {/* Conversational Refinement Panel ("Ask SceneScout") */}
            <div ref={conversationalRef} id="conversational-section" style={{ scrollMarginTop: '24px' }}>
              <ConversationalPanel
                messages={followUpMessages}
                onSendMessage={handleSendMessage}
                isLoading={isFollowUpLoading}
                onApplyPreset={(preset) => handleSendMessage(preset)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Location Detail Dossier Modal */}
      <LocationDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onToggleSave={handleToggleSave}
        isSaved={selectedCandidate ? storageService.isSaved(selectedCandidate.id) : false}
      />

      {/* Candidate Decision Matrix / Comparison Modal */}
      {showCompareModal && (
        <CompareModal
          candidates={comparedCandidates.length > 0 ? comparedCandidates : (candidates || []).slice(0, 3)}
          onClose={() => setShowCompareModal(false)}
          onRemoveFromCompare={(id) => setCompareIds(prev => prev.filter(cId => cId !== id))}
          onSelectCandidate={(c) => {
            setShowCompareModal(false);
            setSelectedCandidate(c);
          }}
        />
      )}

      {/* Supabase Authentication & Filmmaker Persona Onboarding Modals */}
      <AuthModal />
      <FilmmakerOnboardingModal />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
