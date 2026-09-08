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

  saveLocation(candidate: LocationCandidate): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const saved = this.getSavedLocations();
      if (!saved.some(loc => loc.id === candidate.id)) {
        saved.push(candidate);
        localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(saved));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  removeSavedLocation(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = this.getSavedLocations().filter(loc => loc.id !== id);
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(saved));
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

  saveSession(session: ResearchSession): void {
    if (typeof window === 'undefined') return;
    try {
      const sessions = this.getSessions().filter(s => s.id !== session.id);
      sessions.unshift(session);
      localStorage.setItem(SESSIONS_HISTORY_KEY, JSON.stringify(sessions.slice(0, 10)));
    } catch {}
  }
};
