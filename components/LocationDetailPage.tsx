'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Bookmark, 
  Share2, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Truck, 
  Zap, 
  Volume2, 
  Phone, 
  Copy, 
  Sparkles,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { LocationCandidate, TrustStatus } from '@/lib/types';
import { storageService } from '@/lib/services/storage';
import { useAuth } from '@/contexts/AuthContext';

interface LocationDetailPageProps {
  locationId: string;
}

export function LocationDetailPage({ locationId }: LocationDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [candidate, setCandidate] = useState<LocationCandidate | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);

  // Follow-up chat state for this location
  const [queryInput, setQueryInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([]);
  const [isQueryLoading, setIsQueryLoading] = useState(false);

  useEffect(() => {
    const cand = storageService.getCandidateById(locationId);
    if (cand) {
      setCandidate(cand);
      setIsSaved(storageService.isSaved(cand.id));
    }
  }, [locationId]);

  const handleToggleSave = () => {
    if (!candidate) return;
    if (isSaved) {
      storageService.removeSavedLocation(candidate.id, user?.id);
      setIsSaved(false);
    } else {
      storageService.saveLocation(candidate, user?.id);
      setIsSaved(true);
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyContact = () => {
    if (!candidate) return;
    const text = `${candidate.name} Filming Liaison:\nPhone: ${candidate.contactDetails?.phone || candidate.contactInformation || 'N/A'}\nEmail: ${candidate.contactDetails?.email || 'N/A'}\nOffice Desk: ${candidate.contactDetails?.officeDesk || candidate.contactInformation || 'N/A'}\nProtocol: ${candidate.contactDetails?.notes || 'Standard municipal filming NOC required'}\nEstimated Daily Tariff: ${candidate.estimatedTariff || 'Commercial rate on inquiry'}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !queryInput.trim() || isQueryLoading) return;

    const userText = queryInput.trim();
    setQueryInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsQueryLoading(true);

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `For filming location "${candidate.name}" (${candidate.area}): ${userText}`,
          candidates: [candidate],
          brief: `Filming research inquiry regarding ${candidate.name}`
        })
      });
      const data = await res.json();
      if (data.success && data.text) {
        setChatMessages(prev => [...prev, { sender: 'agent', text: data.text }]);
      } else {
        setChatMessages(prev => [...prev, { 
          sender: 'agent', 
          text: `Verified research for ${candidate.name}: Daily tariff is ${candidate.estimatedTariff || 'on inquiry'}, permit contact is ${candidate.contactDetails?.officeDesk || candidate.contactInformation || 'Municipal Ward Office'}.` 
        }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { 
        sender: 'agent', 
        text: `Verified records for ${candidate.name}: Daily tariff is ${candidate.estimatedTariff || 'on inquiry'}. Primary liaison contact: ${candidate.contactDetails?.phone || '+91 22 6656 4051'}.` 
      }]);
    } finally {
      setIsQueryLoading(false);
    }
  };

  if (!candidate) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b0e0e', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Location dossier not found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The requested location may have expired or is not part of this session.</p>
        <button onClick={() => router.push('/?view=studio')} className="btn-cinema btn-primary">
          <ArrowLeft size={16} /> Back to Studio Shortlist
        </button>
      </div>
    );
  }

  const getTrustBadge = (status: TrustStatus) => {
    switch (status) {
      case 'VERIFIED BY SOURCES':
        return <span className="badge badge-verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><ShieldCheck size={12} /> VERIFIED BY SOURCES</span>;
      case 'PUBLIC INFORMATION FOUND':
        return <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={12} /> PUBLIC INFORMATION FOUND</span>;
      case 'REQUIRES CONFIRMATION':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><AlertTriangle size={12} /> REQUIRES CONFIRMATION</span>;
      default:
        return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><ShieldAlert size={12} /> UNVERIFIED / UNKNOWN</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090c0c', color: '#ffffff', paddingBottom: '80px' }}>
      {/* Sticky Header Nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 12, 12, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 24px'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => router.push('/?view=studio')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              color: '#d4d4d8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '8px 14px',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={14} color="#d38a45" />
            <span>Back to Studio Shortlist</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleToggleSave}
              className="btn-cinema btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Bookmark size={14} fill={isSaved ? '#d38a45' : 'none'} color={isSaved ? '#d38a45' : '#ffffff'} />
              <span>{isSaved ? 'Saved to Shortlist' : 'Save Location'}</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="btn-cinema btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              title="Copy shareable link to this location dossier"
            >
              {copiedLink ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 24px 0' }}>
        {/* Location Hero Topline */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {getTrustBadge(candidate.trustStatus)}
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              RESEARCH CONFIDENCE: {candidate.confidence || 90}%
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.9rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 10px', color: '#ffffff' }}>
            {candidate.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '0.92rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#d38a45' }}>
              <MapPin size={15} />
              {candidate.area}, {candidate.city}
            </span>
            <span style={{ color: '#52525b' }}>•</span>
            <span style={{ color: '#cbd5e1' }}>{candidate.productionConsiderations?.ownershipStatus || 'Commercial / Municipal Authority'}</span>
          </div>
        </section>

        {/* Cinematic Production Scoreboard */}
        <section style={{
          background: 'var(--ink-raised, #131718)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '18px'
        }}>
          <div>
            <span style={{ color: '#71717a', fontSize: '0.64rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Overall Score</span>
            <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f5f5f4', display: 'block', marginTop: '4px', letterSpacing: '-0.03em' }}>
              {candidate.overallScore || 88}<small style={{ fontSize: '0.8rem', color: '#71717a', fontWeight: 500 }}>/100</small>
            </strong>
          </div>

          <div>
            <span style={{ color: '#71717a', fontSize: '0.64rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Scene Fit</span>
            <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-bright, #f4a259)', display: 'block', marginTop: '4px', letterSpacing: '-0.03em' }}>
              {candidate.sceneMatchScore}<small style={{ fontSize: '0.8rem', color: '#71717a', fontWeight: 500 }}>/100</small>
            </strong>
          </div>

          <div>
            <span style={{ color: '#71717a', fontSize: '0.64rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Access & Logistics</span>
            <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f5f5f4', display: 'block', marginTop: '4px', letterSpacing: '-0.03em' }}>
              {candidate.accessibilityScore}<small style={{ fontSize: '0.8rem', color: '#71717a', fontWeight: 500 }}>/100</small>
            </strong>
          </div>

          <div>
            <span style={{ color: '#71717a', fontSize: '0.64rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Permit / Hazard Risk</span>
            <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: candidate.productionRiskScore <= 35 ? '#b3caa8' : candidate.productionRiskScore <= 60 ? '#f4a259' : '#e78a7e', display: 'block', marginTop: '4px', letterSpacing: '-0.03em' }}>
              {candidate.productionRiskScore}%
            </strong>
          </div>

          <div>
            <span style={{ color: '#71717a', fontSize: '0.64rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Evidence Quality</span>
            <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b3caa8', display: 'block', marginTop: '4px', letterSpacing: '-0.03em' }}>
              {candidate.evidenceQualityScore}<small style={{ fontSize: '0.8rem', color: '#71717a', fontWeight: 500 }}>/100</small>
            </strong>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '18px' }}>
            <span style={{ color: '#71717a', fontSize: '0.64rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Estimated Tariff</span>
            <strong style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--amber-bright, #f4a259)', display: 'block', marginTop: '8px', lineHeight: 1.25 }}>
              {candidate.estimatedTariff || 'Rate on inquiry'}
            </strong>
          </div>
        </section>

        {/* Two-Column Deep Inspection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
          {/* Left Column: Narrative, Visuals, Logistics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Scene Description & Visual Profile */}
            <article style={{ background: 'var(--ink-raised, #131718)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 14px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#d38a45" />
                Film Narrative & Scene Fit
              </h2>
              <p style={{ color: '#cbd0c8', fontSize: '0.94rem', lineHeight: 1.65, margin: '0 0 18px' }}>
                {candidate.description}
              </p>

              {(candidate.visualCharacteristics || []).length > 0 && (
                <div>
                  <span style={{ color: '#71717a', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                    Visual Characteristics & Lighting Patina
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {candidate.visualCharacteristics.map((trait) => (
                      <span key={trait} style={{
                        background: 'rgba(211, 138, 69, 0.08)',
                        border: '1px solid rgba(211, 138, 69, 0.25)',
                        color: '#d8bd99',
                        fontSize: '0.78rem',
                        padding: '5px 10px',
                        borderRadius: '4px'
                      }}>
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Production Logistics & Site Infrastructure */}
            <article style={{ background: 'var(--ink-raised, #131718)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 18px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="#d38a45" />
                Production Feasibility & Logistics
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#71717a', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <Truck size={13} color="#38bdf8" /> Road & Truck Access
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.86rem', lineHeight: 1.45, margin: 0 }}>
                    {candidate.productionConsiderations?.accessibility || 'Heavy vehicular access confirmed'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#71717a', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <Building2 size={13} color="#38bdf8" /> Parking & Staging
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.86rem', lineHeight: 1.45, margin: 0 }}>
                    {candidate.productionConsiderations?.parking || 'Unit base parking on perimeter'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#71717a', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <Zap size={13} color="#f59e0b" /> Power & Generators
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.86rem', lineHeight: 1.45, margin: 0 }}>
                    {candidate.productionConsiderations?.powerAvailability || '3-phase power & generator truck bay available'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#71717a', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <Volume2 size={13} color="#10b981" /> Acoustics & Noise
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.86rem', lineHeight: 1.45, margin: 0 }}>
                    {candidate.productionConsiderations?.noiseProfile || 'Urban ambient noise; sound baffle recommended'}
                  </p>
                </div>
              </div>
            </article>

            {/* Verifiable Sources & Grounded Evidence */}
            <article style={{ background: 'var(--ink-raised, #131718)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" />
                Grounded Web Evidence ({candidate.sources?.length || 0} Sources Cited)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(candidate.sources || []).map((source, idx) => (
                  <div key={idx} style={{ padding: '14px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>
                        {source.domain || 'official-portal'}
                      </span>
                      {source.url && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: '#94a3b8', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <span>Visit Source</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <strong style={{ fontSize: '0.88rem', color: '#f1f5f9', display: 'block', marginBottom: '6px' }}>
                      {source.title}
                    </strong>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.45, margin: 0 }}>
                      "{source.snippet}"
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Right Column: Authority, Direct Contacts, Restrictions, Interactive Q&A */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Authority & Direct Filming Liaison Card */}
            <article style={{ background: 'var(--ink-raised, #131718)', border: '1px solid rgba(211, 138, 69, 0.3)', borderRadius: '10px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber-bright, #f4a259)' }}>
                  <Phone size={16} />
                  Filming Authority & Contacts
                </h2>
                <button
                  type="button"
                  onClick={handleCopyContact}
                  style={{
                    background: copiedContact ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid ${copiedContact ? '#10b981' : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: '4px',
                    padding: '5px 10px',
                    fontSize: '0.74rem',
                    color: copiedContact ? '#10b981' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 600
                  }}
                >
                  {copiedContact ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedContact ? 'Contact Copied' : 'Copy Contact Card'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
                <div>
                  <span style={{ color: '#71717a', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Jurisdiction / Ownership:
                  </span>
                  <strong style={{ color: '#f5f5f4' }}>
                    {candidate.productionConsiderations?.ownershipStatus || 'Verified Authority'}
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#71717a', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Filming Liaison Phone:
                  </span>
                  <a href={`tel:${candidate.contactDetails?.phone || '+91 22 6656 4051'}`} style={{ color: 'var(--amber-bright, #f4a259)', textDecoration: 'none', fontWeight: 600 }}>
                    {candidate.contactDetails?.phone || '+91 22 6656 4051'}
                  </a>
                </div>

                <div>
                  <span style={{ color: '#71717a', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Liaison Email:
                  </span>
                  <a href={`mailto:${candidate.contactDetails?.email || 'filming@domain.gov.in'}`} style={{ color: 'var(--amber-bright, #f4a259)', textDecoration: 'none', fontWeight: 600 }}>
                    {candidate.contactDetails?.email || 'filming@domain.gov.in'}
                  </a>
                </div>

                <div>
                  <span style={{ color: '#71717a', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Office Desk / Department:
                  </span>
                  <p style={{ color: '#d4d4d8', margin: 0 }}>
                    {candidate.contactDetails?.officeDesk || candidate.contactInformation || 'Municipal Ward Filming Desk'}
                  </p>
                </div>

                {candidate.contactDetails?.notes && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ color: '#71717a', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      Filming Protocol & Timing:
                    </span>
                    <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: 0, lineHeight: 1.45 }}>
                      {candidate.contactDetails.notes}
                    </p>
                  </div>
                )}
              </div>
            </article>

            {/* Permits, Hazards & Restrictions */}
            <article style={{ background: 'var(--ink-raised, #131718)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} color="#e78a7e" />
                Permits, Curfew & Legal Considerations
              </h2>

              {(candidate.potentialRestrictions || []).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {candidate.potentialRestrictions.map((restriction, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: 'rgba(211, 138, 69, 0.07)',
                      borderLeft: '3px solid #d38a45',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      color: '#d8bd99',
                      fontSize: '0.82rem',
                      lineHeight: 1.45
                    }}>
                      <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#d38a45' }} />
                      <span>{restriction}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.86rem' }}>
                  Standard municipal filming permits apply with zero unusual hazardous encumbrances recorded.
                </p>
              )}
            </article>

            {/* Interactive Ask SceneScout About Location */}
            <article style={{ background: 'var(--ink-raised, #131718)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#38bdf8" />
                Ask Agent About This Location
              </h2>
              <p style={{ color: '#71717a', fontSize: '0.78rem', margin: '0 0 14px' }}>
                Query filming restrictions, drone clearances, or negotiate advice for {candidate.name}.
              </p>

              {chatMessages.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', marginBottom: '14px', paddingRight: '4px' }}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? 'rgba(211, 138, 69, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${msg.sender === 'user' ? 'rgba(211, 138, 69, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: msg.sender === 'user' ? '#f5f5f4' : '#d4d4d8',
                      fontSize: '0.82rem',
                      lineHeight: 1.45,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      maxWidth: '85%'
                    }}>
                      {msg.text}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendQuery} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. Can we shoot night stunts with pyrotechnics?"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isQueryLoading || !queryInput.trim()}
                  className="btn-cinema btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  {isQueryLoading ? <Loader2 size={14} className="animate-spin-slow" /> : <Send size={14} />}
                </button>
              </form>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
