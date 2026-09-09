import { LocationCandidate, ResearchSession } from '../types';
import { getSupabaseBrowserClient } from '../supabase/client';

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

        // Asynchronously persist to Supabase if authenticated
        if (userId) {
          const supabase = getSupabaseBrowserClient();
          if (supabase) {
            (supabase as any)
              .from('saved_locations')
              .upsert({
                user_id: userId,
                location_id: candidate.id,
                candidate_data: candidate as unknown as never
              })
              .then((res: any) => {
                if (res?.error) console.error('Supabase saveLocation error:', res.error.message);
              });
          }
        }
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

      // Asynchronously delete from Supabase if authenticated
      if (userId) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          (supabase as any)
            .from('saved_locations')
            .delete()
            .match({ user_id: userId, location_id: id })
            .then((res: any) => {
              if (res?.error) console.error('Supabase removeSavedLocation error:', res.error.message);
            });
        }
      }
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

      // Asynchronously persist to Supabase if authenticated
      if (userId) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          (supabase as any)
            .from('scout_sessions')
            .insert({
              user_id: userId,
              user_brief: session.userBrief,
              criteria: session.criteria,
              candidates: session.candidates as unknown as never
            })
            .then((res: any) => {
              if (res?.error) console.error('Supabase saveSession error:', res.error.message);
            });
        }
      }
    } catch {}
  },

  // Pull latest cloud saved locations and merge into local storage
  async syncSavedLocationsWithCloud(userId: string): Promise<LocationCandidate[]> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return this.getSavedLocations();

    try {
      const res: any = await (supabase as any)
        .from('saved_locations')
        .select('location_id, candidate_data')
        .eq('user_id', userId);

      if (res?.error) {
        console.error('Supabase sync error:', res.error.message);
        return this.getSavedLocations();
      }

      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const cloudCandidates: LocationCandidate[] = res.data.map((row: any) => row.candidate_data as LocationCandidate);
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
      console.error('Failed to sync saved locations:', err);
      return this.getSavedLocations();
    }
  }
};
