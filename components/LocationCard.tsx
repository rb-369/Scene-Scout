'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Bookmark, 
  CheckCircle, 
  Eye, 
  FileCheck, 
  Layers, 
  MapPin, 
  MessageSquare, 
  AlertTriangle,
  ExternalLink,
  Globe,
  Camera
} from 'lucide-react';
import { LocationCandidate } from '@/lib/types';

interface LocationCardProps {
  candidate: LocationCandidate;
  onViewDetails: (candidate: LocationCandidate) => void;
  onToggleSave: (candidate: LocationCandidate) => void;
  isSaved: boolean;
  onToggleCompare: (candidate: LocationCandidate) => void;
  isCompared: boolean;
  onAskAbout: (candidate: LocationCandidate) => void;
  rankIndex: number;
}

const score = (candidate: LocationCandidate) => candidate.overallScore || Math.round(
  (candidate.sceneMatchScore || 0) * .4 +
  (candidate.accessibilityScore || 0) * .2 +
  (candidate.evidenceQualityScore || 0) * .2 +
  (100 - (candidate.productionRiskScore || 0)) * .2,
);

const trustMeta = (status?: string) => {
  if (status === 'VERIFIED BY SOURCES') return { label: 'Source verified', tone: 'verified', Icon: CheckCircle };
  if (status === 'PUBLIC INFORMATION FOUND') return { label: 'Public information', tone: 'neutral', Icon: FileCheck };
  return { label: 'Needs confirmation', tone: 'caution', Icon: AlertTriangle };
};

const riskMeta = (risk: number) => {
  if (risk <= 35) return { label: 'Low risk', tone: 'verified' };
  if (risk <= 60) return { label: 'Moderate risk', tone: 'caution' };
  return { label: 'High risk', tone: 'risk' };
};

export function LocationCard({
  candidate,
  onViewDetails,
  onToggleSave,
  isSaved,
  onToggleCompare,
  isCompared,
  onAskAbout,
  rankIndex,
}: LocationCardProps) {
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'photo' | 'satellite'>(
    candidate.image && !imgFailed ? 'photo' : 'satellite'
  );

  const trust = trustMeta(candidate.trustStatus);
  const risk = riskMeta(candidate.productionRiskScore);
  const TrustIcon = trust.Icon;

  const lat = candidate.coordinates?.lat || 18.9138;
  const lng = candidate.coordinates?.lng || 72.8242;
  const mapsUrl = candidate.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${candidate.name}, ${candidate.area}, ${candidate.city}`)}`;
  const satelliteEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`;

  const hasPhoto = Boolean(candidate.image && !imgFailed);
  const activeMode = hasPhoto ? viewMode : 'satellite';

  return (
    <article 
      className={`location-card location-card-compact ${isCompared ? 'is-compared' : ''}`}
      onDoubleClick={() => onViewDetails(candidate)}
      title="Double click to view full location dossier"
    >
      {/* 16:9 Viewfinder - Official Location Photo */}
      <div 
        className="location-card-viewport"
        onClick={() => onViewDetails(candidate)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onViewDetails(candidate); }}
        title="Click to view full dossier"
        style={{ position: 'relative', overflow: 'hidden', height: '220px', background: '#0a0d12' }}
      >
        {candidate.image ? (
          <img
            src={candidate.image}
            alt={`Official photo of ${candidate.name}`}
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
            <span>Location Production Dossier</span>
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
          title="Open exact location on Google Maps"
        >
          <span>Live Maps</span>
          <ExternalLink size={11} color="#38bdf8" />
        </a>
      </div>

      <header className="location-card-topline">
        <span className={`location-status status-${trust.tone}`}><TrustIcon size={13} />{trust.label}</span>
        <span className="location-overall"><span>Overall</span><strong>{score(candidate)}</strong></span>
      </header>

      <div className="location-card-title-row">
        <span className={`location-rank ${rankIndex === 0 ? 'is-top' : ''}`}>{String(rankIndex + 1).padStart(2, '0')}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 onClick={() => onViewDetails(candidate)} style={{ cursor: 'pointer', overflowWrap: 'break-word', wordBreak: 'normal', lineHeight: 1.25 }}>{candidate.name}</h3>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="location-place-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.82rem',
              marginTop: '2px',
              transition: 'color 0.15s'
            }}
            title="Click to open this location on Google Maps (opens in new tab)"
          >
            <MapPin size={13} />
            <span>{candidate.area}, {candidate.city}</span>
            <ExternalLink size={11} style={{ opacity: 0.7 }} />
          </a>
        </div>
      </div>

      <div className="location-tariff">
        <span>Est. Fee</span>
        <strong>{candidate.estimatedTariff || 'Rate on inquiry'}</strong>
      </div>

      <div className="location-card-scores">
        <div className="location-score-item">
          <div className="location-score-label">
            <span>Scene Match</span>
            <strong>{candidate.sceneMatchScore}%</strong>
          </div>
          <div className="location-score-track">
            <div className="location-score-bar bar-match" style={{ width: `${candidate.sceneMatchScore}%` }} />
          </div>
        </div>
        <div className="location-score-item">
          <div className="location-score-label">
            <span>Accessibility</span>
            <strong>{candidate.accessibilityScore}%</strong>
          </div>
          <div className="location-score-track">
            <div className="location-score-bar bar-access" style={{ width: `${candidate.accessibilityScore}%` }} />
          </div>
        </div>
      </div>

      <div className="location-compact-meta">
        <div className="location-compact-risk">
          <span>Risk Level</span>
          <strong className={`metric-${risk.tone}`}>{risk.label} ({candidate.productionRiskScore}%)</strong>
        </div>
      </div>

      <footer className="location-card-actions" style={{
        marginTop: 'auto',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <div className="location-card-utilities" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button 
            type="button"
            className={isCompared ? 'is-active' : ''} 
            onClick={(e) => { e.stopPropagation(); onToggleCompare(candidate); }} 
            aria-pressed={isCompared}
            style={{ height: '32px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
          >
            <Layers size={13} />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
          <button 
            type="button"
            className={isSaved ? 'is-active' : ''} 
            onClick={(e) => { e.stopPropagation(); onToggleSave(candidate); }} 
            aria-pressed={isSaved}
            style={{ height: '32px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title={isSaved ? 'Remove from saved locations' : 'Save location to shortlist'}
          >
            <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="location-maps-action-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              height: '32px',
              padding: '0 10px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
            title="Open exact location in Google Maps"
          >
            <MapPin size={12} />
            <span>Maps</span>
          </a>
          <button 
            type="button"
            className="location-ask-btn"
            onClick={(e) => { e.stopPropagation(); onAskAbout(candidate); }} 
            style={{ height: '32px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Ask agent specific questions about this location"
          >
            <MessageSquare size={13} />
            <span>Ask</span>
          </button>
        </div>
        <button 
          type="button"
          className="location-open-dossier" 
          onClick={(e) => { e.stopPropagation(); onViewDetails(candidate); }}
          style={{ height: '32px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          title="View full location dossier in new page"
        >
          View <Eye size={13} />
        </button>
      </footer>
    </article>
  );
}

