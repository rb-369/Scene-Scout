'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Sparkles, 
  SlidersHorizontal, 
  MapPin, 
  Sliders, 
  Clapperboard, 
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ScoutCriteria } from '@/lib/types';
import { DEMO_BRIEF } from '@/lib/demoData';

interface BriefInputProps {
  onStartScout: (brief: string, criteria: ScoutCriteria, forceDemo: boolean) => void;
  isLoading: boolean;
}

export const BriefInput: React.FC<BriefInputProps> = ({ onStartScout, isLoading }) => {
  const [brief, setBrief] = useState(DEMO_BRIEF);
  const [city, setCity] = useState('Mumbai');
  const [sceneType, setSceneType] = useState('Industrial Warehouse Thriller');
  const [budgetSensitivity, setBudgetSensitivity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [maxDistance, setMaxDistance] = useState<number>(35);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Weights
  const [sceneMatchWeight, setSceneMatchWeight] = useState(40);
  const [accessibilityWeight, setAccessibilityWeight] = useState(20);
  const [evidenceWeight, setEvidenceWeight] = useState(20);
  const [riskWeight, setRiskWeight] = useState(20);

  const handleSubmit = (e: React.FormEvent, forceDemo: boolean = false) => {
    e.preventDefault();
    if (!brief.trim()) return;

    const criteria: ScoutCriteria = {
      city,
      sceneType,
      budgetSensitivity,
      maxDistanceKm: maxDistance,
      priorities: {
        sceneMatch: sceneMatchWeight,
        accessibility: accessibilityWeight,
        evidenceQuality: evidenceWeight,
        productionRisk: riskWeight
      }
    };

    onStartScout(brief, criteria, forceDemo);
  };

  const handleQuickPrompt = (promptText: string, targetCity: string, targetType: string) => {
    setBrief(promptText);
    setCity(targetCity);
    setSceneType(targetType);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Hero Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }} className="badge badge-cyan">
          <Clapperboard size={12} />
          Autonomous Production Intelligence
        </div>
        <h2 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '8px' }}>
          Give your next scene a <span className="text-gradient-gold">place</span>.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px' }}>
          SceneScout doesn't just search the web for filmmakers. It autonomously investigates locations, verifies public records, cross-checks municipal filming restrictions, and delivers a production-ready shortlist.
        </p>
      </div>

      {/* Main Input Form Card */}
      <div className="glass-panel" style={{ padding: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
              Describe your scene & location requirements
            </label>
            <textarea
              rows={4}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="e.g. Find 5 industrial warehouse filming locations in Mumbai suitable for a high-intensity thriller chase..."
              style={{
                width: '100%',
                background: 'rgba(10, 14, 22, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.98rem',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(245, 158, 11, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
          </div>

          {/* Controls Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Primary City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(10, 14, 22, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Scene Genre / Archetype
              </label>
              <input
                type="text"
                value={sceneType}
                onChange={(e) => setSceneType(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(10, 14, 22, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Budget Sensitivity
              </label>
              <select
                value={budgetSensitivity}
                onChange={(e) => setBudgetSensitivity(e.target.value as any)}
                style={{
                  width: '100%',
                  background: '#0a0e16',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.88rem'
                }}
              >
                <option value="Low">Low (Premium heritage sites)</option>
                <option value="Moderate">Moderate (Standard commercial rates)</option>
                <option value="High">High (Cost-effective / municipal lands)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Radius Limit: {maxDistance} km
              </label>
              <input
                type="range"
                min={5}
                max={100}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', marginTop: '6px' }}
              />
            </div>
          </div>

          {/* Collapsible Advanced Scoring Priorities */}
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <SlidersHorizontal size={14} />
              <span>{showAdvanced ? 'Hide Priority Weights' : 'Customize Scoring Priorities (Scene Match, Risk, Access)'}</span>
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAdvanced && (
              <div style={{
                marginTop: '12px',
                padding: '14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Visual Match Weight</span>
                    <span style={{ fontWeight: 700, color: '#fbbf24' }}>{sceneMatchWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={sceneMatchWeight}
                    onChange={(e) => setSceneMatchWeight(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#f59e0b' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Accessibility & Logistics</span>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>{accessibilityWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={accessibilityWeight}
                    onChange={(e) => setAccessibilityWeight(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#06b6d4' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Evidence Quality</span>
                    <span style={{ fontWeight: 700, color: '#34d399' }}>{evidenceWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={40}
                    value={evidenceWeight}
                    onChange={(e) => setEvidenceWeight(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#10b981' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Risk Avoidance Penalty</span>
                    <span style={{ fontWeight: 700, color: '#f87171' }}>{riskWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={riskWeight}
                    onChange={(e) => setRiskWeight(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ef4444' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isLoading}
                className="btn-cinema btn-secondary"
                style={{ background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}
              >
                <Play size={16} fill="#fbbf24" />
                <span>Run Demo Scout (1-Click)</span>
              </button>

              <button
                type="button"
                onClick={() => setBrief(DEMO_BRIEF)}
                className="btn-cinema btn-secondary"
                title="Reset to default hackathon demo scenario"
                style={{ padding: '8px 12px' }}
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-cinema btn-primary"
                style={{ minWidth: '160px' }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(0,0,0,0.2)',
                      borderTopColor: '#000',
                      borderRadius: '50%',
                      animation: 'spin-slow 0.8s linear infinite'
                    }} />
                    <span>Scouting Web...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} strokeWidth={2.5} />
                    <span>Start Scout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Scenario Preset Chips */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: 600 }}>
            Quick Demo Scenarios
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickPrompt(
                "Find 5 warehouse or industrial-style filming locations in Mumbai suitable for a thriller scene. Prioritize strong visual match, realistic accessibility, useful public information, and low production risk. Include location details, why it matches the scene, potential filming restrictions or uncertainties, contact information if publicly available, and sources.",
                "Mumbai",
                "Industrial Warehouse Thriller"
              )}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '6px 12px',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🏭 Mumbai Industrial Thriller (Primary Demo)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPrompt(
                "Locate 4 atmospheric coastal docklands and maritime container terminals in Mumbai for an espionage drop sequence. Focus on night lighting, crane visibility, and port authority clearances.",
                "Mumbai",
                "Espionage Maritime Docklands"
              )}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '6px 12px',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🚢 Coastal Port & Freight Depots</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPrompt(
                "Identify abandoned textile mills with gothic ironwork and overgrown courtyards for a psychological suspense climax in South Mumbai.",
                "Mumbai",
                "Abandoned Gothic Mill Ruins"
              )}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '6px 12px',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🏚️ Heritage Mill Ruins</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
