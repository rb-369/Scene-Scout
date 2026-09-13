import { LocationCandidate, ResearchSession } from '../types';
import { DEMO_CANDIDATES, ADDITIONAL_SUGGESTED_CANDIDATES } from '../demoData';

const SAVED_LOCATIONS_KEY = 'scenescout_saved_locations_v1';
const SESSIONS_HISTORY_KEY = 'scenescout_sessions_history_v1';
const ACTIVE_CANDIDATES_KEY = 'scenescout_active_candidates_v1';

export const storageService = {
  getSavedLocations(): LocationCandidate[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SAVED_LOCATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLocation(candidate: LocationCandidate, userId?: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const saved = this.getSavedLocations();
      if (!saved.some(loc => loc.id === candidate.id)) {
        saved.push(candidate);
        localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(saved));

        // Asynchronously persist to MongoDB Atlas
        fetch('/api/locations/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save',
            userId: userId || 'anonymous',
            candidate
          })
        }).catch(err => {
          console.warn('MongoDB Atlas background save notification:', err.message);
        });

        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  removeSavedLocation(id: string, userId?: string): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = this.getSavedLocations().filter(loc => loc.id !== id);
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(saved));

      // Asynchronously delete from MongoDB Atlas
      fetch('/api/locations/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          userId: userId || 'anonymous',
          locationId: id
        })
      }).catch(err => {
        console.warn('MongoDB Atlas background remove notification:', err.message);
      });
    } catch {}
  },

  isSaved(id: string): boolean {
    if (typeof window === 'undefined') return false;
    const saved = this.getSavedLocations();
    return saved.some(loc => loc.id === id);
  },

  getSessions(): ResearchSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SESSIONS_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSession(session: ResearchSession, userId?: string): void {
    if (typeof window === 'undefined') return;
    try {
      const sessions = this.getSessions().filter(s => s.id !== session.id);
      sessions.unshift(session);
      localStorage.setItem(SESSIONS_HISTORY_KEY, JSON.stringify(sessions.slice(0, 10)));

      // Asynchronously persist to MongoDB Atlas
      fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session,
          userId: userId || 'anonymous'
        })
      }).catch(err => {
        console.warn('MongoDB Atlas background session notification:', err.message);
      });
    } catch {}
  },

  // Pull latest cloud saved locations from MongoDB Atlas and merge into local storage
  async syncSavedLocationsWithCloud(userId: string): Promise<LocationCandidate[]> {
    try {
      const res = await fetch(`/api/locations/saved?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();

      if (data.configured && Array.isArray(data.locations) && data.locations.length > 0) {
        const cloudCandidates: LocationCandidate[] = data.locations;
        const localCandidates: LocationCandidate[] = this.getSavedLocations();

        // Merge without duplicates
        const map = new Map<string, LocationCandidate>();
        localCandidates.forEach((c: LocationCandidate) => map.set(c.id, c));
        cloudCandidates.forEach((c: LocationCandidate) => map.set(c.id, c));

        const merged = Array.from(map.values());
        if (typeof window !== 'undefined') {
          localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(merged));
        }
        return merged;
      }

      return this.getSavedLocations();
    } catch (err) {
      console.warn('MongoDB Atlas sync check:', err);
      return this.getSavedLocations();
    }
  },

  cacheActiveCandidates(candidates: LocationCandidate[]): void {
    if (typeof window === 'undefined' || !Array.isArray(candidates)) return;
    try {
      sessionStorage.setItem(ACTIVE_CANDIDATES_KEY, JSON.stringify(candidates));
      localStorage.setItem(ACTIVE_CANDIDATES_KEY, JSON.stringify(candidates));
    } catch {}
  },

  getActiveCandidates(): LocationCandidate[] {
    if (typeof window === 'undefined') return [];
    try {
      const fromSession = sessionStorage.getItem(ACTIVE_CANDIDATES_KEY);
      if (fromSession) return JSON.parse(fromSession);
      const fromLocal = localStorage.getItem(ACTIVE_CANDIDATES_KEY);
      if (fromLocal) return JSON.parse(fromLocal);
      return [];
    } catch {
      return [];
    }
  },

  getCandidateById(id: string): LocationCandidate | null {
    if (!id) return DEMO_CANDIDATES[0];
    const cleanId = decodeURIComponent(id).trim().toLowerCase();

    // Explicit alias map from landing page dossiers & popular slugs
    const ALIAS_MAP: Record<string, string> = {
      'ballard-pier': 'ballard-pier',
      'mukesh-mills': 'loc-mumbai-01',
      'worli-coastal': 'worli-coastal',
      'sewri-freight': 'loc-mumbai-04',
      'cotton-green': 'loc-mumbai-02',
      'mazagon-dock': 'loc-mumbai-06',
      'wagle-estate': 'loc-mumbai-07',
      'kurla-rail': 'loc-mumbai-08',
      'wadala-salt': 'loc-mumbai-09'
    };

    const resolvedId = (ALIAS_MAP[cleanId] || cleanId).toLowerCase();

    // 1. Direct match in DEMO_CANDIDATES
    const foundDemo = DEMO_CANDIDATES.find(c => c.id.toLowerCase() === resolvedId || c.id.toLowerCase() === cleanId);
    if (foundDemo) return foundDemo;

    // 2. Direct match in ADDITIONAL_SUGGESTED_CANDIDATES
    const foundSuggested = ADDITIONAL_SUGGESTED_CANDIDATES.find(c => c.id.toLowerCase() === resolvedId || c.id.toLowerCase() === cleanId);
    if (foundSuggested) return foundSuggested;

    // 3. Check active session candidates in browser storage
    const active = this.getActiveCandidates();
    const foundActive = active.find(c => c.id.toLowerCase() === resolvedId || c.id.toLowerCase() === cleanId);
    if (foundActive) return foundActive;

    // 4. Check saved locations
    const saved = this.getSavedLocations();
    const foundSaved = saved.find(c => c.id.toLowerCase() === resolvedId || c.id.toLowerCase() === cleanId);
    if (foundSaved) return foundSaved;

    // 5. Fuzzy fallback (slug or partial ID / name match)
    const all = [...DEMO_CANDIDATES, ...ADDITIONAL_SUGGESTED_CANDIDATES, ...active, ...saved];
    const fuzzy = all.find(c => {
      const cName = c.name.toLowerCase();
      const cArea = (c.area || '').toLowerCase();
      const cId = c.id.toLowerCase();
      const cleanSlug = cName.replace(/[^a-z0-9]/g, '-');
      return (
        cId.includes(cleanId) ||
        cleanId.includes(cId) ||
        cleanSlug.includes(cleanId) ||
        cleanId.includes(cleanSlug) ||
        cName.includes(cleanId) ||
        cleanId.split('-').some(word => word.length > 3 && (cName.includes(word) || cArea.includes(word)))
      );
    });

    return fuzzy || DEMO_CANDIDATES[0];
  }
};
