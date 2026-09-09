import { LocationCandidate, ResearchSession } from '../types';

const SAVED_LOCATIONS_KEY = 'scenescout_saved_locations_v1';
const SESSIONS_HISTORY_KEY = 'scenescout_sessions_history_v1';

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
  }
};
