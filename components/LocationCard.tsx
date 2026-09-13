'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Bookmark, 
  CheckCircle, 
  Eye, 
  FileCheck, 
  Layers, 
  MapPin, 
  MessageSquare, 
  AlertTriangle 
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
  const trust = trustMeta(candidate.trustStatus);
  const risk = riskMeta(candidate.productionRiskScore);
  const TrustIcon = trust.Icon;

  const fallbackImage = candidate.image || '/images/cinema_warehouse_still.jpg';
  const cameraLabel = candidate.cameraPackage || 'ARRI Alexa 35 · 35mm Prime';

  return (
    <article 
      className={`location-card location-card-compact ${isCompared ? 'is-compared' : ''}`}
      onDoubleClick={() => onViewDetails(candidate)}
      title="Double click to view full location dossier"
    >
      {/* 16:9 Viewfinder Cinematic Thumbnail */}
      <div 
        className="location-card-viewport"
        onClick={() => onViewDetails(candidate)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onViewDetails(candidate); }}
        title="Click to view full dossier"
      >
        <Image
          src={fallbackImage}
          alt={candidate.name}
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
            {cameraLabel}
          </span>
          <span className="reticle-format">2.39:1 · REC</span>
        </div>
      </div>

      <header className="location-card-topline">
        <span className={`location-status status-${trust.tone}`}><TrustIcon size={13} />{trust.label}</span>
        <span className="location-overall"><span>Overall</span><strong>{score(candidate)}</strong></span>
      </header>

      <div className="location-card-title-row">
        <span className={`location-rank ${rankIndex === 0 ? 'is-top' : ''}`}>{String(rankIndex + 1).padStart(2, '0')}</span>
        <div>
          <h3 onClick={() => onViewDetails(candidate)} style={{ cursor: 'pointer' }}>{candidate.name}</h3>
          <p className="location-place"><MapPin size={13} />{candidate.area}, {candidate.city}</p>
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

      <footer className="location-card-actions">
        <div className="location-card-utilities">
          <button 
            type="button"
            className={isCompared ? 'is-active' : ''} 
            onClick={(e) => { e.stopPropagation(); onToggleCompare(candidate); }} 
            aria-pressed={isCompared}
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
            title={isSaved ? 'Remove from saved locations' : 'Save location to shortlist'}
          >
            <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button 
            type="button"
            className="location-ask-btn"
            onClick={(e) => { e.stopPropagation(); onAskAbout(candidate); }} 
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
          title="View full location dossier in new page"
        >
          View <Eye size={13} />
        </button>
      </footer>
    </article>
  );
}
