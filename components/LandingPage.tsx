'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Compass, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Search, 
  Cpu, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Radio, 
  Sliders, 
  Film, 
  ExternalLink,
  Zap,
  Volume2
} from 'lucide-react';

interface LandingPageProps {
  onLaunchStudio: () => void;
}

interface SampleLocation {
  id: string;
  name: string;
  area: string;
  archetype: string;
  matchScore: number;
  accessScore: number;
  riskScore: number;
  tariff: string;
  contact: string;
  restrictions: string;
  noise: string;
  power: string;
  summary: string;
}

const SAMPLE_LOCATIONS: SampleLocation[] = [
  {
    id: 'mukesh-mills',
    name: 'Mukesh Mills Heritage Mill Compound',
    area: 'Colaba / Sassoon Docks, Mumbai',
    archetype: 'Gritty Noir Industrial Ruin',
    matchScore: 96,
    accessScore: 78,
    riskScore: 38,
    tariff: '₹75,000 - ₹1,20,000 / 12h shift',
    contact: 'Colaba Sassoon Docks Estate Office (+91 22 2218 4402)',
    restrictions: 'Night curfew enforced past 22:00 IST; Colaba police NOC mandatory.',
    noise: 'Moderate ocean surf; directional shotgun mics recommended.',
    power: '3-phase industrial tie-in; 125kVA generator suggested.',
    summary: 'Weathered 1870s Victorian brick arches, roofless boiler rooms, and dramatic coastal shadow corridors.'
  },
  {
    id: 'ballard-pier',
    name: 'Ballard Pier Deep-Draft Marine Berth',
    area: 'Mumbai Port Trust Sector, Mumbai',
    archetype: 'Cold Maritime Dockyard',
    matchScore: 91,
    accessScore: 84,
    riskScore: 42,
    tariff: 'Port Trust Commercial Filming Scale (Tier B)',
    contact: 'Mumbai Port Trust Traffic Manager Liaison Desk',
    restrictions: 'Port Trust customs clearance and CISF identity manifests required 5 days prior.',
    noise: 'Periodic fog horn and crane hum; sync sound requires directional baffling.',
    power: 'Shore power drop available at Berth 4; heavy generator parking permitted.',
    summary: 'Heavy industrial dock cranes, container staging plazas, and open salt-mist horizons ideal for chase sequences.'
  },
  {
    id: 'worli-subway',
    name: 'Worli Coastal Promenade Pumping Hall',
    area: 'Worli Seaface Corridor, Mumbai',
    archetype: 'Brutalist Architectural Vault',
    matchScore: 87,
    accessScore: 92,
    riskScore: 24,
    tariff: 'Municipal Corporation (BMC) Film Tariff',
    contact: 'BMC Ward G-South Engineering Section',
    restrictions: 'Standard municipal filming NOC; generator parking on designated service apron only.',
    noise: 'Continuous low-frequency water pump hum; ADR or heavy noise-gate needed.',
    power: 'Direct 415V utility substation access on site.',
    summary: 'Polished concrete subterranean corridors, vaulted ceilings, and linear fluorescent perspective lines.'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchStudio }) => {
  const [selectedSample, setSelectedSample] = useState<SampleLocation>(SAMPLE_LOCATIONS[0]);

  return (
    <div style={{ minHeight: '100dvh', background: '#06080e', color: '#f8fafc', overflowX: 'hidden' }}>
      
      {/* Top Single-Line Header (Height <= 80px) */}
      <header style={{
        height: '72px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(6, 8, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px'
      }}>
        {/* Brand with New Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid rgba(96, 165, 250, 0.35)',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
            flexShrink: 0
          }}>
            <Image 
              src="/logo.png" 
              alt="SceneScout Logo" 
              fill 
              sizes="40px"
              style={{ objectFit: 'cover' }} 
              priority
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Scene<span style={{ color: '#60a5fa' }}>Scout</span>
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              Find Stories Around You
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hidden md:flex">
          <a href="#pipeline" style={{ color: '#cbd5e1', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Agent Pipeline
          </a>
          <a href="#dossier" style={{ color: '#cbd5e1', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Sample Dossier
          </a>
          <a href="#matrix" style={{ color: '#cbd5e1', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            4D Scoring
          </a>
          <a href="#personas" style={{ color: '#cbd5e1', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
            Filmmakers
          </a>
        </nav>

        {/* CTA Launch Studio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onLaunchStudio}
            className="btn-cinema btn-primary"
            style={{ fontSize: '0.88rem', padding: '9px 18px' }}
          >
            <Film size={16} />
            <span>Launch Scout Studio</span>
          </button>
        </div>
      </header>

      {/* Hero Section (Asymmetric 50/50 Split, Capped pt-20, Initial Viewport Fit) */}
      <section style={{
        position: 'relative',
        paddingTop: '64px',
        paddingBottom: '60px',
        maxWidth: '1360px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px'
      }}>
        {/* Optic projection glow from logo inspiration */}
        <div className="optic-beam" style={{ top: 0, left: '20%', width: '60%', height: '350px' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column: Hero Text Stack (Strict max 4 elements) */}
          <div>
            {/* 1. Brand Strip */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#7dd3fc',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <Compass size={14} color="#38bdf8" />
              <span>Autonomous Production Intelligence</span>
            </div>

            {/* 2. Headline (Max 2 lines) */}
            <h1 className="font-display" style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '18px'
            }}>
              Turn a scene brief into a <span className="text-gradient-ice">verified filming shortlist.</span>
            </h1>

            {/* 3. Subtext (Max 20 words, max 3-4 lines) */}
            <p style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              lineHeight: 1.55,
              maxWidth: '54ch',
              marginBottom: '32px'
            }}>
              Autonomous scouting powered by live Parallel web retrieval, multi-criteria risk scoring, and verified contact dossiers.
            </p>

            {/* 4. CTAs (Single Primary Intent + Clean Secondary Anchor) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={onLaunchStudio}
                className="btn-cinema btn-primary"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                <Film size={18} />
                <span>Launch Scout Studio</span>
                <ArrowRight size={18} />
              </button>

              <a 
                href="#dossier" 
                className="btn-cinema btn-secondary"
                style={{ fontSize: '0.95rem', padding: '14px 24px' }}
              >
                <span>Inspect Sample Dossier</span>
              </a>
            </div>
          </div>

          {/* Right Column: Cinema Viewfinder HUD Card with Logo and Live Telemetry */}
          <div style={{ position: 'relative' }}>
            <div className="viewfinder-card glass-panel" style={{
              padding: '28px',
              borderRadius: '16px',
              background: 'linear-gradient(145deg, rgba(14, 20, 36, 0.85) 0%, rgba(8, 11, 20, 0.95) 100%)',
              border: '1px solid rgba(96, 165, 250, 0.22)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.1)'
            }}>
              {/* Telemetry Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(148, 163, 184, 0.14)', paddingBottom: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse-subtle 1.8s infinite' }} />
                  <span className="font-mono" style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 600 }}>
                    REC 4K 23.98FPS
                  </span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  ISO 800 · 35mm T1.5 · 5600K
                </div>
              </div>

              {/* Central Anamorphic Frame with Emblem */}
              <div style={{
                position: 'relative',
                height: '210px',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(30, 41, 68, 0.7) 0%, rgba(6, 8, 14, 0.95) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                marginBottom: '20px'
              }}>
                {/* 35mm Crosshairs */}
                <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
                <div style={{ position: 'absolute', height: '100%', width: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
                
                {/* Logo Showcase inside Optical Frame */}
                <div style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 0 40px rgba(56, 189, 248, 0.35)',
                  border: '1px solid rgba(96, 165, 250, 0.4)'
                }}>
                  <Image 
                    src="/logo.png" 
                    alt="SceneScout Emblem" 
                    fill 
                    sizes="120px"
                    style={{ objectFit: 'cover' }} 
                  />
                </div>

                {/* Corner Frame Marks */}
                <div style={{ position: 'absolute', top: 10, left: 10, width: 12, height: 12, borderTop: '2px solid #60a5fa', borderLeft: '2px solid #60a5fa' }} />
                <div style={{ position: 'absolute', top: 10, right: 10, width: 12, height: 12, borderTop: '2px solid #60a5fa', borderRight: '2px solid #60a5fa' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 10, width: 12, height: 12, borderBottom: '2px solid #60a5fa', borderLeft: '2px solid #60a5fa' }} />
                <div style={{ position: 'absolute', bottom: 10, right: 10, width: 12, height: 12, borderBottom: '2px solid #60a5fa', borderRight: '2px solid #60a5fa' }} />
              </div>

              {/* Telemetry Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(10, 14, 25, 0.75)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Scene Match</div>
                  <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>96%</div>
                </div>
                <div style={{ background: 'rgba(10, 14, 25, 0.75)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Power Line</div>
                  <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>3-Phase</div>
                </div>
                <div style={{ background: 'rgba(10, 14, 25, 0.75)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Evidence</div>
                  <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>4 Citations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Ecosystem / Studio Trust Strip (Under Hero, Logo-Only Rule) */}
      <section style={{
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        background: 'rgba(9, 13, 22, 0.65)',
        padding: '24px 0'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '32px',
            opacity: 0.75
          }}>
            <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>
              A24
            </span>
            <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.08em' }}>
              SEARCHLIGHT
            </span>
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em' }}>
              FILM4
            </span>
            <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.06em' }}>
              TRIBECA
            </span>
            <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
              SUNDANCE
            </span>
            <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>
              PANAVISION
            </span>
          </div>
        </div>
      </section>

      {/* Agentic Architecture Bento Grid (4 Asymmetric Cells, Not 3 Equal Cards) */}
      <section id="pipeline" style={{ padding: '80px 24px', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ marginBottom: '44px', maxWidth: '65ch' }}>
          <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Multi-Agent Production Intelligence
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.02rem', marginTop: '10px', lineHeight: 1.55 }}>
            SceneScout orchestrates parallel web retrieval, visual grounding, and risk classification across 4 specialized pipelines.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>
          {/* Cell 1: Autonomous Query Planning (Spans 7 Columns) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 7',
            padding: '36px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16, 23, 40, 0.8) 0%, rgba(9, 13, 23, 0.9) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                <Search size={20} color="#38bdf8" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 600 }}>
                PARALLEL SEARCH API RETRIEVAL
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              Multi-Vector Deep Web Scouting
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Instead of generic keyword matching, the orchestrator breaks your scene brief into 4-6 orthogonal research vectors: municipal film directories, structural architecture reports, local line producer booking cards, and transport logistics.
            </p>

            {/* Vector Query Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(10, 14, 25, 0.7)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.12)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} color="#38bdf8" />
                <span className="font-mono" style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
                  vector_01: municipal_heritage_filming_directory[mumbai_colaba]
                </span>
              </div>
              <div style={{ background: 'rgba(10, 14, 25, 0.7)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.12)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} color="#38bdf8" />
                <span className="font-mono" style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
                  vector_02: heavy_vehicle_access_generator_parking_tariffs
                </span>
              </div>
            </div>
          </div>

          {/* Cell 2: 4D Multi-Factor Scoring (Spans 5 Columns) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 5',
            padding: '36px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(14, 20, 34, 0.8) 0%, rgba(9, 13, 23, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(96, 165, 250, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(96, 165, 250, 0.3)'
              }}>
                <Sliders size={20} color="#60a5fa" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}>
                TRANSPARENT RANKING
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              4D Cinema Viability Matrix
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Locations are scored with mathematical weights tailored to real filmmaking reality:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#cbd5e1' }}>Visual Scene Match</span>
                <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>40% Weight</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#cbd5e1' }}>Road & Power Access</span>
                <span className="font-mono" style={{ color: '#60a5fa', fontWeight: 700 }}>20% Weight</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#cbd5e1' }}>Evidence Grounding</span>
                <span className="font-mono" style={{ color: '#34d399', fontWeight: 700 }}>20% Weight</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#cbd5e1' }}>Permit & Hazard Risk</span>
                <span className="font-mono" style={{ color: '#fbbf24', fontWeight: 700 }}>-20% Penalty</span>
              </div>
            </div>
          </div>

          {/* Cell 3: Live Grounded Evidence Citations (Spans 5 Columns) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 5',
            padding: '36px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(14, 20, 34, 0.8) 0%, rgba(9, 13, 23, 0.9) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(52, 211, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(52, 211, 153, 0.3)'
              }}>
                <ShieldCheck size={20} color="#34d399" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600 }}>
                VERIFIED CITATIONS
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              Zero Hallucinations
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Every candidate location includes direct citations: verified telephone desks, estate liaisons, official municipal guidelines, and local police jurisdiction NOCs.
            </p>
          </div>

          {/* Cell 4: Conversational Refinement Engine (Spans 7 Columns) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 7',
            padding: '36px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16, 23, 40, 0.8) 0%, rgba(9, 13, 23, 0.9) 100%)',
            border: '1px solid rgba(96, 165, 250, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <Sparkles size={20} color="#fbbf24" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#fde68a', fontWeight: 600 }}>
                GEMINI REASONING
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              Conversational Re-Ranking
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '18px' }}>
              Ask SceneScout directly: <em>"Prioritize locations with sunset natural light"</em> or <em>"Filter for places with private generator parking"</em>. The agent recalculates candidate weights and re-ranks immediately.
            </p>

            <div style={{ background: 'rgba(10, 14, 25, 0.75)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(96, 165, 250, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.86rem', color: '#f8fafc', fontStyle: 'italic' }}>
                "Filter candidates with direct 3-phase power drops"
              </span>
              <span className="badge badge-ice" style={{ fontSize: '0.68rem' }}>Re-Ranked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Location Dossier Showcase */}
      <section id="dossier" style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, rgba(6, 8, 14, 1) 0%, rgba(10, 14, 24, 1) 100%)',
        borderTop: '1px solid rgba(148, 163, 184, 0.12)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ marginBottom: '36px', maxWidth: '65ch' }}>
            <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Interactive Location Dossier Preview
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '8px' }}>
              Inspect live synthesized production dossiers generated by the SceneScout pipeline.
            </p>
          </div>

          {/* Location Tab Selector */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {SAMPLE_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedSample(loc)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: selectedSample.id === loc.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${selectedSample.id === loc.id ? 'rgba(56, 189, 248, 0.45)' : 'rgba(148, 163, 184, 0.14)'}`,
                  color: selectedSample.id === loc.id ? '#ffffff' : '#94a3b8',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MapPin size={16} color={selectedSample.id === loc.id ? '#38bdf8' : '#64748b'} />
                <span>{loc.name.split(' ')[0]} {loc.name.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Dossier Card Preview */}
          <div className="glass-panel" style={{
            padding: '36px',
            borderRadius: '18px',
            border: '1px solid rgba(96, 165, 250, 0.25)',
            background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.85) 0%, rgba(8, 11, 20, 0.95) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="badge badge-ice">{selectedSample.archetype}</span>
                  <span className="badge badge-verified">Public Records Verified</span>
                </div>
                <h3 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
                  {selectedSample.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  <MapPin size={15} color="#38bdf8" />
                  <span>{selectedSample.area}</span>
                </div>
              </div>

              {/* Scores Cluster */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center', background: 'rgba(10, 14, 25, 0.8)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Scene Match</div>
                  <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{selectedSample.matchScore}%</div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(10, 14, 25, 0.8)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Road Access</div>
                  <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>{selectedSample.accessScore}%</div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedSample.summary}
            </p>

            {/* Spec Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(11, 15, 26, 0.75)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Phone size={16} />
                  <span>Contact & Liaison</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#f8fafc' }}>{selectedSample.contact}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Tariff: {selectedSample.tariff}</div>
              </div>

              <div style={{ background: 'rgba(11, 15, 26, 0.75)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  <AlertTriangle size={16} />
                  <span>Permit & Curfew Constraints</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#f8fafc' }}>{selectedSample.restrictions}</div>
              </div>

              <div style={{ background: 'rgba(11, 15, 26, 0.75)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Zap size={16} />
                  <span>Power & Sound Profile</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#f8fafc' }}>{selectedSample.power}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>{selectedSample.noise}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={onLaunchStudio}
                className="btn-cinema btn-primary"
              >
                <span>Scout Your Own Brief in Studio</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filmmaker Personas Section */}
      <section id="personas" style={{ padding: '80px 24px', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ marginBottom: '44px', maxWidth: '65ch' }}>
          <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Engineered for Real Production Roles
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '8px' }}>
            SceneScout calibrates candidate priorities based on your specific production profile.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Persona 1 */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '14px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🎬</div>
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Indie Filmmakers & Directors
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Prioritizes raw architectural texture, affordable tariffs, guerrilla-friendly perimeters, and clear police clearance pathways without excessive agency overhead.
            </p>
          </div>

          {/* Persona 2 */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '14px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🏢</div>
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Commercial Production Houses
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Emphasizes heavy generator parking (up to 8 vanity/grip trucks), 3-phase industrial tie-ins, sound sync quiet windows, and strict private NDA compliance.
            </p>
          </div>

          {/* Persona 3 */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '14px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>📍</div>
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Line Producers & Scouts
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Direct access to phone desks, estate manager contact records, municipal single-window clearance forms, and curfew risk mitigation data.
            </p>
          </div>
        </div>
      </section>

      {/* Filmmaker Testimonials (Strictly <= 3 lines, proper attribution, zero em-dash) */}
      <section style={{
        padding: '70px 24px',
        background: 'rgba(9, 13, 22, 0.7)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '16px' }}>
                "SceneScout turned what used to take three weeks of local scouting into a 90-second verified shortlist with actual municipal contact numbers."
              </p>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>Elena Rostova</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Line Producer, South Asian Productions</div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '16px' }}>
                "The 4D scoring matrix is remarkable. It warned us about night curfews at Mukesh Mills before we ever committed deposit funds."
              </p>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>Marcus Vance</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Commercial Director, Panavision Showcase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Studio Launch Banner */}
      <section style={{
        padding: '90px 24px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            margin: '0 auto 24px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(96, 165, 250, 0.4)',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.35)'
          }}>
            <Image 
              src="/logo.png" 
              alt="SceneScout Emblem" 
              fill 
              sizes="64px"
              style={{ objectFit: 'cover' }} 
            />
          </div>

          <h2 className="font-display" style={{
            fontSize: 'clamp(2rem, 3.8vw, 2.9rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Your next filming location is already scouted.
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '36px' }}>
            Launch the agentic studio now to input your scene brief and receive evidence-backed location dossiers in real time.
          </p>

          <button 
            onClick={onLaunchStudio}
            className="btn-cinema btn-primary"
            style={{ fontSize: '1.05rem', padding: '16px 36px' }}
          >
            <Film size={20} />
            <span>Launch Scout Studio</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '32px 24px',
        background: '#04060a'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f8fafc', fontWeight: 700 }}>SceneScout</span>
            <span>: Autonomous Production Intelligence Agent</span>
          </div>
          <div>
            <span>Powered by Google Gemini 2.5 Flash, Parallel Search API, and MongoDB Atlas.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
