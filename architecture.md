# SceneScout System Architecture

## 1. System Overview

**SceneScout** is an autonomous production-research agent engineered for the **Agentic Cinema Hackathon**. It integrates **Parallel Search API** (live web research and evidence extraction) with **Google Cloud / Gemini** (intent parsing, multi-criteria reasoning, trust classification, and conversational refinement).

---

## 2. End-to-End Architectural Diagram

```mermaid
flowchart TD
    User([🎬 Filmmaker / Producer]) -->|Enters Production Brief| WebUI[Next.js Production UI]
    
    subgraph UI_Layer ["Frontend / Presentation Layer"]
        WebUI --> BriefControls[Brief & Criteria Controls]
        WebUI --> TimelineView[Agent Activity Timeline]
        WebUI --> ShortlistView[Ranked Shortlist Cards]
        WebUI --> DetailModal[Location Dossier & Evidence Citations]
        WebUI --> CompareMatrix[Multi-Candidate Decision Matrix]
        WebUI --> AskScoutPanel[Conversational Refinement 'Ask SceneScout']
    end

    BriefControls -->|POST /api/scout| API_Scout[Scout Orchestration API]
    AskScoutPanel -->|POST /api/followup| API_FollowUp[Follow-up Reasoning API]

    subgraph Agent_Core ["SceneScout Autonomous Agentic Layer"]
        API_Scout --> BriefParser[Brief Parser & Vector Strategy]
        BriefParser -->|Formulate Queries| QueryPlanner[Query Planning Engine]
        
        subgraph Gemini_Layer ["Google Cloud / Gemini Agent Core"]
            QueryPlanner -.->|Plan 4-6 Search Vectors| GeminiModel["Gemini 2.5 Flash / Agent Builder"]
            GeminiModel --> EvidenceSynthesis[Evidence Evaluator & Risk Scorer]
            GeminiModel --> FollowUpEngine[Conversational Re-ranker]
        end

        subgraph Tool_Layer ["Agent Tools & Web Retrieval"]
            QueryPlanner -->|search_web| ParallelTool[Parallel Search Client]
            ParallelTool -->|POST /v1/search| ParallelAPI[("Parallel Search API\n(api.parallel.ai/v1)")]
            ParallelAPI -->|Normalized Hits & Excerpts| Normalizer[Evidence & Citation Normalizer]
        end

        Normalizer --> EvidenceSynthesis
        EvidenceSynthesis --> TrustEngine[Trust & Verification Classifier]
        TrustEngine --> MultiCriteriaRanker[Transparent Multi-Criteria Ranker]
    end

    subgraph Storage_Layer ["Persistence & Session Store"]
        MultiCriteriaRanker --> LocalSessionStore[(Session & Bookmarks Storage)]
        API_FollowUp --> LocalSessionStore
    end

    MultiCriteriaRanker -->|Structured Shortlist Report| ShortlistView
    MultiCriteriaRanker -->|Live Progress Events| TimelineView
    API_FollowUp -->|Re-Ranked Candidates + Agent Rationale| ShortlistView

    classDef agent fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef external fill:#0f172a,stroke:#06b6d4,stroke-width:2px,color:#fff;
    classDef ui fill:#111827,stroke:#64748b,stroke-width:1px,color:#fff;

    class Agent_Core,GeminiModel agent;
    class ParallelAPI external;
    class UI_Layer ui;
```

---

## 3. Autonomous Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Producer as Filmmaker / Producer
    participant UI as SceneScout Web UI
    participant Agent as SceneScout Orchestrator
    participant Gemini as Google Gemini 2.5 Flash
    participant Parallel as Parallel Search API
    participant Storage as Session Store

    Producer->>UI: Enter Scene Brief & Criteria (or Click 'Run Demo Scout')
    UI->>Agent: POST /api/scout { brief, criteria, mode }
    
    Note over Agent,Gemini: Step 1 & 2: Interpretation & Strategy
    Agent->>Gemini: Parse scene archetype, logistical needs & constraints
    Gemini-->>Agent: Returns 4-5 targeted search queries
    
    Note over Agent,Parallel: Step 3 & 4: Deep Web Research
    Agent->>Parallel: POST /v1/search (objective + queries, mode="advanced")
    Parallel-->>Agent: Raw search results, excerpts, published domains
    
    Note over Agent,Gemini: Step 5-8: Verification & Evidence Synthesis
    Agent->>Gemini: Extract candidates, assess accessibility, screen for permits & hazards
    Gemini-->>Agent: Structured LocationCandidate array with citations
    
    Note over Agent: Step 9 & 10: Multi-Factor Ranking
    Agent->>Agent: Compute weighted score (Scene 40%, Access 20%, Evidence 20%, Risk -20%)
    Agent->>Storage: Save ResearchSession
    Agent-->>UI: Return full session dossier & timeline steps
    UI-->>Producer: Render Ranked Shortlist with Live Counters & Trust Badges

    opt Conversational Refinement Loop
        Producer->>UI: "Remove locations with uncertain access & re-rank"
        UI->>Agent: POST /api/followup { prompt, candidates }
        Agent->>Gemini: Evaluate constraints against existing evidence
        Gemini-->>Agent: Re-ranked candidate IDs & concise rationale
        Agent-->>UI: Update shortlist ordering & display agent reasoning
    end
```

---

## 4. Trust & Risk Classification System

To prevent hallucinated filming permissions, SceneScout implements a rigorous 4-tier verification protocol:

| Status Tier | Description | Requirement |
| :--- | :--- | :--- |
| **`VERIFIED BY SOURCES`** | Official authority documentation found. | Explicitly verified in port authority gazettes, film commission databases, or municipal single-window portals. |
| **`PUBLIC INFORMATION FOUND`** | Mentioned in published directories or news. | Multiple third-party publications corroborate that commercial filming has occurred. |
| **`REQUIRES CONFIRMATION`** | Preliminary match with operational questions. | Location matches visual requirements, but local police precinct or property manager confirmation is needed. |
| **`UNKNOWN`** | High regulatory uncertainty. | Ongoing legal proceedings (e.g. High Court receivership) or missing public records. |

---

## 5. Technology Stack Summary

- **Frontend Framework**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling Architecture**: Custom Cinematic Dark CSS Design System (Inter + Outfit typography, glassmorphism, responsive grid)
- **Agent Intelligence**: Google Gemini (`@google/generative-ai` / `gemini-2.5-flash`) + Google Cloud Agent Builder paradigm
- **Live Search & Extraction**: Parallel Search API (`api.parallel.ai/v1/search`)
- **State & Storage**: Next.js Server Endpoints + Client-side LocalStorage Session Cache
