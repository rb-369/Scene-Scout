'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Film, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal,
  Compass, 
  PhoneCall, 
  Layers, 
  CheckCircle2, 
  Video, 
  FileText,
  Clock,
  Zap,
  Radio,
  Eye
} from 'lucide-react';

interface LandingPageProps {
  onLaunchStudio: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchStudio }) => {
  const [activeDossierTab, setActiveDossierTab] = useState<number>(0);

  const sampleDossiers = [
    {
      id: 'mukesh-mills',
      name: 'Mukesh Textile Compound',
      area: 'Colaba, South Mumbai',
      archetype: 'Industrial Warehouse • Dilapidated Mill',
      image: '/images/cinema_warehouse_still.jpg',
      aspectRatio: '2.39:1 Anamorphic',
      cameraSetup: 'ARRI Alexa 35 • 35mm Master Prime T1.3',
      lightingNotes: 'High-vaulted rusted steel rafters with volumetric afternoon dust rays. 3200K tungsten practicals complement natural daylight.',
      sceneMatch: 96,
      roadAccess: 88,
      permitRisk: 15,
      powerDrop: '3-Phase 100A Available',
      tariff: '₹45,000 / day',
      contact: 'South Zone Estates Liaison Desk • +91 22 2285 4100',
      keyRestriction: 'Sound recording requires interior acoustic baffles due to nearby coastal breeze.'
    },
    {
      id: 'ballard-pier',
      name: 'Ballard Pier Marine Berth',
      area: 'Port Trust Area, Mumbai',
      archetype: 'Maritime Dock • Deep-Draft Cargo Terminal',
      image: '/images/cinema_maritime_berth.jpg',
      aspectRatio: '2.39:1 Anamorphic',
      cameraSetup: 'RED V-Raptor XL • 50mm Anamorphic T2.0',
      lightingNotes: 'Cold sodium-vapor industrial floodlights casting deep reflections on wet tarmac. Heavy ocean mist at dusk.',
      sceneMatch: 91,
      roadAccess: 84,
      permitRisk: 22,
      powerDrop: 'Industrial Shore Power Tie-In',
      tariff: '₹85,000 / day',
      contact: 'Port Authority Filming Officer • +91 22 6656 5656',
      keyRestriction: 'Night shoots require 7-day prior Coast Guard security manifest clearance.'
    },
    {
      id: 'worli-coastal',
      name: 'Worli Sea Promontory Fortress',
      area: 'Worli Headland, Mumbai',
      archetype: 'Coastal Rocky Shore • Weathered Bastion',
      image: '/images/cinema_coastal_outpost.jpg',
      aspectRatio: '2.39:1 Anamorphic',
      cameraSetup: 'Sony Venice 2 • 28mm Panavision Primo T1.9',
      lightingNotes: 'Unobstructed western exposure with raking 5600K golden hour sunlight breaking across dark basalt rocks.',
      sceneMatch: 94,
      roadAccess: 76,
      permitRisk: 18,
      powerDrop: 'Generator Truck Dedicated Bay',
      tariff: '₹35,000 / day',
      contact: 'Maharashtra Heritage & Tourism Desk • +91 22 2204 4040',
      keyRestriction: 'High-tide surf requires safety perimeter for camera dolly setups on low rocks.'
    }
  ];

  const currentDossier = sampleDossiers[activeDossierTab];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07080a', color: '#f4f4f5' }}>
      {/* Top Directorial Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(7, 8, 10, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              position: 'relative',
              backgroundColor: '#000'
            }}>
              <Image 
                src="/logo.png" 
                alt="SceneScout Logo" 
                width={38} 
                height={38} 
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div>
              <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Scene<span style={{ color: '#fbbf24' }}>Scout</span>
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#a1a1aa',
                letterSpacing: '0.12em',
                display: 'block',
                marginTop: '-3px'
              }}>
                FIND STORIES AROUND YOU
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#dossier-preview" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
              Location Dossiers
            </a>
            <a href="#pipeline" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
              Scouting Pipeline
            </a>
            <a href="#crew-roles" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
              For Filmmakers
            </a>
            <button
              onClick={onLaunchStudio}
              className="btn-cinema btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.84rem' }}
            >
              <Film size={15} />
              <span>Launch Studio</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section: The Director's Viewport */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '56px 24px 48px',
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: '40px',
        alignItems: 'center',
        minHeight: 'calc(100vh - 140px)'
      }}>
        {/* Left Column: Directorial Value Proposition */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }} className="animate-tally" />
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#fbbf24',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)'
            }}>
              Director Viewfinder • 35mm Scouting Intelligence
            </span>
          </div>

          <h1 className="font-display" style={{
            fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '20px'
          }}>
            Find the frame before you <span className="text-gradient-gold">move the crew.</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.55,
            color: '#a1a1aa',
            marginBottom: '32px',
            maxWidth: '540px'
          }}>
            Autonomous location intelligence with verified municipal permits, generator access, sunrise angles, and direct liaison contacts.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button
              onClick={onLaunchStudio}
              className="btn-cinema btn-primary"
              style={{ padding: '14px 28px', fontSize: '0.98rem' }}
            >
              <Film size={18} />
              <span>Enter Scout Studio</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="#dossier-preview"
              className="btn-cinema btn-secondary"
              style={{ padding: '14px 24px', fontSize: '0.92rem' }}
            >
              <span>Inspect Sample Dossier</span>
            </a>
          </div>

          {/* Director's Telemetry Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Aspect Ratio
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f4f4f5' }}>
                2.39:1 Anamorphic
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

            <div>
              <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Color Temperature
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fbbf24' }}>
                3200K & 5600K
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

            <div>
              <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Verification
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#10b981' }}>
                Zero Hallucinations
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Director's Monitor (2.39:1 Anamorphic Frame) */}
        <div style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          backgroundColor: '#000000',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.15)'
        }}>
          {/* Real 35mm Cinematic Film Still */}
          <div style={{ position: 'relative', width: '100%', height: '360px' }}>
            <Image
              src="/images/cinema_warehouse_still.jpg"
              alt="Cinematic 35mm film still of industrial warehouse filming location"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Dark Letterbox Mattes */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '32px',
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#d4d4d8',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} className="animate-tally" />
                <span style={{ fontWeight: 700, color: '#ef4444' }}>REC 24.00 FPS</span>
                <span>•</span>
                <span>ARRI ALEXA 35</span>
              </div>
              <div>
                <span>35MM T1.3 • 800 ISO • 3200K</span>
              </div>
            </div>

            {/* Corner Reticles */}
            <div className="viewfinder-corner-tl" style={{ top: '40px' }} />
            <div className="viewfinder-corner-tr" style={{ top: '40px' }} />
            <div className="viewfinder-corner-bl" style={{ bottom: '40px' }} />
            <div className="viewfinder-corner-br" style={{ bottom: '40px' }} />

            {/* Center Crosshair */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', top: '11px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
              <div style={{ position: 'absolute', left: '11px', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
            </div>

            {/* Bottom Letterbox Matte with Location Telemetry */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '36px',
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#fbbf24',
              zIndex: 10
            }}>
              <span style={{ fontWeight: 600 }}>MUKESH MILLS COMPOUND • COLABA</span>
              <span style={{ color: '#10b981' }}>NOC CLEARED • ₹45K/DAY</span>
            </div>
          </div>

          {/* Location Verification Footnote */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#0d0f14',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={14} color="#fbbf24" />
              <span style={{ fontSize: '0.8rem', color: '#d4d4d8' }}>
                Raking sunset sunbeams • 3-Phase power drop on site
              </span>
            </div>
            <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
              96% Scene Match
            </span>
          </div>
        </div>
      </section>

      {/* Studio Trust Strip: Monochrome Cinema Emblems */}
      <section style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#090a0d',
        padding: '24px 0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '32px'
        }}>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: 900,
            letterSpacing: '0.2em',
            color: '#71717a',
            fontFamily: 'var(--font-display)'
          }}>
            A24
          </span>
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: '#71717a',
            fontFamily: 'var(--font-display)'
          }}>
            SEARCHLIGHT
          </span>
          <span style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#71717a',
            fontFamily: 'var(--font-display)'
          }}>
            FILM4
          </span>
          <span style={{
            fontSize: '1rem',
            fontWeight: 900,
            letterSpacing: '0.14em',
            color: '#71717a',
            fontFamily: 'var(--font-display)'
          }}>
            WARNER BROS.
          </span>
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: '#71717a',
            fontFamily: 'var(--font-display)'
          }}>
            SUNDANCE
          </span>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: '#71717a',
            fontFamily: 'var(--font-display)'
          }}>
            PANAVISION
          </span>
        </div>
      </section>

      {/* Production Bento Grid: The 4 Directorial Pillars */}
      <section id="pipeline" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 className="font-display" style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '10px'
          }}>
            Engineered for call sheets, not tech demos.
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '580px' }}>
            From screenplay scene headings to generator vehicle clearance, SceneScout solves the real logistical friction of physical filmmaking.
          </p>
        </div>

        {/* Asymmetric 4-Cell Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '20px'
        }}>
          {/* Cell 1: Script Breakdown to Location Match (Span 7) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 7',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Film size={18} color="#fbbf24" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', color: '#fbbf24', textTransform: 'uppercase' }}>
                  Aesthetic Synthesis
                </span>
              </div>
              <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                Script Breakdown to Scouting Intelligence
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Paste screenplay scene headings or director lookbooks. SceneScout extracts lighting conditions, atmospheric haze, acoustic constraints, and spatial framing requirements before scouring public archives and real estate records.
              </p>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#d4d4d8'
            }}>
              <span style={{ color: '#fbbf24' }}>SCENE 42 • EXT. BALLARD PIER - DUSK</span>
              <p style={{ color: '#a1a1aa', marginTop: '4px', fontSize: '0.76rem' }}>
                Looking for cold industrial maritime dock, heavy cargo cranes, wet asphalt reflection. Power drop required for 18K HMI backlight.
              </p>
            </div>
          </div>

          {/* Cell 2: Logistical Rigor (Span 5) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 5',
            padding: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Zap size={18} color="#10b981" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', color: '#10b981', textTransform: 'uppercase' }}>
                Set Electrics & Access
              </span>
            </div>
            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
              Generator Drops & Road Clearance
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Locations that look cinematic on photos frequently collapse when basecamp trucks cannot turn on narrow roads. SceneScout verifies heavy equipment access and power capacity.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#71717a' }}>Generator Truck Bay</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Dedicated Parking Verified</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#71717a' }}>3-Phase Power</span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>100A Shore Tie-in</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#71717a' }}>Sound Floor</span>
                <span style={{ color: '#f4f4f5', fontWeight: 600 }}>38 dBA Acoustic Noise Floor</span>
              </div>
            </div>
          </div>

          {/* Cell 3: Zero-Hallucination Permitting (Span 5) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 5',
            padding: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <PhoneCall size={18} color="#fbbf24" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', color: '#fbbf24', textTransform: 'uppercase' }}>
                Verified Desks
              </span>
            </div>
            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
              Zero Hallucinations
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every candidate location includes verified municipal filing liaison desks, real telephone contacts, police jurisdiction clearance protocols, and official daily tariff numbers.
            </p>
          </div>

          {/* Cell 4: Conversational Re-Lighting (Span 7) */}
          <div className="glass-panel" style={{
            gridColumn: 'span 7',
            padding: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={18} color="#60a5fa" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', color: '#60a5fa', textTransform: 'uppercase' }}>
                Interactive Refinement
              </span>
            </div>
            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
              Conversational Re-Lighting & Re-Scoring
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
              Direct the agent as you would your location manager. Request changes in plain English and watch the ranking weights recalculate immediately.
            </p>

            <div style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontStyle: 'italic',
              color: '#d4d4d8',
              fontSize: '0.86rem'
            }}>
              <span>"Filter for locations facing west with direct sunset light and under ₹50k daily tariff"</span>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                Re-Ranked
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Location Dossier Preview */}
      <section id="dossier-preview" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 24px 80px'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 className="font-display" style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            Interactive Location Dossier
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>
            Click through actual verified scouting dossiers synthesized by SceneScout.
          </p>
        </div>

        {/* Location Selection Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {sampleDossiers.map((dossier, idx) => (
            <button
              key={dossier.id}
              onClick={() => setActiveDossierTab(idx)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: activeDossierTab === idx ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: activeDossierTab === idx ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                color: activeDossierTab === idx ? '#fbbf24' : '#a1a1aa',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <MapPin size={15} />
              <span>{dossier.name}</span>
            </button>
          ))}
        </div>

        {/* Active Dossier Display Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'center' }}>
            {/* Cinematic Still Visual */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '340px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <Image
                src={currentDossier.image}
                alt={currentDossier.name}
                fill
                style={{ objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '8px 14px',
                backgroundColor: 'rgba(0,0,0,0.85)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#d4d4d8',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{currentDossier.cameraSetup}</span>
                <span style={{ color: '#fbbf24' }}>{currentDossier.aspectRatio}</span>
              </div>
            </div>

            {/* Dossier Metadata & Production Clearance */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-gold">{currentDossier.area}</span>
                <span className="badge badge-cleared">Public Records Verified</span>
              </div>

              <h3 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                {currentDossier.name}
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.88rem', marginBottom: '18px', fontStyle: 'italic' }}>
                {currentDossier.archetype}
              </p>

              <p style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentDossier.lightingNotes}
              </p>

              {/* Telemetry Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                padding: '14px',
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Scene Match
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                    {currentDossier.sceneMatch}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Road Access
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                    {currentDossier.roadAccess}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Daily Tariff
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                    {currentDossier.tariff}
                  </div>
                </div>
              </div>

              {/* Direct Liaison Contact */}
              <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '10px' }}>
                <strong style={{ color: '#f4f4f5' }}>Liaison Desk:</strong> {currentDossier.contact}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '24px' }}>
                <strong style={{ color: '#f4f4f5' }}>Key Notice:</strong> {currentDossier.keyRestriction}
              </div>

              <button
                onClick={onLaunchStudio}
                className="btn-cinema btn-primary"
                style={{ width: '100%', fontSize: '0.9rem' }}
              >
                <span>Scout This Style in Studio</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filmmaker Roles: For Directors, DPs, and Line Producers */}
      <section id="crew-roles" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#090a0d',
        padding: '72px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Built for the department heads.
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
              Different crew members evaluate different constraints. SceneScout serves them all.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ color: '#fbbf24', marginBottom: '14px' }}>
                <Eye size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Director of Photography
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Track natural lighting angles, sunrise azimuth, shadow falloff, high-ceiling rigging capacity, and anamorphic lens clearances before tech scouts.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ color: '#10b981', marginBottom: '14px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Line Producer
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Predict daily municipal tariffs, police jurisdiction requirements, equipment truck turning radii, and generator parking availability.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ color: '#60a5fa', marginBottom: '14px' }}>
                <Layers size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Production Designer
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Inspect architectural period accuracy, surface textures, structural load points, and spatial patina to build sets in authentic physical locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h2 className="font-display" style={{
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '16px'
        }}>
          Ready to scout your next production?
        </h2>
        <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 32px' }}>
          Describe your scene brief and let SceneScout investigate locations across municipal records and web archives.
        </p>

        <button
          onClick={onLaunchStudio}
          className="btn-cinema btn-primary"
          style={{ padding: '16px 36px', fontSize: '1rem' }}
        >
          <Film size={18} />
          <span>Launch Scout Studio Now</span>
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Directorial Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#050608',
        padding: '32px 24px',
        fontSize: '0.8rem',
        color: '#71717a'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f4f4f5', fontWeight: 700 }}>SceneScout</span>
            <span>•</span>
            <span>Agentic Cinema Production Intelligence</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Gemini 2.5 Flash</span>
            <span>Parallel Search API</span>
            <span>MongoDB Atlas</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
