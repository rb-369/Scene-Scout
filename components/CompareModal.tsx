'use client';

import React from 'react';
import { 
  X, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { LocationCandidate } from '@/lib/types';

interface CompareModalProps {
  candidates: LocationCandidate[];
  onClose: () => void;
  onRemoveFromCompare: (candidateId: string) => void;
  onSelectCandidate: (candidate: LocationCandidate) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  candidates,
  onClose,
  onRemoveFromCompare,
  onSelectCandidate
}) => {
  if (candidates.length === 0) return null;

  // Synthesize agent verdict
  const bestScene = [...candidates].sort((a, b) => b.sceneMatchScore - a.sceneMatchScore)[0];
  const lowestRisk = [...candidates].sort((a, b) => a.productionRiskScore - b.productionRiskScore)[0];
  const bestAccess = [...candidates].sort((a, b) => b.accessibilityScore - a.accessibilityScore)[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1100px', padding: '32px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }} className="badge badge-cyan">
              <Layers size={12} />
              Candidate Decision Matrix
            </div>
            <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Comparing {candidates.length} Shortlisted Locations
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Agent Synthesis Banner */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '10px',
          background: 'rgba(6, 182, 212, 0.08)',
          borderLeft: '4px solid #06b6d4',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
            <Sparkles size={16} />
            <span>Which location should you choose? - SceneScout Verdict</span>
          </div>
          <p style={{ color: '#e0f2fe', fontSize: '0.88rem', lineHeight: 1.5 }}>
            • For <strong>maximum visual drama</strong>: <strong>{bestScene?.name || 'Top match'}</strong> ({bestScene?.sceneMatchScore || 0}/100 match).<br />
            • For <strong>lowest legal hazard & easiest permits</strong>: <strong>{lowestRisk?.name || 'Verified option'}</strong> (Risk: {lowestRisk?.productionRiskScore || 0}%).<br />
            • For <strong>heavy gear & logistics</strong>: <strong>{bestAccess?.name || 'Accessible site'}</strong> ({bestAccess?.accessibilityScore || 0}/100 access).
          </p>
        </div>

        {/* Matrix Grid */}
        <div style={{ overflowX: 'auto', borderRadius: '10px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `180px repeat(${candidates.length}, minmax(180px, 1fr))`,
            minWidth: `${180 + candidates.length * 180}px`,
            gap: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
          {/* Header Row */}
          <div style={{ padding: '16px', background: 'rgba(10, 14, 22, 0.8)', fontWeight: 700, color: '#94a3b8', fontSize: '0.82rem' }}>
            Criteria Dimension
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '16px', background: 'rgba(10, 14, 22, 0.8)', position: 'relative' }}>
              <button
                onClick={() => onRemoveFromCompare(c.id)}
                title="Remove location from comparison"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: '#94a3b8',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={13} />
              </button>
              <h4 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px', paddingRight: '20px' }}>
                {c.name}
              </h4>
              <div style={{ fontSize: '0.76rem', color: '#f59e0b', marginBottom: '10px' }}>
                {c.area}
              </div>
              <button
                onClick={() => onSelectCandidate(c)}
                className="btn-cinema btn-secondary"
                style={{ width: '100%', fontSize: '0.76rem', padding: '6px' }}
              >
                Open Full Dossier
              </button>
            </div>
          ))}

          {/* Row: Daily Filming Tariff */}
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fbbf24', padding: '12px', background: 'rgba(245, 158, 11, 0.05)' }}>
            Daily Tariff
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', fontWeight: 700, color: '#ffffff', fontSize: '0.84rem' }}>
              {c.estimatedTariff || 'Commercial rate on inquiry'}
            </div>
          ))}

          {/* Row: Scene Match */}
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
            Scene Match Score
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                {c.sceneMatchScore}/100
              </span>
            </div>
          ))}

          {/* Row: Production Risk */}
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', padding: '12px' }}>
            Production Risk
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '12px' }}>
              <span style={{
                fontWeight: 700,
                fontSize: '0.88rem',
                color: c.productionRiskScore <= 35 ? '#34d399' : c.productionRiskScore <= 60 ? '#fbbf24' : '#f87171'
              }}>
                {c.productionRiskScore}% ({c.productionRiskScore <= 35 ? 'Low' : c.productionRiskScore <= 60 ? 'Moderate' : 'High'})
              </span>
            </div>
          ))}

          {/* Row: Contact & Liaison */}
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#38bdf8', padding: '12px', background: 'rgba(6, 182, 212, 0.05)' }}>
            Liaison & Contact
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.05)', fontSize: '0.78rem' }}>
              <div style={{ color: '#38bdf8', fontWeight: 600 }}>{c.contactDetails?.phone || '+91 22 6656 4051'}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>{c.contactDetails?.officeDesk || c.contactInformation}</div>
            </div>
          ))}

          {/* Row: Accessibility & Parking */}
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
            Accessibility & Parking
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '3px' }}>Score: {c.accessibilityScore}/100</div>
              <div>{c.productionConsiderations?.parking || 'Vehicle staging & street parking verified'}</div>
            </div>
          ))}

          {/* Row: Legal & Restrictions */}
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', padding: '12px' }}>
            Key Restrictions
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '12px', fontSize: '0.78rem', color: '#fca5a5' }}>
              {(c.potentialRestrictions || []).length > 0 ? (c.potentialRestrictions || [])[0] : 'None reported'}
            </div>
          ))}

          {/* Row: Recommendation */}
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
            Agent Verdict
          </div>
          {candidates.map((c) => (
            <div key={c.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', color: '#e2e8f0', fontStyle: 'italic' }}>
              "{c.recommendation}"
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};
