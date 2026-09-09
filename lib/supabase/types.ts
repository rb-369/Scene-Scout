import { LocationCandidate, ScoutCriteria } from '../types';

export type FilmmakerType = 
  | 'indie'           // Indie Filmmaker / Guerrilla Director
  | 'commercial'      // Commercial Production House / Ad Film Director
  | 'line_producer'   // Line Producer / Location Manager
  | 'student'         // Film Student / Emerging Creator
  | 'documentary';    // Documentary / Non-Fiction Filmmaker

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  filmmaker_type: FilmmakerType | null;
  production_house: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSavedLocation {
  id: string;
  user_id: string;
  location_id: string;
  candidate_data: LocationCandidate;
  notes: string | null;
  created_at: string;
}

export interface DbScoutSession {
  id: string;
  user_id: string;
  user_brief: string;
  criteria: ScoutCriteria;
  candidates: LocationCandidate[];
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Partial<UserProfile> & { id: string };
        Update: Partial<UserProfile>;
      };
      saved_locations: {
        Row: DbSavedLocation;
        Insert: {
          user_id: string;
          location_id: string;
          candidate_data: LocationCandidate;
          notes?: string | null;
        };
        Update: Partial<DbSavedLocation>;
      };
      scout_sessions: {
        Row: DbScoutSession;
        Insert: {
          user_id: string;
          user_brief: string;
          criteria?: ScoutCriteria;
          candidates?: LocationCandidate[];
        };
        Update: Partial<DbScoutSession>;
      };
    };
  };
}
