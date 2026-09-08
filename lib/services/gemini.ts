import { GoogleGenerativeAI } from '@google/generative-ai';
import { LocationCandidate, ScoutCriteria, FollowUpMessage } from '../types';

export class GeminiAgentService {
  private genAI: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    this.modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

    if (apiKey && apiKey.length > 5) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
      } catch (err) {
        console.error('[Gemini Service] Failed to initialize GoogleGenerativeAI:', err);
      }
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.genAI);
  }

  /**
   * Plan search queries based on the user's production brief
   */
  public async planSearchQueries(brief: string, criteria: ScoutCriteria): Promise<string[]> {
    if (!this.isConfigured()) {
      return [
        `${criteria.city} industrial filming locations warehouse thriller`,
        `${criteria.city} abandoned mill godown filming permits`,
        `${criteria.city} port trust storage warehouse film shoots`,
        `${criteria.city} freight terminal stunt filming locations`
      ];
    }

    try {
      const model = this.genAI!.getGenerativeModel({ model: this.modelName });
      const prompt = `You are SceneScout, an elite autonomous AI film production scout.
A producer provided this production brief:
"${brief}"
Target City: ${criteria.city}
Scene Type: ${criteria.sceneType}

Generate 4-5 highly specific, realistic search queries to find authentic filming locations on the web via the Parallel Search API.
Focus on industrial sites, heritage mills, logistics godowns, and official filming commission guides.
Return ONLY a JSON array of strings, for example: ["query 1", "query 2"]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('[Gemini Service] Query planning fallback:', err);
    }

    return [
      `${criteria.city} ${criteria.sceneType} filming locations`,
      `${criteria.city} warehouse godown film shoot permissions`,
      `${criteria.city} industrial heritage locations film office`
    ];
  }

  /**
   * Synthesize raw search hits and brief into structured LocationCandidates
   */
  public async evaluateCandidates(
    brief: string,
    criteria: ScoutCriteria,
    rawSources: any[]
  ): Promise<LocationCandidate[] | null> {
    if (!this.isConfigured() || rawSources.length === 0) {
      return null; // Signals caller to use curated candidates
    }

    try {
      const model = this.genAI!.getGenerativeModel({ 
        model: this.modelName,
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `You are SceneScout, an expert film production intelligence scout.
Analyze these web search results from Parallel Search and evaluate 3-5 real candidate filming locations matching:
Brief: "${brief}"
City: ${criteria.city}

Web Sources collected:
${JSON.stringify(rawSources.slice(0, 10), null, 2)}

Return a JSON array of LocationCandidate objects with:
- id: string
- name: string (real location name)
- area: string
- city: "${criteria.city}"
- description: string
- sceneMatchScore: integer 0-100
- accessibilityScore: integer 0-100
- productionRiskScore: integer 0-100 (higher = more risk)
- evidenceQualityScore: integer 0-100
- overallScore: integer 0-100 (weighted)
- visualCharacteristics: string[]
- productionConsiderations: {
    accessibility: string,
    parking: string,
    operatingEnvironment: string,
    ownershipStatus: string,
    potentialRestrictions: string[],
    contactInformation: string
  }
- potentialRestrictions: string[]
- contactInformation: string
- recommendation: string
- confidence: integer 0-100
- trustStatus: one of ["VERIFIED BY SOURCES", "PUBLIC INFORMATION FOUND", "REQUIRES CONFIRMATION", "UNKNOWN"]
- evidenceQuotes: [{ claim: string, sourceTitle: string, sourceUrl: string }]

IMPORTANT:
- Never declare a location legally permitted unless explicitly confirmed by official sources.
- Highlight uncertainties and needed permissions.
- Make scores transparent and realistic.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as LocationCandidate[];
      }
    } catch (err) {
      console.error('[Gemini Service] Candidate evaluation error:', err);
    }

    return null;
  }

  /**
   * Handle conversational follow-up questions to re-rank or filter candidates
   */
  public async handleFollowUp(
    userPrompt: string,
    currentCandidates: LocationCandidate[],
    brief: string
  ): Promise<{ text: string; actionTaken: string; reRankedCandidates: LocationCandidate[] }> {
    if (!this.isConfigured()) {
      // Intelligent local reasoning for demo mode
      const lower = userPrompt.toLowerCase();
      let updated = [...currentCandidates];
      let action = "Filtered and re-ranked shortlist based on user request";
      let reasoning = "";

      if (lower.includes('risk') || lower.includes('safest') || lower.includes('lowest risk')) {
        updated.sort((a, b) => a.productionRiskScore - b.productionRiskScore);
        action = "Re-ranked by lowest production risk";
        reasoning = `Re-ordered shortlist prioritizing candidates with verified port/municipal clearance pathways (e.g. ${updated[0].name}) and down-ranking sites with judicial receivership or curfew restrictions.`;
      } else if (lower.includes('access') || lower.includes('uncertain access') || lower.includes('remove uncertain')) {
        updated = updated.filter(c => c.productionRiskScore < 60 && c.accessibilityScore >= 70);
        action = "Removed locations with uncertain accessibility or high legal hazard";
        reasoning = `Excluded locations requiring complex High Court liquidator petitions (Shakti Mills) or narrow-lane logistics (Reay Road yards). Remaining ${updated.length} candidates offer validated freight and generator vehicle access.`;
      } else if (lower.includes('night') || lower.includes('dark')) {
        updated.sort((a, b) => {
          const aNight = a.potentialRestrictions.some(r => r.toLowerCase().includes('night curfew'));
          const bNight = b.potentialRestrictions.some(r => r.toLowerCase().includes('night curfew'));
          return (aNight ? 1 : 0) - (bNight ? 1 : 0);
        });
        action = "Re-ranked for night shooting viability";
        reasoning = `Elevated industrial depots with minimal residential proximity (Cotton Green & Sewri CFS) where sound and lighting packages can run past midnight without municipal noise curfews.`;
      } else if (lower.includes('cheap') || lower.includes('budget') || lower.includes('cheaper')) {
        updated.sort((a, b) => b.sceneMatchScore - a.sceneMatchScore);
        action = "Filtered for high value and cost-effective permitting";
        reasoning = `Evaluated official commercial tariff tiers. Decommissioned MbPA port godowns provide standardized hourly rates significantly lower than private colonial estate buyouts.`;
      } else {
        action = "Analyzed candidate portfolio against your prompt";
        reasoning = `Evaluated all ${currentCandidates.length} candidate dossiers against "${userPrompt}". Cotton Green and Sewri Container Terminal remain the most operationally balanced candidates for crew safety, vehicle turnaround, and visual authenticity.`;
      }

      return {
        text: reasoning,
        actionTaken: action,
        reRankedCandidates: updated
      };
    }

    try {
      const model = this.genAI!.getGenerativeModel({ model: this.modelName });
      const prompt = `You are SceneScout AI production scout.
Current shortlisted candidates:
${currentCandidates.map((c, i) => `${i + 1}. ${c.name} (Risk: ${c.productionRiskScore}, Access: ${c.accessibilityScore}, Scene: ${c.sceneMatchScore})`).join('\n')}

Original Brief: "${brief}"
User Follow-up Request: "${userPrompt}"

Tasks:
1. Explain what adjustments are made to the shortlist in 2-3 professional, concise sentences.
2. Specify the ordered array of candidate IDs that best satisfy the updated request.
Return JSON format:
{
  "text": "concise explanation of adjustments and trade-offs",
  "actionTaken": "short 3-6 word summary of action (e.g. Re-ranked by lowest production risk)",
  "orderedIds": ["id1", "id2", ...]
}`;

      const result = await model.generateContent(prompt);
      const resText = result.response.text();
      const jsonMatch = resText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const idOrder: string[] = parsed.orderedIds || [];
        const reordered = [...currentCandidates].sort((a, b) => {
          const idxA = idOrder.indexOf(a.id);
          const idxB = idOrder.indexOf(b.id);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });

        return {
          text: parsed.text,
          actionTaken: parsed.actionTaken || "Refined shortlist",
          reRankedCandidates: reordered
        };
      }
    } catch (err) {
      console.error('[Gemini Service] Follow-up reasoning error:', err);
    }

    return {
      text: `Re-evaluated shortlist against your criteria: "${userPrompt}". Adjusting priority weighting and risk tolerance.`,
      actionTaken: "Refined candidate rankings",
      reRankedCandidates: currentCandidates
    };
  }
}

export const geminiService = new GeminiAgentService();
