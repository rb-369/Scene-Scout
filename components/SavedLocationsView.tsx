'use client';

import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  Eye, 
  MapPin, 
  Download, 
  Share2, 
  ArrowLeft,
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import { LocationCandidate } from '@/lib/types';

interface SavedLocationsViewProps {
  savedLocations: LocationCandidate[];
  onRemove: (id: string) => void;
  onViewDetails: (candidate: LocationCandidate) => void;
  onBackToScout: () => void;
}

export const SavedLocationsView: React.FC<SavedLocationsViewProps> = ({
  savedLocations,
  onRemove,
  onViewDetails,
  onBackToScout
}) => {
  const exportAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedLocations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scenescout_saved_locations_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsBrief = () => {
    let md = `# SceneScout — Production Location Shortlist Dossier\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    savedLocations.forEach((loc, idx) => {
      md += `## ${idx + 1}. ${loc.name} (${loc.area}, ${loc.city})\n`;
      md += `* **Scene Match**: ${loc.sceneMatchScore}/100\n`;
      md += `* **Accessibility**: ${loc.accessibilityScore}/100\n`;
      md += `* **Production Risk**: ${loc.productionRiskScore}%\n`;
      md += `* **Trust Status**: ${loc.trustStatus}\n`;
      md += `* **Description**: ${loc.description || 'N/A'}\n`;
      md += `* **Key Restrictions**: ${(loc.potentialRestrictions || []).join('; ') || 'None noted'}\n`;
      md += `* **Contact**: ${loc.contactInformation || 'N/A'}\n`;
      md += `* **Sources**:\n`;
      (loc.sources || []).forEach(s => {
        md += `  - [${s.title || 'Source'}](${s.url || '#'}) (${s.domain || 'web'})\n`;
      });
      md += `\n---\n\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scenescout_production_dossier_${Date.now()}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <button
            onClick={onBackToScout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              marginBottom: '6px'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Scout Brief</span>
          </button>
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            Saved Production Shortlist
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {savedLocations.length} locations bookmarked for production review and location scouting trips.
          </p>
        </div>

        {savedLocations.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={exportAsBrief}
              className="btn-cinema btn-secondary"
              style={{ fontSize: '0.84rem', padding: '8px 14px' }}
            >
              <Download size={14} />
              <span>Export Dossier (MD)</span>
            </button>
            <button
              onClick={exportAsJson}
              className="btn-cinema btn-primary"
              style={{ fontSize: '0.84rem', padding: '8px 14px' }}
            >
              <Share2 size={14} />
              <span>Export JSON</span>
            </button>
          </div>
        )}
      </div>

      {/* List / Grid */}
      {savedLocations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <Bookmark size={40} color="#64748b" style={{ margin: '0 auto 16px' }} />
          <h3 className="font-display" style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>
            No saved locations yet
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 20px' }}>
            When reviewing research candidates from your scout brief, click "Save" on any card to add it to your shortlist here.
          </p>
          <button onClick={onBackToScout} className="btn-cinema btn-primary">
            Start Location Scout
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {savedLocations.map((loc) => (
            <div key={loc.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <h4 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                    {loc.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <MapPin size={12} color="#f59e0b" />
                    <span>{loc.area}, {loc.city}</span>
                  </div>
                </div>

                <button
                  onClick={() => onRemove(loc.id)}
                  title="Remove from saved"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '0.74rem'
              }}>
                <span className="badge badge-verified">Match: {loc.sceneMatchScore}/100</span>
                <span className={`badge ${loc.productionRiskScore <= 35 ? 'badge-verified' : 'badge-warning'}`}>
                  Risk: {loc.productionRiskScore}%
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '14px' }}>
                {(loc.description || '').slice(0, 140)}...
              </p>

              <button
                onClick={() => onViewDetails(loc)}
                className="btn-cinema btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem', padding: '7px' }}
              >
                <Eye size={13} />
                <span>View Full Research</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
