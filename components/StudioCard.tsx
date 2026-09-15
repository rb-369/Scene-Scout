'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Maximize2, 
  Volume2,
  Phone, 
  Mail, 
  MessageSquare
} from 'lucide-react';
import { StudioCandidate } from '@/lib/types';

interface StudioCardProps {
  studio: StudioCandidate;
  onAskAboutStudio?: (studio: StudioCandidate) => void;
}

export function StudioCard({ studio, onAskAboutStudio }: StudioCardProps) {
  const [showContact, setShowContact] = useState<boolean>(false);

  const mapsUrl = studio.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${studio.name}, ${studio.city}`)}`;

  return (
    <article 
      className="location-card location-card-compact"
      style={{
        border: '1px solid rgba(245, 158, 11, 0.3)',
        background: 'linear-gradient(180deg, rgba(16, 20, 26, 0.95) 0%, rgba(10, 13, 18, 0.98) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* 16:9 Viewfinder - Official Studio Image */}
      <div 
        className="location-card-viewport"
        style={{ position: 'relative', overflow: 'hidden', height: '220px', background: '#0a0d12' }}
      >
        {studio.image ? (
          <img
            src={studio.image}
            alt={`Official photo of ${studio.name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.04) brightness(0.96)',
              display: 'block'
            }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0d12', color: '#64748b', fontSize: '0.8rem' }}>
            <span>Studio Production Stage</span>
          </div>
        )}

        {/* Direct Open in Google Maps Link */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 3,
            background: 'rgba(9, 12, 12, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '6px',
            padding: '4px 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#ffffff',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
          title="Open exact studio complex in Google Maps"
        >
          <span>Live Maps</span>
          <ExternalLink size={11} color="#fbbf24" />
        </a>
      </div>

      {/* Topline Badge */}
      <header className="location-card-topline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
        <span className="badge badge-gold" style={{ 
          fontSize: '0.66rem', 
          padding: '4px 8px', 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          flex: '1 1 auto',
          minWidth: 0,
          maxWidth: 'calc(100% - 90px)'
        }}>
          <Building2 size={12} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {studio.stageType}
          </span>
        </span>
        <span className="location-overall" style={{ color: '#fbbf24', flexShrink: 0, marginLeft: 'auto' }}>
          <span>Rating</span><strong>A+</strong>
        </span>
      </header>

      {/* Title & Google Maps Link - Fixed full width & natural text flow */}
      <div style={{ padding: '0 0 14px 0', width: '100%' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 800, 
          color: '#ffffff', 
          lineHeight: 1.25, 
          margin: '0 0 6px 0',
          letterSpacing: '-0.02em',
          wordBreak: 'normal',
          overflowWrap: 'break-word'
        }}>
          {studio.name}
        </h3>
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
            fontSize: '0.82rem'
          }}
          title="Open exact studio complex in Google Maps"
        >
          <MapPin size={13} color="#38bdf8" />
          <span>{studio.city}, {studio.country}</span>
          <ExternalLink size={11} style={{ opacity: 0.8 }} />
        </a>
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
      <footer className="location-card-actions" style={{ 
        marginTop: 'auto', 
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div className="location-card-utilities" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 13px',
              borderRadius: '7px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
            title="Open studio on Google Maps"
          >
            <MapPin size={13} />
            <span>Open Maps</span>
            <ExternalLink size={11} />
          </a>

          <button
            type="button"
            onClick={() => setShowContact(prev => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 13px',
              borderRadius: '7px',
              background: showContact ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${showContact ? '#f59e0b' : 'rgba(255, 255, 255, 0.18)'}`,
              color: showContact ? '#fbbf24' : '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Phone size={13} />
            <span>{showContact ? 'Hide Liaison' : 'Stage Contact'}</span>
          </button>
        </div>

        {onAskAboutStudio && (
          <button
            type="button"
            onClick={() => onAskAboutStudio(studio)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 14px',
              borderRadius: '7px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Ask agent questions about this studio stage"
          >
            <MessageSquare size={13} />
            <span>Ask</span>
          </button>
        )}
      </footer>
    </article>
  );
}
