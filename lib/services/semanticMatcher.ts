import { LocationCandidate, ScoutCriteria } from '../types';
import { geminiService } from './gemini';

/**
 * Universal Agent-in-the-Loop Candidate Ranker:
 * An AI Location Scout Agent sits directly in between the filmmaker's raw brief
 * and the location candidates, understanding creative nuances, genre tropes,
 * lighting requirements, and spatial atmosphere without any hardcoded keyword lists.
 */
export async function rankCandidatesWithAgent(
  brief: string,
  criteria: ScoutCriteria,
  candidates: LocationCandidate[],
  limit: number = 5
): Promise<LocationCandidate[]> {
  if (geminiService.isConfigured()) {
    try {
      return await geminiService.rankCandidatesWithAgent(brief, criteria, candidates, limit);
    } catch (err) {
      console.warn('[Scout Agent] Gemini agent ranking error, using baseline fallback:', err);
    }
  }
  return rankCandidatesBySemanticRelevance(brief, candidates, limit);
}

/**
 * Baseline Fallback (Offline / 0 API Keys):
 * Standard bag-of-words token overlap across name, visuals, and description.
 * Completely free of hardcoded keyword lists or genre categories.
 */
export function rankCandidatesBySemanticRelevance(
  brief: string,
  candidates: LocationCandidate[],
  limit: number = 5
): LocationCandidate[] {
  if (!candidates || candidates.length === 0) return [];
  if (!brief || brief.trim().length === 0) return candidates.slice(0, limit);

  const queryWords = brief
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  if (queryWords.length === 0) return candidates.slice(0, limit);

  const scored = candidates.map(cand => {
    const haystack = [
      cand.name,
      cand.description,
      ...(cand.visualCharacteristics || []),
      cand.area,
      cand.productionConsiderations?.operatingEnvironment
    ].join(' ').toLowerCase();

    let score = 0;
    for (const word of queryWords) {
      if (haystack.includes(word)) {
        score += 1;
      }
    }

    return { cand, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.cand);
}
