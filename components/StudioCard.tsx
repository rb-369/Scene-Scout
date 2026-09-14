'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Maximize2, 
  Phone, 
  Mail, 
  Globe, 
  Volume2
} from 'lucide-react';
import { StudioCandidate } from '@/lib/types';

interface StudioCardProps {
  studio: StudioCandidate;
  onAskAboutStudio?: (studio: StudioCandidate) => void;
}

export function StudioCard({ studio, onAskAboutStudio }: StudioCardProps) {
  const [viewMode, setViewMode] = useState<'still' | 'satellite'>('still');
  const [showContact, setShowContact] = useState<boolean>(false);

  const lat = studio.coordinates.lat;
  const lng = studio.coordinates.lng;
  const satelliteEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`;
  const mapsUrl = studio.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${studio.name}, ${studio.city}`)}`;
  const earthUrl = studio.googleEarthUrl || `https://earth.google.com/web/search/${encodeURIComponent(`${studio.name} ${studio.city}`)}`;

  return (
    <article 
      className="location-card location-card-compact"
      style={{
        border: '1px solid rgba(245, 158, 11, 0.3)',
        background: 'linear-gradient(180deg, rgba(16, 20, 26, 0.95) 0%, rgba(10, 13, 18, 0.98) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* 16:9 Viewfinder Cinematic Still or Real Google Satellite Embed */}
      <div 
        className="location-card-viewport"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {viewMode === 'still' ? (
          <>
            <Image
              src={studio.image || '/images/cinema_warehouse_still.jpg'}
              alt={studio.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="location-card-still"
            />
            <div className="location-card-reticle" aria-hidden="true">
              <span className="reticle-tl">+</span>
              <span className="reticle-tr">+</span>
              <span className="reticle-bl">+</span>
              <span className="reticle-br">+</span>
              <span className="reticle-center">✛</span>
              <span className="reticle-sensor">
                <span className="rec-dot animate-pulse-subtle" />
                VIRTUAL PRODUCTION / SOUNDSTAGE
              </span>
              <span className="reticle-format">ICVFX · STAGECRAFT</span>
            </div>
          </>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
            <iframe
              src={satelliteEmbedUrl}
              title={`Google Maps Satellite View of ${studio.name}`}
              width="100%"
              height="100%"
              style={{ border: 0, width: '100%', height: '100%', filter: 'contrast(1.08) brightness(0.95)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Satellite Recon Overlay HUD */}
            <div 
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(9, 12, 12, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '6px',
                padding: '3px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: '#fbbf24',
                zIndex: 3,
                pointerEvents: 'none'
              }}
            >
              <Globe size={11} />
              <span>{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(9, 12, 12, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#ffffff',
                textDecoration: 'none',
                zIndex: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
              title="Open full interactive map on Google Maps"
            >
              <span>Live Maps</span>
              <ExternalLink size={11} color="#fbbf24" />
            </a>
          </div>
        )}

        {/* View Toggle Pill (Cinematic Still vs Real Google Earth Satellite) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(9, 12, 12, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '2px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)'
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('still')}
            style={{
              background: viewMode === 'still' ? '#d38a45' : 'transparent',
              color: viewMode === 'still' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '16px',
              padding: '3px 9px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease'
            }}
            title="Switch to Stage Facility View"
          >
            <span>🎬 Facility Still</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            style={{
              background: viewMode === 'satellite' ? '#0284c7' : 'transparent',
              color: viewMode === 'satellite' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '16px',
              padding: '3px 9px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease'
            }}
            title="Switch to Real Google Maps / Earth Satellite View"
          >
            <span>🛰️ Google Earth</span>
          </button>
        </div>
      </div>

      {/* Topline Badge */}
      <header className="location-card-topline">
        <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
          <Building2 size={11} /> {studio.stageType}
        </span>
        <span className="location-overall" style={{ color: '#fbbf24' }}>
          <span>Rating</span><strong>A+</strong>
        </span>
      </header>

      {/* Title & Google Maps Link */}
      <div className="location-card-title-row">
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.12rem', color: '#ffffff', lineHeight: 1.3 }}>{studio.name}</h3>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="location-place-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.82rem',
              marginTop: '4px'
            }}
            title="Open exact studio complex in Google Maps"
          >
            <MapPin size={13} />
            <span>{studio.city}, {studio.country}</span>
            <ExternalLink size={11} style={{ opacity: 0.8 }} />
          </a>
        </div>
      </div>

      {/* Why Studio Recommended Card */}
      <div style={{
        margin: '12px 0',
        padding: '10px 12px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.08)',
        borderLeft: '3px solid #f59e0b',
        fontSize: '0.78rem',
        color: '#fef3c7',
        lineHeight: 1.45
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fbbf24', fontWeight: 700, marginBottom: '3px' }}>
          <Sparkles size={12} />
          <span>Why Studio Recommended for this Scene:</span>
        </div>
        {studio.whyStudioRecommended}
      </div>

      {/* Technical Dimensions & Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '10px', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Maximize2 size={12} color="#38bdf8" />
          <span>{studio.dimensions}</span>
        </div>
        {studio.soundRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
            <Volume2 size={12} />
            <span>{studio.soundRating}</span>
          </div>
        )}
      </div>

      {/* Capabilities Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
        {studio.capabilities.slice(0, 3).map((cap, i) => (
          <span 
            key={i} 
            style={{
              fontSize: '0.68rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '2px 7px',
              color: '#d4d4d8'
            }}
          >
            ✓ {cap}
          </span>
        ))}
      </div>

      {/* Notable Productions */}
      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '14px' }}>
        <span style={{ color: '#d4d4d8', fontWeight: 600 }}>Filmed Here: </span>
        <span style={{ fontStyle: 'italic', color: '#fbbf24' }}>{studio.notableProductions.slice(0, 3).join(', ')}</span>
      </div>

      {/* Tariff Bar */}
      <div className="location-tariff" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
        <span>Est. Day Rate</span>
        <strong style={{ color: '#38bdf8' }}>{studio.estimatedTariff}</strong>
      </div>

      {/* Contact Drawer if expanded */}
      {showContact && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          borderRadius: '6px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          fontSize: '0.78rem'
        }}>
          <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>Stage Operations & Bookings:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <Phone size={11} color="#38bdf8" />
            <a href={`tel:${studio.contactDetails.phone}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
              {studio.contactDetails.phone}
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <Mail size={11} color="#38bdf8" />
            <a href={`mailto:${studio.contactDetails.email}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
              {studio.contactDetails.email}
            </a>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '4px' }}>
            {studio.contactDetails.officeDesk}
          </div>
        </div>
      )}

      {/* Actions Footer */}
      <footer className="location-card-actions" style={{ marginTop: '12px' }}>
        <div className="location-card-utilities">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
            title="Open studio on Google Maps"
          >
            <MapPin size={12} />
            <span>Open Maps</span>
            <ExternalLink size={10} />
          </a>

          <a
            href={earthUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
            title="Explore studio complex in Google Earth 3D"
          >
            <Globe size={12} />
            <span>Earth 3D</span>
          </a>

          <button
            type="button"
            onClick={() => setShowContact(prev => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '6px',
              background: showContact ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${showContact ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)'}`,
              color: showContact ? '#fbbf24' : '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Phone size={12} />
            <span>{showContact ? 'Hide Liaison' : 'Stage Contact'}</span>
          </button>
        </div>

        {onAskAboutStudio && (
          <button
            type="button"
            className="location-ask-btn"
            onClick={() => onAskAboutStudio(studio)}
            title="Ask agent questions about this studio stage"
          >
            <span>Ask</span>
          </button>
        )}
      </footer>
    </article>
  );
}
