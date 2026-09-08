import { LocationSource } from '../types';

export interface ParallelSearchHit {
  title?: string;
  url?: string;
  domain?: string;
  snippet?: string;
  excerpts?: string[];
  score?: number;
  published_date?: string;
}

export interface ParallelSearchResponse {
  results?: ParallelSearchHit[];
  sources?: ParallelSearchHit[];
  query?: string;
  objective?: string;
  error?: string;
}

export class ParallelSearchClient {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.parallel.ai/v1/search';

  constructor() {
    this.apiKey = process.env.PARALLEL_API_KEY?.trim();
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  /**
   * Execute real search against Parallel Search API
   * Endpoint: https://api.parallel.ai/v1/search
   */
  public async search(
    objective: string,
    searchQueries: string[] = [],
    mode: 'advanced' | 'fast' | 'turbo' = 'advanced'
  ): Promise<{ sources: LocationSource[]; rawHits: ParallelSearchHit[]; live: boolean }> {
    if (!this.isConfigured()) {
      console.warn('[Parallel Service] No PARALLEL_API_KEY found; falling back to simulated research.');
      return { sources: [], rawHits: [], live: false };
    }

    try {
      console.log(`[Parallel Service] Calling ${this.baseUrl} with objective: "${objective.slice(0, 80)}..."`);
      
      const payload = {
        objective,
        search_queries: searchQueries.length > 0 ? searchQueries : undefined,
        mode
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Parallel Service] HTTP Error ${response.status}: ${errorText}`);
        throw new Error(`Parallel Search API returned ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data: ParallelSearchResponse = await response.json();
      const hits = data.results || data.sources || [];

      const normalizedSources: LocationSource[] = hits.map((hit, idx) => {
        let parsedDomain = 'web-source';
        if (hit.url) {
          try {
            parsedDomain = new URL(hit.url).hostname.replace(/^www\./, '');
          } catch {
            parsedDomain = hit.domain || 'web-source';
          }
        }

        const snippetText = 
          hit.snippet || 
          (hit.excerpts && hit.excerpts.length > 0 ? hit.excerpts.join(' ') : '') || 
          hit.title || 
          'Production intelligence search excerpt';

        return {
          title: hit.title || `Research Source #${idx + 1}`,
          url: hit.url || 'https://parallel.ai',
          domain: parsedDomain,
          snippet: snippetText.slice(0, 300),
          relevance: `Score: ${(hit.score || 0.85).toFixed(2)}`
        };
      });

      return {
        sources: normalizedSources,
        rawHits: hits,
        live: true
      };
    } catch (err: any) {
      console.error('[Parallel Service] Execution error:', err);
      // Fallback cleanly so UI does not crash
      return {
        sources: [],
        rawHits: [],
        live: false
      };
    }
  }
}

export const parallelClient = new ParallelSearchClient();
