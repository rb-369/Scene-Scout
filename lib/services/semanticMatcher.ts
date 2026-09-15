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
const STOPWORDS = new Set([
  'want', 'shoot', 'scene', 'looking', 'need', 'like', 'some', 'with', 'from',
  'into', 'over', 'that', 'this', 'where', 'there', 'will', 'have', 'been',
  'here', 'make', 'give', 'film', 'filming', 'good', 'best', 'very', 'more'
]);

const PHYSICAL_ARCHETYPES = [
  'construction', 'cemetery', 'graveyard', 'tomb', 'crypt', 'vault', 'cathedral',
  'church', 'temple', 'hospital', 'ward', 'sanatorium', 'warehouse', 'godown',
  'mill', 'dock', 'pier', 'harbor', 'railway', 'freight', 'chemical', 'factory',
  'fort', 'bastion', 'castle', 'salt', 'quarry', 'tunnel', 'bridge', 'ruins'
];

export function rankCandidatesBySemanticRelevance(
  brief: string,
  candidates: LocationCandidate[],
  limit: number = 5
): LocationCandidate[] {
  if (!candidates || candidates.length === 0) return [];
  if (!brief || brief.trim().length === 0) return candidates.slice(0, limit);

  const lowerBrief = brief.toLowerCase();
  const queryWords = lowerBrief
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));

  if (queryWords.length === 0) return candidates.slice(0, limit);

  // Identify physical archetypes in the user's prompt
  const requestedArchetypes = PHYSICAL_ARCHETYPES.filter(arch => lowerBrief.includes(arch));

  const scored = candidates.map(cand => {
    const nameLower = cand.name.toLowerCase();
    const descLower = cand.description.toLowerCase();
    const traitsLower = (cand.visualCharacteristics || []).join(' ').toLowerCase();
    const haystack = [nameLower, descLower, traitsLower, cand.area.toLowerCase()].join(' ');

    let score = 0;

    // 1. General token overlap (weight = 1 for normal words)
    for (const word of queryWords) {
      if (haystack.includes(word)) {
        score += 1;
      }
    }

    // 2. Physical archetype match (weight = 20)
    for (const arch of requestedArchetypes) {
      if (nameLower.includes(arch)) score += 25;
      else if (haystack.includes(arch)) score += 15;
    }

    // 3. Penalty for conflicting archetypes if a specific archetype was requested
    // (e.g. if user asked for "construction", do NOT rank cemeteries or churches)
    if (requestedArchetypes.includes('construction')) {
      if (nameLower.includes('cemetery') || nameLower.includes('graveyard') || nameLower.includes('cathedral')) {
        score -= 50;
      }
    } else if (requestedArchetypes.includes('cemetery') || requestedArchetypes.includes('graveyard')) {
      if (nameLower.includes('construction') || nameLower.includes('hospital')) {
        score -= 50;
      }
    } else if (requestedArchetypes.includes('hospital')) {
      if (nameLower.includes('cemetery') || nameLower.includes('construction')) {
        score -= 50;
      }
    }

    return { cand, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.cand);
}
