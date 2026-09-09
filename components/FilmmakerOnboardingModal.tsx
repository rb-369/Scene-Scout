'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FilmmakerType } from '@/lib/supabase/types';
import { 
  Clapperboard, 
  Building2, 
  MapPin, 
  GraduationCap, 
  Camera, 
  Check, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface PersonaOption {
  type: FilmmakerType;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string; strokeWidth?: number }>;
  description: string;
  benefits: string[];
  recommendedBudget: string;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    type: 'indie',
    title: 'Indie Filmmaker / DIY Director',
    subtitle: 'Narrative & Arthouse Features',
    badge: 'Popular for Micro-Budgets',
    icon: Clapperboard,
    description: 'Autonomous scouting focused on budget resilience, unique architectural textures, and realistic guerrilla permit feasibility.',
    benefits: ['Focus on < ₹50k/day tariffs', 'Guerrilla-friendly permit tips', 'Offbeat visual character'],
    recommendedBudget: '< ₹50,000 / day'
  },
  {
    type: 'commercial',
    title: 'Commercial Production House',
    subtitle: 'Brand TVCs & Digital Campaigns',
    badge: 'High Turnaround',
    icon: Building2,
    description: 'High-end locations with verified single-window clearances, controlled lighting grids, and rapid turnaround liaisons.',
    benefits: ['Single-window commercial permits', 'Studio stage dimensions', 'Direct producer contacts'],
    recommendedBudget: '₹100k - ₹250k / day'
  },
  {
    type: 'line_producer',
    title: 'Line Producer / Location Manager',
    subtitle: 'Physical Production & Crew Logistics',
    badge: 'Logistics Heavy',
    icon: MapPin,
    description: 'Mission-critical logistical data: unit base parking, 3-phase generator tie-ins, vanity van access, and union liaison officers.',
    benefits: ['Unit base parking capacity', 'Direct liaison phone numbers', 'Sound curfew & night-shoot rules'],
    recommendedBudget: 'Flexible / Production Scale'
  },
  {
    type: 'student',
    title: 'Film Student / Emerging Creator',
    subtitle: 'Graduation Films & Festival Shorts',
    badge: 'Zero / Micro Budget',
    icon: GraduationCap,
    description: 'Zero-budget public spots, student waiver access points, and natural lighting setups requiring minimal gear.',
    benefits: ['Free public filming zones', 'University waiver locations', 'Natural ambient light setups'],
    recommendedBudget: 'Zero Budget (< ₹10k)'
  },
  {
    type: 'documentary',
    title: 'Documentary & Non-Fiction',
    subtitle: 'Cultural Heritage & Real-World Truth',
    badge: 'Authentic Access',
    icon: Camera,
    description: 'Heritage sites, real working docks, and historic quarters with low-impact crew guidelines and cultural trust access.',
    benefits: ['Heritage trust liaison info', 'Authentic period textures', 'Natural soundscape & light cycles'],
    recommendedBudget: '₹20,000 - ₹80,000 / day'
  }
];

export const FilmmakerOnboardingModal: React.FC = () => {
  const { 
    showOnboardingModal, 
    setShowOnboardingModal, 
    updateFilmmakerType, 
    profile, 
    demoPersona 
  } = useAuth();

  const initialSelection = profile?.filmmaker_type || demoPersona || 'indie';
  const [selected, setSelected] = useState<FilmmakerType>(initialSelection);
  const [isSaving, setIsSaving] = useState(false);

  if (!showOnboardingModal) return null;

  const handleConfirm = async () => {
    setIsSaving(true);
    await updateFilmmakerType(selected);
    setIsSaving(false);
    setShowOnboardingModal(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1300,
      background: 'rgba(5, 7, 12, 0.9)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          background: '#0c1019',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '28px 32px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  <Sparkles size={12} />
                  Filmmaker Persona Setup
                </span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Customizes Agent Reasoning & Tariffs</span>
              </div>
              <h2 id="onboarding-title" className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                What kind of filmmaker or creator are you?
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', maxWidth: '620px', lineHeight: 1.45 }}>
                SceneScout customizes location budgets, legal permit risk weighting, and direct liaison contacts based on your production style.
              </p>
            </div>

            <button
              onClick={() => setShowOnboardingModal(false)}
              aria-label="Close modal"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#94a3b8',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Persona Options Grid */}
        <div style={{
          padding: '24px 32px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {PERSONA_OPTIONS.map((opt) => {
            const isSelected = selected === opt.type;
            const Icon = opt.icon;

            return (
              <div
                key={opt.type}
                onClick={() => setSelected(opt.type)}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 20, 32, 0.9) 100%)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected 
                    ? '2px solid #f59e0b' 
                    : '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: isSelected ? '0 8px 24px rgba(245, 158, 11, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#07090e' : '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.18s ease'
                  }}>
                    <Icon size={22} strokeWidth={isSelected ? 2.4 : 2} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h4 className="font-display" style={{ 
                        fontSize: '1.05rem', 
                        fontWeight: 700, 
                        color: isSelected ? '#ffffff' : '#e2e8f0',
                        margin: 0
                      }}>
                        {opt.title}
                      </h4>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#fbbf24' : '#94a3b8',
                        fontWeight: 600,
                        border: isSelected ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent'
                      }}>
                        {opt.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '10px', lineHeight: 1.4 }}>
                      {opt.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {opt.benefits.map((b, idx) => (
                        <span key={idx} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          color: isSelected ? '#fef3c7' : '#94a3b8',
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          <Check size={11} color={isSelected ? '#f59e0b' : '#64748b'} />
                          {b}
                        </span>
                      ))}
                      <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600, marginLeft: 'auto' }}>
                        Typical Budget: {opt.recommendedBudget}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: isSelected ? '2px solid #f59e0b' : '2px solid rgba(255, 255, 255, 0.2)',
                  background: isSelected ? '#f59e0b' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '10px'
                }}>
                  {isSelected && <Check size={14} color="#07090e" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#94a3b8' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>You can switch your persona anytime from the sidebar profile.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setShowOnboardingModal(false)}
              className="btn-cinema btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Skip for Now
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSaving}
              className="btn-cinema btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.9rem', gap: '8px' }}
            >
              <span>Confirm {PERSONA_OPTIONS.find(p => p.type === selected)?.title.split('/')[0].trim()}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
