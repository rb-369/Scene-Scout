import asyncio
import edge_tts
import os

SCRIPT = """
Location scouting is one of the most punishing and expensive bottlenecks in filmmaking. Directors and line producers waste weeks cross-referencing outdated blog posts, municipal notices, and vague permits, only to arrive on set and find a site locked in court receivership, barred from generator truck access, or strictly prohibited from night shooting. Generic chatbots hallucinate fake addresses and non-existent clearances.

Welcome to SceneScout, an Autonomous Production Intelligence Agent engineered for modern cinema, combining Google Gemini multimodal reasoning with real-time web intelligence to transform creative briefs into verified, risk-scored location shortlists.

Let's launch a live scout. With one click on Start a Scout, SceneScout immediately activates its autonomous pipeline. The agent ingests our Mumbai thriller brief and begins decomposing the creative vision into hard logistical constraints: vehicle clearances, noise zoning, and port authority jurisdictions.

As you can see on the live agent timeline, every sub-agent executes in sequence, evaluating visual tone, querying municipal databases, checking hazardous materials, and balancing budget tariffs. 

At Step 10, watch the agent synthesize its findings into our verified production shortlist report, compiling technical dossiers before revealing the final recommendations.

Here is our candidate shortlist. Each location card is designed with high-density production ergonomics. Notice the transparent breakdown: daily commercial tariffs, structural risk levels, and our dual quantitative micro-score meters showing Scene Match versus Logistical Accessibility at a single glance.

Cotton Green leads with an exceptional 91 composite score and low production risk under Mumbai Port Authority rules. Mukesh Mills delivers staggering cinematic decay but carries a medium risk due to structural integrity advisories.

We can immediately bookmark our top picks, and notice the floating cinema toast confirming our saved candidates in real time without interrupting our review.

What separates SceneScout from standard AI wrappers is genuine agentic grounding. Look at the runtime execution logs.

SceneScout dispatches live targeted queries through the Parallel Search API directly into municipal portals, port trust regulations, and government archives. Google Gemini then ingests these live snippets, cross-examines contradictory evidence, and enforces a strict zero-hallucination policy.

Notice how the agent handled Shakti Mills: rather than inventing an easy permit, it flagged the property as tied up in High Court liquidator proceedings, protecting the production from catastrophic legal shutdowns on shoot day.

Need more creative alternatives? If the initial shortlist doesn't fully satisfy the director, we click Suggest More.

Watch the agent query its secondary intelligence reserve in real time, discovering and appending verified candidates like Mazagon Naval Docks and the Wagle Boiler Complex.

Next, we click Compare to inspect an interactive decision matrix. Side by side, our line producer can compare 3-phase power availability, boom lift clearances, ambient decibel ratings, and total location fees.

Finally, clicking View opens the full location intelligence dossier. Here, your department heads get exact satellite coordinates, 3-agency permit approval lead times, generator parking clearances, and structural hazard checklists.

You can collapse the sidebar for full-screen analysis and export a verified production packet directly to your field scouts.

Powered by Google Gemini, the Parallel Search API, and Supabase, SceneScout transforms weeks of risky pre-production into minutes of autonomous intelligence.

SceneScout: Smarter scouting. Zero guesswork. Cinema-ready.
"""

VOICE = "en-US-ChristopherNeural"  # Authoritative, articulate documentary filmmaker voice
OUTPUT_FILE = "public/voiceover_3min.mp3"
ARTIFACT_FILE = r"C:\Users\Rudra\.gemini\antigravity-ide\brain\0087fdf7-7809-44df-b0d5-353f85719c66\voiceover_3min.mp3"

async def main():
    os.makedirs("public", exist_ok=True)
    print(f"Synthesizing voiceover with {VOICE}...")
    communicate = edge_tts.Communicate(SCRIPT.strip(), VOICE, rate="-3%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    print(f"Saved to {OUTPUT_FILE} (size: {os.path.getsize(OUTPUT_FILE)} bytes)")
    
    # Also copy to artifact directory
    try:
        import shutil
        shutil.copyfile(OUTPUT_FILE, ARTIFACT_FILE)
        print(f"Copied to artifact directory: {ARTIFACT_FILE}")
    except Exception as e:
        print(f"Artifact copy error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
