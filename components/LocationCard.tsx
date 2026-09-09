'use client';

import React from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  ExternalLink, 
  Bookmark, 
  Layers, 
  Eye, 
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  FileCheck
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

export const LocationCard: React.FC<LocationCardProps> = ({
  candidate,
  onViewDetails,
  onToggleSave,
  isSaved,
  onToggleCompare,
  isCompared,
  onAskAbout,
  rankIndex
}) => {
  // Helpers for badge styling
  const getRiskBadge = (riskScore: number) => {
    if (riskScore <= 35) {
      return <span className="badge badge-verified"><CheckCircle size={10} /> Low Risk ({riskScore}%)</span>;
    }
    if (riskScore <= 60) {
      return <span className="badge badge-warning"><AlertTriangle size={10} /> Moderate Risk ({riskScore}%)</span>;
    }
    return <span className="badge badge-danger"><ShieldAlert size={10} /> High Risk ({riskScore}%)</span>;
  };

  const getAccessibilityLabel = (score: number) => {
    if (score >= 80) return <span className="badge badge-verified">High Access ({score}%)</span>;
    if (score >= 60) return <span className="badge badge-cyan">Medium Access ({score}%)</span>;
    return <span className="badge badge-warning">Restricted Access ({score}%)</span>;
  };

  const getEvidenceLabel = (score: number) => {
    if (score >= 85) return <span className="badge badge-verified"><FileCheck size={10} /> High Evidence ({score}%)</span>;
    if (score >= 65) return <span className="badge badge-cyan"><FileCheck size={10} /> Moderate Evidence ({score}%)</span>;
    return <span className="badge badge-warning">Limited Public Data</span>;
  };

  const getTrustBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED BY SOURCES':
        return <span className="badge badge-verified"><CheckCircle size={10} /> Verified by Sources</span>;
      case 'PUBLIC INFORMATION FOUND':
        return <span className="badge badge-cyan"><FileCheck size={10} /> Public Info Found</span>;
      case 'REQUIRES CONFIRMATION':
      default:
        return <span className="badge badge-warning"><AlertTriangle size={10} /> Requires Confirmation</span>;
    }
  };

  return (
    <div className={`glass-panel card-interactive`} style={{
      padding: '24px',
      position: 'relative',
      borderRadius: '16px',
      border: isCompared ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: isCompared ? '0 0 20px rgba(6, 182, 212, 0.3)' : undefined
    }}>
      {/* Top Meta Bar: Trust Status & Overall Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          {getTrustBadge(candidate.trustStatus || 'PUBLIC INFORMATION FOUND')}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: rankIndex === 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
          border: `1px solid ${rankIndex === 0 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
          padding: '3px 10px',
          borderRadius: '20px'
        }}>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Overall</span>
          <span className="font-display" style={{ fontSize: '0.95rem', fontWeight: 800, color: rankIndex === 0 ? '#fbbf24' : '#ffffff' }}>
            {candidate.overallScore || Math.round(((candidate.sceneMatchScore || 0) * 0.4) + ((candidate.accessibilityScore || 0) * 0.2) + ((candidate.evidenceQualityScore || 0) * 0.2) + ((100 - (candidate.productionRiskScore || 0)) * 0.2))}
          </span>
        </div>
      </div>

      {/* Title Bar: Rank Index + Title + Save/Compare buttons */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: rankIndex === 0 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
              : 'rgba(255, 255, 255, 0.07)',
            color: rankIndex === 0 ? '#06080d' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: rankIndex === 0 ? '0 4px 14px rgba(245, 158, 11, 0.35)' : undefined
          }} className="font-display">
            #{rankIndex + 1}
          </div>

          <div>
            <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              {candidate.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
              <MapPin size={13} color="#f59e0b" />
              <span>{candidate.area}, {candidate.city}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onToggleCompare(candidate)}
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            style={{
              background: isCompared ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isCompared ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)'}`,
              color: isCompared ? '#38bdf8' : '#cbd5e1',
              padding: '6px 9px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <Layers size={13} />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          <button
            onClick={() => onToggleSave(candidate)}
            title={isSaved ? 'Remove from saved' : 'Save location to shortlist'}
            style={{
              background: isSaved ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isSaved ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
              color: isSaved ? '#fbbf24' : '#cbd5e1',
              padding: '6px 9px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <Bookmark size={13} fill={isSaved ? '#fbbf24' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '16px' }}>
        {candidate.description}
      </p>

      {/* 4 Transparent Score Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px',
        padding: '12px 14px',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Scene Match
          </div>
          <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
            {candidate.sceneMatchScore}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>/100</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Accessibility
          </div>
          <div style={{ marginTop: '3px' }}>
            {getAccessibilityLabel(candidate.accessibilityScore)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Production Risk
          </div>
          <div style={{ marginTop: '3px' }}>
            {getRiskBadge(candidate.productionRiskScore)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Evidence Quality
          </div>
          <div style={{ marginTop: '3px' }}>
            {getEvidenceLabel(candidate.evidenceQualityScore)}
          </div>
        </div>
      </div>

      {/* Visual Characteristics tags */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(candidate.visualCharacteristics || []).slice(0, 3).map((trait, i) => (
            <span key={i} style={{
              fontSize: '0.74rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '3px 8px',
              borderRadius: '4px',
              color: '#94a3b8'
            }}>
              • {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Potential Concerns / Risk Notice */}
      {(candidate.potentialRestrictions || []).length > 0 && (
        <div style={{
          marginBottom: '16px',
          padding: '10px 12px',
          borderRadius: '6px',
          background: 'rgba(245, 158, 11, 0.05)',
          borderLeft: '3px solid #f59e0b',
          fontSize: '0.78rem',
          color: '#fbbf24',
          lineHeight: 1.4
        }}>
          <strong>Production Notice: </strong>
          {(candidate.potentialRestrictions || [])[0]}
        </div>
      )}

      {/* Sources & Citations with clickable links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>SOURCES:</span>
          {(candidate.sources || []).slice(0, 3).map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              title={src.title}
              style={{
                fontSize: '0.72rem',
                color: '#38bdf8',
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{src.domain}</span>
              <ExternalLink size={10} />
            </a>
          ))}
        </div>

        {/* View Research & Ask Agent buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onAskAbout(candidate)}
            className="btn-cinema btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <MessageSquare size={13} />
            <span>Ask Agent</span>
          </button>

          <button
            onClick={() => onViewDetails(candidate)}
            className="btn-cinema btn-primary"
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
          >
            <Eye size={13} />
            <span>View Research</span>
          </button>
        </div>
      </div>
    </div>
  );
};
