'use client';

import { Bookmark, CheckCircle, Eye, FileCheck, Layers, MapPin, MessageSquare, ShieldAlert, AlertTriangle } from 'lucide-react';
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

  return (
    <article 
      className={`location-card location-card-compact ${isCompared ? 'is-compared' : ''}`}
      onDoubleClick={() => onViewDetails(candidate)}
      title="Double click to view full location dossier"
    >
      <header className="location-card-topline">
        <span className={`location-status status-${trust.tone}`}><TrustIcon size={13} />{trust.label}</span>
        <span className="location-overall"><span>Overall</span><strong>{score(candidate)}</strong></span>
      </header>

      <div className="location-card-title-row">
        <span className={`location-rank ${rankIndex === 0 ? 'is-top' : ''}`}>{String(rankIndex + 1).padStart(2, '0')}</span>
        <div>
          <h3>{candidate.name}</h3>
          <p className="location-place"><MapPin size={13} />{candidate.area}, {candidate.city}</p>
        </div>
      </div>

      <div className="location-tariff">
        <span>Est. Fee</span>
        <strong>{candidate.estimatedTariff || 'Rate on inquiry'}</strong>
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
          >
            <Layers size={14} />{isCompared ? 'Comparing' : 'Compare'}
          </button>
          <button 
            type="button"
            className={isSaved ? 'is-active' : ''} 
            onClick={(e) => { e.stopPropagation(); onToggleSave(candidate); }} 
            aria-pressed={isSaved}
          >
            <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />{isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
        <button 
          type="button"
          className="location-open-dossier" 
          onClick={(e) => { e.stopPropagation(); onViewDetails(candidate); }}
          title="View full location dossier in new page"
        >
          View <Eye size={14} />
        </button>
      </footer>
    </article>
  );
}
