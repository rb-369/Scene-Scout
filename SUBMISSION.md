# Hackathon Submission: SceneScout

## Project Name
**SceneScout — Autonomous Production Intelligence Agent**

## One-Line Description
*An autonomous production intelligence agent that researches real-world filming locations and turns scattered web information into a verified, risk-evaluated production shortlist.*

---

## 1. Problem Statement
Finding real-world filming locations is one of the most time-consuming and error-prone bottlenecks in film pre-production. Independent filmmakers, commercial producers, and small production teams spend dozens of hours manually googling, sifting through outdated blog posts, cross-referencing municipality rules, and calling venues only to discover:
- The property is under judicial dispute or demolition.
- Commercial filming has an unmanageable night curfew.
- Heavy grip trucks and 125kVA generator trailers cannot physically access the narrow approach roads.
- Hidden legal or permitting landmines jeopardize the shoot schedule.

Traditional chatbots merely output generic, hallucinated recommendations with fabricated addresses and non-existent permissions. Filmmakers do not need another chatbot; they need an autonomous production assistant.

---

## 2. Solution: SceneScout
**SceneScout** bridges the gap between creative vision and on-the-ground production reality.

Given a plain-English scene brief (e.g., *"Find 5 warehouse or industrial-style filming locations in Mumbai suitable for a thriller"*), SceneScout:
1. **Understands & Plans**: Analyzes architectural, aesthetic, and logistical constraints.
2. **Conducts Live Web Research**: Deploys the **Parallel Search API** to crawl port authorities, filming directories, architectural archives, and municipal notices in real-time.
3. **Cross-Checks Evidence**: Extracts verified facts, contact routes, power availability, and noise profiles.
4. **Calculates Transparent Scoring**: Evaluates candidates across 4 distinct dimensions: *Scene Match*, *Accessibility & Logistics*, *Evidence Quality*, and *Production Risk*.
5. **Enforces a Strict Trust Hierarchy**: Distinguishes between `VERIFIED BY SOURCES`, `PUBLIC INFORMATION FOUND`, and `REQUIRES CONFIRMATION`. It never claims a location is legally permitted without explicit official verification.
6. **Enables Conversational Follow-Up**: Allows filmmakers to command *"Remove locations with uncertain access and re-rank by lowest production risk"*, prompting the agent to dynamically re-evaluate the shortlist.

---

## 3. Target Users
- **Independent Filmmakers & Directors**: Sourcing authentic locations with tight budgets and fast turnarounds.
- **Production Managers & Line Producers**: Requiring vetted logistical data (power hookups, truck clearances, parking footprints) before committing scouting crews.
- **Commercial & Music Video Creators**: Rapidly discovering high-impact visual backdrops.
- **Student & Low-Budget Productions**: Avoiding costly permit fines and trespassing citations.

---

## 4. Why Agentic?
SceneScout is fundamentally not a passive Q&A assistant. It embodies an autonomous agent loop:
- **Autonomous Strategy Formulation**: The agent decomposes an abstract scene brief into multiple targeted search queries across municipal gazettes, transport authorities, and location guilds.
- **Tool Orchestration**: It executes tool calls to the **Parallel Search API**, parses excerpts, and normalizes unstructured web data into structured schemas.
- **Multi-Factor Reasoning & Scoring**: It computes algorithmic scores across conflicting priorities (e.g., balancing extreme visual grit with heavy equipment accessibility).
- **Conversational Re-evaluation**: When prompted with new constraints, the agent reasons over the candidate corpus and dynamically adjusts weights and rankings rather than reciting canned answers.

---

## 5. Why Parallel?
Filming locations and municipal rules evolve rapidly. Port boundaries shift, heritage mills face court receiverships, and permit tariffs change. 

The **Parallel Search API** (`api.parallel.ai/v1/search`) provides the high-precision, LLM-ready web research layer essential for SceneScout:
- Enables dense excerpt extraction directly from official portals (e.g., Mumbai Port Authority gazettes, Film City guidelines).
- Eliminates traditional search engine SEO clutter and advertising spam.
- Provides verifiable source domains and URLs that SceneScout cites directly on every location dossier.

---

## 6. Why Gemini / Google Cloud?
SceneScout utilizes **Google Gemini** (`gemini-2.5-flash`) through the Google Cloud Agent Builder paradigm to provide:
- **High-Speed Creative Understanding**: Comprehending cinematic subtext (e.g., *"bleak industrial thriller lighting"* vs. *"clean futuristic warehouse"*).
- **Structured JSON Synthesis**: Reliably transforming messy web search excerpts into strict TypeScript `LocationCandidate` models with cited claims.
- **Safety & Grounding**: Following strict rules to flag uncertainties, prevent permit hallucinations, and apply appropriate legal caution tags.

---

## 7. Measurable Impact
- **Time Savings**: Reduces preliminary location scouting research from **3–5 days** of manual web searching to **under 30 seconds**.
- **Risk Mitigation**: Prevents costly shoot disruptions by surfacing curfews, structural hazards, and judicial disputes before location scouts travel to the site.
- **Production Transparency**: Gives production teams defensible research dossiers backed by clickable web evidence and transparent mathematical scoring.
