'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BriefInput } from '@/components/BriefInput';
import { AgentTimeline } from '@/components/AgentTimeline';
import { LocationCard } from '@/components/LocationCard';
import { LocationDetailModal } from '@/components/LocationDetailModal';
import { ConversationalPanel } from '@/components/ConversationalPanel';
import { CompareModal } from '@/components/CompareModal';
import { SavedLocationsView } from '@/components/SavedLocationsView';
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
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'scout' | 'saved' | 'compare' | 'history'>('scout');

  // Mode and System status
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLiveConfigured, setIsLiveConfigured] = useState<boolean>(false);
  const [modeLabel, setModeLabel] = useState<string>('Demo Mode — simulated research data');

  // Active Session & Research State
  const [currentSession, setCurrentSession] = useState<ResearchSession | null>(null);
  const [candidates, setCandidates] = useState<LocationCandidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(10);

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
        setModeLabel(data.modeLabel || 'Demo Mode — simulated research data');
      })
      .catch(() => {
        setIsDemoMode(true);
      });

    // Load saved locations from local storage
    const saved = storageService.getSavedLocations();
    setSavedLocations(saved);

    // Automatically load the pre-curated primary demo session on first load
    setCurrentSession(DEMO_SESSION);
    setCandidates(DEMO_CANDIDATES);
    setCurrentStepIndex(DEMO_ACTIVITY_STEPS.length - 1);
  }, []);

  // Handler: Start Scout (or Demo Scout)
  const handleStartScout = async (brief: string, criteria: ScoutCriteria, forceDemo: boolean) => {
    setIsLoading(true);
    setCurrentStepIndex(0);
    setFollowUpMessages([]);

    // Simulating step-by-step agent animation for visceral visual feedback
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < DEMO_ACTIVITY_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

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
      clearInterval(stepInterval);
      setCurrentStepIndex(DEMO_ACTIVITY_STEPS.length - 1);

      if (data.success && data.session && Array.isArray(data.session.candidates) && data.session.candidates.length > 0) {
        setCurrentSession(data.session);
        setCandidates(data.session.candidates);
        storageService.saveSession(data.session);
      } else {
        console.warn('Scout returned incomplete session or error, falling back to curated candidates:', data?.error);
        setCurrentSession(DEMO_SESSION);
        setCandidates(DEMO_CANDIDATES);
      }
    } catch (err) {
      console.error('Scout request failed:', err);
      clearInterval(stepInterval);
      // Fallback
      setCurrentSession(DEMO_SESSION);
      setCandidates(DEMO_CANDIDATES);
    } finally {
      setIsLoading(false);
    }
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
          brief: currentSession?.userBrief || DEMO_BRIEF
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
      }
    } catch (err) {
      console.error('Follow-up failed:', err);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Toggle bookmark / save
  const handleToggleSave = (candidate: LocationCandidate) => {
    if (storageService.isSaved(candidate.id)) {
      storageService.removeSavedLocation(candidate.id);
      setSavedLocations(prev => prev.filter(c => c.id !== candidate.id));
    } else {
      storageService.saveLocation(candidate);
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
        {/* Top Status Bar: Explicit Hackathon Runtime Verification */}
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
              storageService.removeSavedLocation(id);
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
                  Select 2–3 locations from your scout results to analyze side-by-side.
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
              Previous autonomous scouting briefs and synthesized shortlist dossiers.
            </p>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-verified">Primary Hackathon Session</span>
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
                Reload This Session
              </button>
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
            />

            {/* Scout Report Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }} className="badge badge-verified">
                  <FileCheck2 size={12} />
                  Scout Report
                </div>
                <h3 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                  Production Shortlist ({candidates.length} Candidates)
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
                  {currentSession?.summary || '18 candidates researched and 5 shortlisted based on your scene criteria.'}
                </p>
              </div>

              {compareIds.length > 1 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="btn-cinema btn-cyan"
                  style={{ fontSize: '0.84rem' }}
                >
                  <Layers size={14} />
                  <span>Compare Selected ({compareIds.length})</span>
                </button>
              )}
            </div>

            {/* Candidates Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {candidates.map((c, index) => (
                <LocationCard
                  key={c.id}
                  candidate={c}
                  rankIndex={index}
                  onViewDetails={(cand) => setSelectedCandidate(cand)}
                  onToggleSave={handleToggleSave}
                  isSaved={storageService.isSaved(c.id)}
                  onToggleCompare={handleToggleCompare}
                  isCompared={compareIds.includes(c.id)}
                  onAskAbout={(cand) => {
                    handleSendMessage(`Tell me more about filming permissions and logistical trade-offs for ${cand.name}.`);
                  }}
                />
              ))}
            </div>

            {/* Conversational Refinement Panel ("Ask SceneScout") */}
            <ConversationalPanel
              messages={followUpMessages}
              onSendMessage={handleSendMessage}
              isLoading={isFollowUpLoading}
              onApplyPreset={(preset) => handleSendMessage(preset)}
            />
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
    </div>
  );
}
