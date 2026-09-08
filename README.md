# 🎬 SceneScout — Production Intelligence Agent

> **"Your AI production scout. From scene brief to production-ready shortlist."**

SceneScout is an autonomous AI production-research agent built for the **Agentic Cinema Hackathon** (featuring the **Parallel Search API** Partner Track and **Google Cloud / Gemini** Agent Track).

Instead of functioning as a passive chatbot that outputs vague or hallucinated answers, SceneScout acts like an experienced location scout and production assistant: it interprets creative briefs, autonomously plans multi-vector web research, deploys the **Parallel Search API** to scour real-world gazettes and filming directories, cross-checks logistical constraints (power, vehicle clearance, noise, curfews), scores candidates transparently, and refines the shortlist conversationally.

---

## 🌟 Key Features

- **Autonomous Research Pipeline**: Decomposes a scene brief into search vectors, fetches live web documents via Parallel, extracts verified facts, and scores candidates across 4 transparent pillars.
- **Genuine Parallel Search API Integration**: Invokes the real `https://api.parallel.ai/v1/search` endpoint at runtime for LLM-ready excerpt extraction with full domain citation.
- **Gemini Agent Orchestration**: Powered by Google Gemini (`gemini-2.5-flash`) through the Google Cloud Agent Builder paradigm to reason over visual aesthetics, logistics, and legal hazards.
- **Transparent Multi-Pillar Scoring**: Every candidate is evaluated on *Scene Match* (0–100), *Accessibility & Logistics* (0–100), *Evidence Quality* (0–100), and *Production Risk* (0–100 penalty).
- **Strict Trust & Anti-Hallucination Hierarchy**: Classifies every candidate as `VERIFIED BY SOURCES`, `PUBLIC INFORMATION FOUND`, or `REQUIRES CONFIRMATION`. Never declares a location legally permitted without explicit documentation.
- **Conversational Shortlist Refinement ("Ask SceneScout")**: Command the agent to *"Remove locations with uncertain access"* or *"Re-rank by lowest production risk"*, and watch the shortlist dynamically re-order with explicit agent rationale.
- **Side-by-Side Decision Matrix**: Compare 2–3 candidates across all logistical dimensions with an instant agent recommendation verdict on which location to select.
- **Zero-Blocker Demo Mode**: Includes an instant 1-click high-fidelity demo scenario (Mumbai Industrial Thriller) with realistic data, verified sources, and step-by-step agent timeline animation.

---

## 🛑 The Problem

Filmmakers and production teams spend days manually researching filming locations:
1. **Scattered Information**: Details are buried across port authority archives, outdated blog posts, architectural heritage PDFs, and municipal gazettes.
2. **Hidden Logistical Landmines**: Locations that look great on photos often have unmanageable night curfews, narrow approach lanes impassable for 40-foot grip trucks, or missing 3-phase power.
3. **Legal Hazards**: Defunct mills or industrial yards are often trapped in High Court liquidations or municipal injunctions where unauthorized shooting results in police shutdowns.
4. **Chatbot Hallucinations**: Standard LLMs invent addresses, fabricate contact numbers, and claim permits are granted when none exist.

---

## 💡 The Solution

SceneScout automates the end-to-end investigative process of an on-the-ground location department:
1. **Understands & Plans**: Converts creative prompts (e.g. *"industrial warehouse for a gritty neo-noir climax"*) into technical specifications.
2. **Live Parallel Retrieval**: Executes high-precision web queries against live portals and directories.
3. **Evidence Synthesis**: Extracts exact quotes and links them directly to public source URLs.
4. **Defensible Shortlisting**: Computes weighted scores and flags operational warnings so producers can make informed decisions before dispatching crew vans.

---

## 🔄 Agent Workflow

```
 USER ENTERS A PRODUCTION BRIEF
               ↓
 AI AGENT UNDERSTANDS REQUIREMENTS (Google Gemini)
               ↓
 AGENT PLANS RESEARCH STRATEGY (Formulates 4-5 targeted search queries)
               ↓
 PARALLEL SEARCH API SEARCHES THE WEB (api.parallel.ai/v1/search)
               ↓
 AGENT COLLECTS & NORMALIZES SOURCES
               ↓
 AGENT EXTRACTS EVIDENCE (Citations, power, vehicle clearance, curfews)
               ↓
 AGENT EVALUATES CANDIDATES (Visual match, logistics, hazards)
               ↓
 AGENT COMPUTES TRANSPARENT SCORES (Scene 40%, Access 20%, Evidence 20%, Risk 20%)
               ↓
 AGENT PREPARES PRODUCTION SHORTLIST (Top 5 dossiers with trust badges)
               ↓
 USER ASKS FOLLOW-UP QUESTIONS ("Remove uncertain access", "Re-rank by risk")
               ↓
 AGENT RE-EVALUATES & RE-RANKS SHORTLIST DYNAMICALLY
```

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Next.js 15+ Web Application                        │
│                                                                             │
│  ┌──────────────────────┐  ┌─────────────────────────────────────────────┐  │
│  │   Cinematic Sidebar  │  │  Production Brief Input & Priority Weights   │  │
│  │  • Scout Brief       │  │  • "Run Demo Scout (1-Click)" & Start Scout  │  │
│  │  • Saved Locations   │  └─────────────────────────────────────────────┘  │
│  │  • Compare (Matrix)  │  ┌─────────────────────────────────────────────┐  │
│  │  • Research History  │  │  Agent Activity Timeline (10 Stepped States) │  │
│  │  • Live / Demo Badge │  │  • Live counters: Sources, Candidates, Ranks │  │
│  └──────────────────────┘  └─────────────────────────────────────────────┘  │
│                            ┌─────────────────────────────────────────────┐  │
│                            │  Ranked Shortlist Cards (Scores, Citations) │  │
│                            └─────────────────────────────────────────────┘  │
│                            ┌───────────────────┐  ┌──────────────────────┐  │
│                            │ Location Dossier  │  │ "Ask SceneScout"     │  │
│                            │ (Evidence Modal)  │  │ (Follow-Up Re-rank)  │  │
│                            └───────────────────┘  └──────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SceneScout Agentic Orchestrator                        │
│                                                                             │
│  1. Brief Parsing & Constraint Formulation                                  │
│  2. Web Query Planning (Gemini 2.5 Flash)                                   │
│  3. Live Web Execution (Parallel Search API)                                │
│  4. Source Normalization & Citation Linking                                 │
│  5. 4-Pillar Algorithmic Scoring & Legal Risk Assessment                    │
│  6. Conversational Re-ranking Engine                                        │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
                       ▼                               ▼
       ┌───────────────────────────────┐  ┌───────────────────────────────┐
       │      Parallel Search API      │  │     Google Gemini AI Core     │
       │   • api.parallel.ai/v1/search │  │   • gemini-2.5-flash          │
       │   • Dense LLM excerpts        │  │   • Query planning & reason   │
       │   • Live domain metadata      │  │   • Multi-factor evaluation   │
       └───────────────────────────────┘  └───────────────────────────────┘
```

---

## ⚡ Parallel Search API Integration Details

The project directly integrates the **Parallel Search API** in `lib/services/parallel.ts`.
Calls are made server-side to protect API keys from exposure:

- **Endpoint**: `https://api.parallel.ai/v1/search`
- **Authentication**: `x-api-key: process.env.PARALLEL_API_KEY`
- **Request Format**:
  ```json
  {
    "objective": "Filming locations in Mumbai for Industrial Warehouse Thriller...",
    "search_queries": [
      "Mumbai industrial filming locations warehouse thriller",
      "Mumbai port trust storage warehouse film shoots",
      "Mumbai abandoned mill godown filming permits"
    ],
    "mode": "advanced"
  }
  ```
- **Response Processing**: Normalizes hits into structured `LocationSource[]` with title, URL, domain, relevance score, and excerpts.
- **Graceful Fallback**: If the key is missing or network fails, SceneScout transparently routes to the high-fidelity demo pipeline without crashing.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 15+ (App Router), React 19, TypeScript |
| **Design System** | Custom Vanilla CSS with Dark Cinematic Theme, Glassmorphism, Google Fonts (`Inter` & `Outfit`), Lucide Icons |
| **Agent Reasoning** | Google Gemini (`@google/generative-ai`, `gemini-2.5-flash`), Google Cloud Agent Builder paradigm |
| **Live Web Search** | Parallel Search API (`api.parallel.ai/v1/search`) |
| **Local Storage** | Client-side Session and Bookmark Persistence |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/scenescout.git
cd scenescout
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your API credentials:
```ini
# 1. Parallel Search API (Hackathon Partner Track)
# Get your key at: https://platform.parallel.ai
PARALLEL_API_KEY=your_parallel_api_key_here

# 2. Google Gemini / Google Cloud (Hackathon Agent Track)
# Get your free key at: https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here

# Optional model selection (default: gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash
```

*(Note: If you leave these blank, SceneScout will seamlessly run in **Demo Mode** with full functionality).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 Primary Demo Scenario

1. Click **"Run Demo Scout (1-Click)"** on the main dashboard.
2. Watch the **10-step Agent Activity Timeline** update in real-time.
3. Review the **5 shortlisted Mumbai industrial locations** (Mukesh Mills, Cotton Green Port Godowns, Reay Road Timber Sheds, Sewri Freight Apron, Shakti Mills).
4. Click **"View Research"** on any location to view the comprehensive dossier with evidence quotes and source links.
5. In the **"Ask SceneScout"** box, click the chip: *"Remove locations with uncertain access"*.
6. Observe the agent dynamically filter out Shakti Mills and re-order the cards with explicit reasoning.
7. Select 2 or 3 cards and click **"Compare"** to launch the side-by-side decision matrix.

---

## ⚖️ Safety, Accuracy & Trust Policy

- **No Permit Hallucinations**: SceneScout never states *"Filming is allowed"* unless an official source explicitly verifies it.
- **Trust Badges**: All results are tagged with `VERIFIED BY SOURCES`, `PUBLIC INFORMATION FOUND`, or `REQUIRES CONFIRMATION`.
- **Production Disclaimer**: *"SceneScout provides research assistance, not legal or permit approval. Production teams should independently confirm permissions, availability, pricing, and access with local authorities."*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
