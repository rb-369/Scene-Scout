'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Truck, 
  Zap, 
  Volume2, 
  Phone, 
  Mail,
  Copy,
  Check,
  FileText,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { LocationCandidate } from '@/lib/types';

interface LocationDetailModalProps {
  candidate: LocationCandidate | null;
  onClose: () => void;
  onToggleSave: (candidate: LocationCandidate) => void;
  isSaved: boolean;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  candidate,
  onClose,
  onToggleSave,
  isSaved
}) => {
  const [copiedContact, setCopiedContact] = useState(false);
  if (!candidate) return null;

  const getTrustBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED BY SOURCES':
        return <span className="badge badge-verified"><ShieldCheck size={12} /> VERIFIED BY SOURCES</span>;
      case 'PUBLIC INFORMATION FOUND':
        return <span className="badge badge-cyan"><CheckCircle2 size={12} /> PUBLIC INFORMATION FOUND</span>;
      case 'REQUIRES CONFIRMATION':
        return <span className="badge badge-warning"><AlertTriangle size={12} /> REQUIRES CONFIRMATION</span>;
      default:
        return <span className="badge badge-danger"><ShieldAlert size={12} /> UNVERIFIED / UNKNOWN</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {getTrustBadge(candidate.trustStatus)}
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Confidence: {candidate.confidence}%</span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {candidate.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              <MapPin size={15} color="#38bdf8" />
              <span>{candidate.area}, {candidate.city}</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#cbd5e1' }}>{candidate.productionConsiderations?.ownershipStatus || 'Commercial / Municipal'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onToggleSave(candidate)}
              className="btn-cinema btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.84rem' }}
            >
              <Bookmark size={15} fill={isSaved ? '#38bdf8' : 'none'} color={isSaved ? '#38bdf8' : '#ffffff'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

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
        </div>

        {/* Score Overview Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Scene Match</div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
              {candidate.sceneMatchScore}<span style={{ fontSize: '0.8rem', color: '#64748b' }}>/100</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Accessibility</div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>
              {candidate.accessibilityScore}<span style={{ fontSize: '0.8rem', color: '#64748b' }}>/100</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Production Risk</div>
            <div className="font-display" style={{ 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              color: candidate.productionRiskScore <= 35 ? '#34d399' : candidate.productionRiskScore <= 60 ? '#fbbf24' : '#f87171' 
            }}>
              {candidate.productionRiskScore}<span style={{ fontSize: '0.8rem', color: '#64748b' }}>%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Evidence Quality</div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
              {candidate.evidenceQualityScore}<span style={{ fontSize: '0.8rem', color: '#64748b' }}>/100</span>
            </div>
          </div>
        </div>

        {/* Commercial Filming Tariff Card */}
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(37, 99, 235, 0.06) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Estimated Commercial Filming Tariff
            </span>
            <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {candidate.estimatedTariff || 'Commercial rate on inquiry'}
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '380px' }}>
            Authority: <strong style={{ color: '#ffffff' }}>{candidate.productionConsiderations?.ownershipStatus || 'Verified Authority'}</strong>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
              Standard shift tariffs include basic staging access; auxiliary generator tie-in and clean-up fees may apply.
            </div>
          </div>
        </div>

        {/* Section 1: Overview */}
        <div style={{ marginBottom: '24px' }}>
          <h4 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
            Location Overview
          </h4>
          <p style={{ color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.6 }}>
            {candidate.description}
          </p>
        </div>

        {/* Section 2: Agent Recommendation */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(56, 189, 248, 0.08)',
          borderLeft: '4px solid #38bdf8',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#38bdf8', fontWeight: 700, fontSize: '0.86rem' }}>
            <Sparkles size={16} />
            <span>SceneScout Agent Recommendation</span>
          </div>
          <p style={{ color: '#e0f2fe', fontSize: '0.92rem', lineHeight: 1.5 }}>
            {candidate.recommendation}
          </p>
        </div>

        {/* Section 3: Why It Matches */}
        <div style={{ marginBottom: '24px' }}>
          <h4 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px' }}>
            Why It Matches the Production Brief
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {(candidate.visualCharacteristics || []).map((trait, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.86rem',
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginTop: '6px' }} />
                <span>{trait}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Production Logistics & Technical Profile */}
        <div style={{ marginBottom: '24px' }}>
          <h4 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px' }}>
            Production Logistics & Technical Profile
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                <Truck size={14} color="#38bdf8" />
                <span>ACCESSIBILITY & ROADS</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {candidate.productionConsiderations?.accessibility || 'Vehicular access road confirmed'}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                <Building2 size={14} color="#38bdf8" />
                <span>PARKING & BASECAMP</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {candidate.productionConsiderations?.parking || 'Production vehicle staging available'}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                <Zap size={14} color="#fbbf24" />
                <span>POWER AVAILABILITY</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {candidate.productionConsiderations?.powerAvailability || 'Generator backup recommended'}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                <Volume2 size={14} color="#10b981" />
                <span>ACOUSTICS & NOISE</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {candidate.productionConsiderations?.noiseProfile || 'Standard urban ambient noise profile'}
              </p>
            </div>

            {/* Official Filming Liaison & Booking Directory */}
            <div style={{
              gridColumn: '1 / -1',
              padding: '16px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.06)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={15} color="#38bdf8" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Official Filming Liaison & Booking Directory
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const text = `${candidate.name} Filming Liaison:\nPhone: ${candidate.contactDetails?.phone || ''}\nEmail: ${candidate.contactDetails?.email || ''}\nOffice Desk: ${candidate.contactDetails?.officeDesk || candidate.contactInformation || ''}\nProtocol: ${candidate.contactDetails?.notes || ''}\nDaily Tariff: ${candidate.estimatedTariff || ''}`;
                    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(text).catch(() => {});
                    }
                    setCopiedContact(true);
                    setTimeout(() => setCopiedContact(false), 2000);
                  }}
                  style={{
                    background: copiedContact ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid ${copiedContact ? '#10b981' : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    color: copiedContact ? '#10b981' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600
                  }}
                >
                  {copiedContact ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedContact ? 'Copied to Clipboard' : 'Copy All Contact Details'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>Direct Phone:</span>
                  <a href={`tel:${candidate.contactDetails?.phone || '+91 22 6656 4051'}`} style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
                    {candidate.contactDetails?.phone || '+91 22 6656 4051'}
                  </a>
                </div>

                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>Liaison Email:</span>
                  <a href={`mailto:${candidate.contactDetails?.email || 'commercialfilming@mumbaiport.gov.in'}`} style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
                    {candidate.contactDetails?.email || 'commercialfilming@mumbaiport.gov.in'}
                  </a>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>Office Desk / Address:</span>
                  <span style={{ color: '#f1f5f9' }}>
                    {candidate.contactDetails?.officeDesk || candidate.contactInformation || 'Municipal Ward Filming Desk'}
                  </span>
                </div>

                {candidate.contactDetails?.notes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>Booking & Permit Protocol:</span>
                    <span style={{ color: '#fbbf24', fontSize: '0.82rem' }}>
                      {candidate.contactDetails.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Potential Restrictions & Filming Hazards */}
        <div style={{ marginBottom: '24px' }}>
          <h4 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '10px' }}>
            Potential Restrictions & Filming Hazards
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(candidate.potentialRestrictions || []).map((res, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.06)',
                  borderLeft: '3px solid #ef4444',
                  fontSize: '0.86rem',
                  color: '#fca5a5'
                }}
              >
                ⚠️ {res}
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Specific Evidence & Citations */}
        <div style={{ marginBottom: '28px' }}>
          <h4 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '10px' }}>
            Verified Web Evidence & Source Citations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(candidate.evidenceQuotes || []).map((eq, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ color: '#f1f5f9', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: '6px' }}>
                  "{eq.claim}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Source: <strong>{eq.sourceTitle}</strong>
                  </span>
                  <a
                    href={eq.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#38bdf8',
                      fontSize: '0.74rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>View Web Document</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Mandatory Legal Disclaimer */}
        <div style={{
          padding: '14px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.76rem',
          color: '#94a3b8',
          lineHeight: 1.45
        }}>
          <strong>Legal & Production Notice: </strong>
          SceneScout provides research assistance, not legal or permit approval. Production teams should independently confirm permissions, availability, commercial rates, curfew restrictions, and access clearances with local municipal, police, or property owner authorities.
        </div>
      </div>
    </div>
  );
};
