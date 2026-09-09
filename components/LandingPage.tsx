'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Film, MapPin, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onLaunchStudio: () => void;
}

const dossiers = [
  {
    id: 'mukesh-mills',
    name: 'Mukesh Textile Compound',
    area: 'Colaba, South Mumbai',
    archetype: 'Industrial warehouse · Dilapidated mill',
    image: '/images/cinema_warehouse_still.jpg',
    camera: 'ARRI Alexa 35 · 35mm Master Prime',
    notes: 'High steel rafters, generous depth, and afternoon dust rays. Practical tungsten can carry naturally into blue hour.',
    match: '96%',
    access: '3 phase power',
    tariff: '₹45,000 / day',
  },
  {
    id: 'ballard-pier',
    name: 'Ballard Pier Marine Berth',
    area: 'Port Trust Area, Mumbai',
    archetype: 'Maritime dock · Cargo terminal',
    image: '/images/cinema_maritime_berth.jpg',
    camera: 'RED V-Raptor XL · 50mm Anamorphic',
    notes: 'Sodium-vapor floodlights, wet tarmac reflections, and a dense marine haze make this strongest at dusk.',
    match: '91%',
    access: 'Shore power tie-in',
    tariff: '₹85,000 / day',
  },
  {
    id: 'worli-coastal',
    name: 'Worli Sea Promontory',
    area: 'Worli Headland, Mumbai',
    archetype: 'Coastal shore · Weathered bastion',
    image: '/images/cinema_coastal_outpost.jpg',
    camera: 'Sony Venice 2 · 28mm Primo',
    notes: 'An open western horizon gives the location a rare, clean last-light window over dark basalt.',
    match: '94%',
    access: 'Generator truck bay',
    tariff: '₹35,000 / day',
  },
];

const workflow = [
  ['Read the scene', 'Translate a script moment into atmosphere, framing, sound, and practical production needs.'],
  ['Test the ground truth', 'Check road access, power, permits, tariffs, and the person who can actually move a request forward.'],
  ['Make the shortlist', 'Hand the crew a concise dossier that is ready for a location meeting, not another browser tab.'],
];

const roles = [
  ['Director of Photography', 'Natural-light windows, rigging capacity, lens clearance, and the conditions that change the frame.'],
  ['Line Producer', 'Tariffs, permissions, vehicle movements, and enough space to make a day on set feasible.'],
  ['Production Designer', 'Period detail, texture, spatial patina, and the physical evidence behind an authentic location.'],
];

export function LandingPage({ onLaunchStudio }: LandingPageProps) {
  const [activeDossier, setActiveDossier] = useState(0);
  const dossier = dossiers[activeDossier];

  return (
    <div className="scenescout-landing">
      <nav className="scene-nav" aria-label="Primary navigation">
        <div className="scene-nav-inner">
          <a className="scene-brand" href="#top" aria-label="SceneScout home">
            <Image className="scene-brand-mark" src="/logo.png" alt="" width={32} height={32} priority />
            <span>
              <span className="scene-brand-name">Scene<b>Scout</b></span>
              <span className="scene-brand-note">Location intelligence</span>
            </span>
          </a>
          <div className="scene-nav-links">
            <a href="#method">Method</a>
            <a href="#dossiers">Dossiers</a>
            <a href="#departments">Departments</a>
            <button onClick={onLaunchStudio} className="btn-cinema btn-primary">
              Open studio <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      <main id="top">
        <div className="scene-shell">
          <section className="scene-hero" aria-labelledby="hero-title">
            <div className="scene-hero-copy">
              <p className="scene-kicker">Location scouting, with production context</p>
              <h1 id="hero-title">Find the frame before <span>you move the crew.</span></h1>
              <p>SceneScout turns a scene brief into a practical, verified location dossier for the people who have to make the day work.</p>
              <div className="scene-hero-actions">
                <button onClick={onLaunchStudio} className="btn-cinema btn-primary">
                  <Film size={16} /> Start a scout
                </button>
                <a href="#dossiers" className="btn-cinema btn-secondary">View a dossier</a>
              </div>
              <div className="scene-hero-meta" aria-label="SceneScout coverage">
                <div><span>Look</span><strong>Light, texture, scale</strong></div>
                <div><span>Logistics</span><strong>Road, power, permits</strong></div>
                <div><span>Proof</span><strong>Sources and contacts</strong></div>
              </div>
            </div>
            <div className="scene-hero-visual" aria-label="Industrial warehouse location preview">
              <Image src="/images/cinema_warehouse_still.jpg" alt="Industrial warehouse prepared for a film shoot" fill priority sizes="(max-width: 1024px) 100vw, 55vw" />
              <div className="scene-frame-data">
                <div><span>Current reference</span><p>Mukesh Textile Compound</p><span>Colaba, South Mumbai</span></div>
                <div className="scene-frame-score"><span>Scene fit</span><strong>96</strong></div>
              </div>
            </div>
          </section>

          <hr className="scene-divider" />

          <section id="method" className="scene-section" aria-labelledby="method-title">
            <header className="scene-section-head">
              <h2 id="method-title">From script note to call sheet.</h2>
              <p>Good scouting starts with the image, but it is only useful when every department can act on it.</p>
            </header>
            <div className="scene-workflow">
              {workflow.map(([title, description], index) => (
                <article className="scene-workflow-item" key={title}>
                  <span className="scene-workflow-index">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="dossiers" className="scene-section" aria-labelledby="dossiers-title">
            <header className="scene-section-head">
              <h2 id="dossiers-title">A dossier is a decision, not a moodboard.</h2>
              <p>Move between real sample locations to see how visual intent and production facts live in the same view.</p>
            </header>
            <div className="scene-dossier">
              <div className="scene-dossier-media">
                <Image src={dossier.image} alt={dossier.name} fill sizes="(max-width: 700px) 100vw, 50vw" />
              </div>
              <div className="scene-dossier-content">
                <div className="scene-tabs" role="tablist" aria-label="Sample location dossiers">
                  {dossiers.map((item, index) => (
                    <button key={item.id} className={`scene-tab ${index === activeDossier ? 'active' : ''}`} role="tab" aria-selected={index === activeDossier} onClick={() => setActiveDossier(index)}>
                      {item.name}
                    </button>
                  ))}
                </div>
                <p className="scene-dossier-label"><MapPin size={11} style={{ marginRight: 5, verticalAlign: 'text-bottom' }} />{dossier.area}</p>
                <h3>{dossier.name}</h3>
                <p className="scene-dossier-type">{dossier.archetype}</p>
                <p className="scene-dossier-notes">{dossier.notes}</p>
                <div className="scene-metrics">
                  <div><span>Scene fit</span><strong>{dossier.match}</strong></div>
                  <div><span>Access</span><strong>{dossier.access}</strong></div>
                  <div><span>Tariff</span><strong>{dossier.tariff}</strong></div>
                </div>
                <button onClick={onLaunchStudio} className="btn-cinema btn-secondary">Scout this direction <ArrowRight size={14} /></button>
              </div>
            </div>
          </section>

          <section id="departments" className="scene-section" aria-labelledby="departments-title">
            <header className="scene-section-head">
              <h2 id="departments-title">One location, different questions.</h2>
              <p>Each department can work from the same source of truth without reducing the location to a generic score.</p>
            </header>
            <div className="scene-role-list">
              {roles.map(([title, description]) => (
                <article className="scene-role" key={title}><h3>{title}</h3><p>{description}</p></article>
              ))}
            </div>
          </section>

          <section className="scene-section" aria-labelledby="cta-title">
            <div className="scene-cta">
              <div><p className="scene-kicker">Production starts with a place</p><h2 id="cta-title">Bring the next scene into focus.</h2></div>
              <button onClick={onLaunchStudio} className="btn-cinema btn-primary">Open scout studio <ArrowRight size={15} /></button>
            </div>
          </section>
        </div>
      </main>

      <footer className="scene-shell scene-footer">
        <span>SceneScout · Production location intelligence</span>
        <span><ShieldCheck size={11} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />Evidence-led scouting</span>
      </footer>
    </div>
  );
}
