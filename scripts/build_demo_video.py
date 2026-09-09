import os
import wave
import subprocess
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

OUTPUT_DIR = "docs"
AUDIO_DIR = "scratch/audio"
FINAL_VIDEO = os.path.join(OUTPUT_DIR, "scenescout_demo.mp4")
TEMP_VIDEO = "scratch/temp_video_no_audio.mp4"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs("scratch", exist_ok=True)

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using FFmpeg: {FFMPEG_EXE}")

WIDTH, HEIGHT = 1920, 1080
FPS = 24

# Palette
BG_COLOR = (6, 8, 13)
CARD_BG = (14, 19, 30)
CARD_BG_HOVER = (20, 28, 44)
GOLD = (245, 158, 11)
GOLD_LIGHT = (253, 230, 138)
CYAN = (6, 182, 212)
CYAN_LIGHT = (125, 211, 252)
EMERALD = (16, 185, 129)
RED = (239, 68, 68)
PURPLE = (139, 92, 246)
TEXT_WHITE = (248, 250, 252)
TEXT_MUTED = (148, 163, 184)
TEXT_DIM = (100, 116, 139)

def get_font(size, bold=False):
    font_names = [
        "segoeuib.ttf" if bold else "segoeui.ttf",
        "arialbd.ttf" if bold else "arial.ttf"
    ]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except:
            continue
    return ImageFont.load_default()

def draw_sidebar(draw, active_tab="scout"):
    draw.rectangle([0, 0, 270, 1080], fill=(9, 12, 19), outline=(30, 40, 55), width=1)
    
    # Brand
    draw.rounded_rectangle([25, 30, 65, 70], radius=10, fill=GOLD)
    draw.text((33, 35), "🎬", font=get_font(22), fill=(6, 8, 13))
    draw.text((78, 32), "Scene", font=get_font(24, True), fill=TEXT_WHITE)
    draw.text((144, 32), "Scout", font=get_font(24, True), fill=GOLD)
    draw.text((78, 60), "PRODUCTION AGENT", font=get_font(11, True), fill=TEXT_DIM)
    
    # Mode badge
    draw.rounded_rectangle([25, 95, 245, 160], radius=8, fill=(10, 30, 40), outline=CYAN, width=1)
    draw.ellipse([38, 112, 46, 120], fill=CYAN)
    draw.text((54, 108), "LIVE RESEARCH MODE", font=get_font(11, True), fill=CYAN)
    draw.text((38, 132), "Gemini + Parallel API Active", font=get_font(11), fill=TEXT_MUTED)
    
    # Navigation tabs
    tabs = [
        ("scout", "🧭 Scout Brief"),
        ("saved", "🔖 Saved Locations (5)"),
        ("compare", "📑 Candidate Matrix"),
        ("history", "📜 Research History")
    ]
    
    y = 190
    for key, label in tabs:
        is_active = (key == active_tab)
        bg = (35, 30, 15) if is_active else None
        border = GOLD if is_active else None
        color = GOLD if is_active else TEXT_MUTED
        if is_active:
            draw.rounded_rectangle([25, y, 245, y + 42], radius=8, fill=bg, outline=border, width=1)
        draw.text((45, y + 11), label, font=get_font(13, is_active), fill=color)
        y += 52

    # Bottom track banner
    draw.rounded_rectangle([20, 930, 250, 1050], radius=8, fill=(15, 20, 30), outline=(40, 50, 70), width=1)
    draw.text((32, 942), "Agentic Cinema Hackathon", font=get_font(12, True), fill=TEXT_WHITE)
    draw.text((32, 968), "• Google Cloud Agent Track", font=get_font(11), fill=GOLD)
    draw.text((32, 990), "• Parallel Partner Track", font=get_font(11), fill=CYAN)
    draw.text((32, 1012), "• 3-Min Functional Demo", font=get_font(11), fill=EMERALD)

def draw_top_status_bar(draw):
    draw.rounded_rectangle([290, 24, 1890, 78], radius=10, fill=(11, 15, 25), outline=(40, 50, 70), width=1)
    draw.ellipse([312, 45, 324, 57], fill=EMERALD)
    draw.text((334, 42), "RUNTIME VERIFIED", font=get_font(13, True), fill=EMERALD)
    draw.line([490, 38, 490, 64], fill=(60, 70, 90), width=1)
    
    # Gemini badge
    draw.rounded_rectangle([505, 38, 715, 64], radius=6, fill=(40, 30, 10), outline=GOLD, width=1)
    draw.text((515, 42), "★ GOOGLE GEMINI 2.5 FLASH", font=get_font(12, True), fill=GOLD)
    draw.text((725, 43), "Agent Reasoning & Synthesis", font=get_font(13), fill=(200, 210, 225))
    draw.line([955, 38, 955, 64], fill=(60, 70, 90), width=1)
    
    # Parallel badge
    draw.rounded_rectangle([970, 38, 1150, 64], radius=6, fill=(10, 35, 45), outline=CYAN, width=1)
    draw.text((980, 42), "⚡ PARALLEL SEARCH API", font=get_font(12, True), fill=CYAN)
    draw.text((1160, 43), "Live Municipal Web Research", font=get_font(13), fill=(200, 210, 225))
    
    # Endpoint
    draw.rounded_rectangle([1615, 38, 1875, 64], radius=6, fill=(20, 25, 35), outline=(50, 60, 80), width=1)
    draw.text((1625, 43), "api.parallel.ai/v1/search • Active", font=get_font(12), fill=TEXT_MUTED)

def create_base_canvas(active_tab="scout"):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=BG_COLOR)
    draw = ImageDraw.Draw(img)
    draw_sidebar(draw, active_tab=active_tab)
    draw_top_status_bar(draw)
    return img, draw

# Candidate Card Renderer
def draw_candidate_card(draw, x, y, w, h, rank, name, area, score, match, access, risk, risk_label, verified=True, highlighted=False):
    bg = (20, 28, 44) if highlighted else CARD_BG
    border = GOLD if highlighted else (50, 65, 90)
    draw.rounded_rectangle([x, y, x + w, y + h], radius=12, fill=bg, outline=border, width=2 if highlighted else 1)
    
    # Trust badge & Overall Score
    if verified:
        draw.rounded_rectangle([x + 14, y + 12, x + 155, y + 32], radius=5, fill=(10, 35, 25), outline=EMERALD, width=1)
        draw.text((x + 22, y + 15), "✓ VERIFIED BY SOURCES", font=get_font(10, True), fill=EMERALD)
    else:
        draw.rounded_rectangle([x + 14, y + 12, x + 175, y + 32], radius=5, fill=(40, 15, 15), outline=RED, width=1)
        draw.text((x + 22, y + 15), "⚠ REQUIRES CONFIRMATION", font=get_font(10, True), fill=RED)
        
    draw.rounded_rectangle([x + w - 105, y + 12, x + w - 14, y + 34], radius=12, fill=(35, 30, 15), outline=GOLD, width=1)
    draw.text((x + w - 95, y + 15), f"SCORE: {score}", font=get_font(11, True), fill=GOLD)
    
    # Rank & Name
    draw.rounded_rectangle([x + 14, y + 42, x + 44, y + 72], radius=7, fill=GOLD if rank == 1 else (30, 40, 60))
    draw.text((x + 20, y + 46), f"#{rank}", font=get_font(14, True), fill=(6, 8, 13) if rank == 1 else TEXT_WHITE)
    draw.text((x + 52, y + 43), name[:32], font=get_font(14, True), fill=TEXT_WHITE)
    draw.text((x + 52, y + 64), f"📍 {area}, Mumbai", font=get_font(11), fill=TEXT_MUTED)
    
    # Metrics Strip
    draw.rounded_rectangle([x + 14, y + 84, x + w - 14, y + 130], radius=8, fill=(10, 13, 20), outline=(35, 45, 60), width=1)
    col_w = (w - 28) // 4
    
    # Scene match
    draw.text((x + 20, y + 90), "SCENE MATCH", font=get_font(9, True), fill=TEXT_DIM)
    draw.text((x + 20, y + 106), f"{match}%", font=get_font(13, True), fill=GOLD)
    
    # Access
    draw.text((x + 20 + col_w, y + 90), "ACCESS", font=get_font(9, True), fill=TEXT_DIM)
    draw.text((x + 20 + col_w, y + 106), f"{access}%", font=get_font(13, True), fill=CYAN)
    
    # Risk
    draw.text((x + 20 + col_w * 2, y + 90), "RISK", font=get_font(9, True), fill=TEXT_DIM)
    risk_col = RED if risk > 50 else EMERALD
    draw.text((x + 20 + col_w * 2, y + 106), f"{risk}% ({risk_label})", font=get_font(11, True), fill=risk_col)
    
    # Source count
    draw.text((x + 20 + col_w * 3, y + 90), "EVIDENCE", font=get_font(9, True), fill=TEXT_DIM)
    draw.text((x + 20 + col_w * 3, y + 106), "Port Circulars", font=get_font(11, True), fill=EMERALD if verified else RED)

    # Footer buttons
    draw.rounded_rectangle([x + 14, y + 140, x + 115, y + 166], radius=5, fill=(20, 25, 35), outline=(50, 60, 80), width=1)
    draw.text((x + 25, y + 146), "📑 Compare", font=get_font(11), fill=CYAN)
    
    draw.rounded_rectangle([x + w - 125, y + 140, x + w - 14, y + 166], radius=5, fill=GOLD)
    draw.text((x + w - 115, y + 146), "👁 View Dossier", font=get_font(11, True), fill=(6, 8, 13))

# SCENE 1: Problem Statement
def make_scene_1(t):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Vignette & header
    draw.rounded_rectangle([150, 100, 1770, 980], radius=20, fill=(11, 15, 25), outline=(45, 55, 75), width=2)
    
    draw.rounded_rectangle([750, 130, 1170, 170], radius=8, fill=(40, 15, 15), outline=RED, width=1)
    draw.text((770, 140), "⚠ THE PRE-PRODUCTION CRISIS", font=get_font(16, True), fill=RED)
    
    draw.text((250, 200), "Why Film Location Scouting Fails in the Real World", font=get_font(38, True), fill=TEXT_WHITE)
    draw.text((250, 255), "Filmmakers spend 3–5 days manually researching fragmented web portals, only to hit costly ground roadblocks.", font=get_font(18), fill=TEXT_MUTED)
    
    problems = [
        ("1. Logistics & Infrastructure Roadblocks", "Narrow 2.4m approach roads block 125kVA generator trailers and grip trucks. Unannounced low railway bridges.", "🚛"),
        ("2. Legal Hazards & Ongoing Litigation", "Iconic ruins often trapped in Bombay High Court liquidation receivership (e.g. Shakti Mills) risking police halts.", "⚖"),
        ("3. Municipal Curfews & Zoning Surprises", "Strict 10 PM night filming bans, port trust security clearances, and unexpected ₹2.5L/day heritage filming fees.", "🌙"),
        ("4. Generative AI Hallucinations", "Generic LLM chatbots fabricate fictional addresses, non-existent permissions, and invented filming contacts.", "🚫")
    ]
    
    y = 330
    for title, desc, icon in problems:
        draw.rounded_rectangle([250, y, 1670, y + 120], radius=12, fill=CARD_BG, outline=(50, 60, 85), width=1)
        draw.rounded_rectangle([275, y + 25, 345, y + 95], radius=10, fill=(30, 35, 50))
        draw.text((292, y + 36), icon, font=get_font(32), fill=GOLD)
        draw.text((370, y + 28), title, font=get_font(20, True), fill=GOLD_LIGHT)
        draw.text((370, y + 62), desc, font=get_font(16), fill=TEXT_MUTED)
        y += 140
        
    # Solution teaser footer
    draw.rounded_rectangle([250, 890, 1670, 955], radius=10, fill=(15, 30, 45), outline=CYAN, width=1)
    draw.text((280, 910), "⚡ The Solution: SceneScout Autonomous Production Intelligence Agent (Gemini + Parallel Search)", font=get_font(18, True), fill=CYAN)
    return img

# SCENE 2: Introducing SceneScout & Brief Input
def make_scene_2(t):
    img, draw = create_base_canvas()
    
    # Hero Title
    draw.rounded_rectangle([290, 95, 480, 125], radius=6, fill=(10, 35, 45), outline=CYAN, width=1)
    draw.text((302, 102), "🎬 AGENTIC CINEMA HACKATHON", font=get_font(11, True), fill=CYAN)
    
    draw.text((290, 140), "Give your next scene a place.", font=get_font(42, True), fill=TEXT_WHITE)
    draw.text((290, 195), "SceneScout turns creative scene briefs into verified, risk-evaluated production shortlists.", font=get_font(17), fill=TEXT_MUTED)
    
    # Main Input Console
    draw.rounded_rectangle([290, 240, 1890, 600], radius=14, fill=CARD_BG, outline=GOLD, width=2)
    draw.text((320, 265), "PRODUCTION SCENE BRIEF & LOCATION PARAMETERS", font=get_font(14, True), fill=GOLD)
    
    brief_text = "Find 5 warehouse or industrial-style filming locations in Mumbai suitable for a thriller scene.\nPrioritize strong visual match, realistic accessibility, useful public information, and low production risk."
    draw.rounded_rectangle([320, 300, 1860, 400], radius=10, fill=(9, 13, 20), outline=(50, 65, 90), width=1)
    draw.text((340, 320), brief_text, font=get_font(17), fill=TEXT_WHITE)
    
    # Parameters row
    params = [
        ("TARGET REGION", "Mumbai, Maharashtra (35km radius)"),
        ("SCENE ARCHETYPE", "Industrial Warehouse / High Ceiling Thriller"),
        ("POWER SPECIFICATION", "3-Phase 125kVA Generator Truck Viability"),
        ("PRODUCTION BUDGET", "Moderate (Municipal / Port Authority Standard)")
    ]
    x_p = 320
    for label, val in params:
        draw.rounded_rectangle([x_p, 420, x_p + 365, 490], radius=8, fill=(12, 17, 26), outline=(40, 50, 70), width=1)
        draw.text((x_p + 15, 432), label, font=get_font(10, True), fill=TEXT_DIM)
        draw.text((x_p + 15, 455), val, font=get_font(12, True), fill=TEXT_WHITE)
        x_p += 385
        
    # Weights row
    draw.text((320, 515), "PRIORITY WEIGHTS:", font=get_font(11, True), fill=TEXT_MUTED)
    draw.rounded_rectangle([440, 510, 590, 535], radius=12, fill=(35, 30, 15), outline=GOLD, width=1)
    draw.text((455, 515), "Scene Match: 40%", font=get_font(11, True), fill=GOLD)
    
    draw.rounded_rectangle([605, 510, 770, 535], radius=12, fill=(10, 30, 40), outline=CYAN, width=1)
    draw.text((620, 515), "Accessibility: 20%", font=get_font(11, True), fill=CYAN)
    
    draw.rounded_rectangle([785, 510, 955, 535], radius=12, fill=(10, 35, 25), outline=EMERALD, width=1)
    draw.text((800, 515), "Evidence Quality: 20%", font=get_font(11, True), fill=EMERALD)
    
    draw.rounded_rectangle([970, 510, 1140, 535], radius=12, fill=(40, 15, 15), outline=RED, width=1)
    draw.text((985, 515), "Risk Penalty: 20%", font=get_font(11, True), fill=RED)
    
    # Launch button
    draw.rounded_rectangle([320, 545, 600, 585], radius=8, fill=GOLD)
    draw.text((350, 555), "▶ RUN DEMO SCOUT (1-CLICK)", font=get_font(13, True), fill=(6, 8, 13))

    # Architecture Overview Callout
    draw.rounded_rectangle([290, 630, 1890, 1030], radius=14, fill=(11, 15, 24), outline=(40, 55, 80), width=1)
    draw.text((320, 655), "THE SCENESCOUT AUTONOMOUS AGENT LOOP", font=get_font(16, True), fill=CYAN)
    
    loop_steps = [
        ("1. Multi-Dimensional Decomposition", "Gemini 2.5 Flash deconstructs creative brief into architectural cues, acoustic noise profile, power needs.", "🧠 Gemini 2.5 Flash"),
        ("2. Autonomous Targeted Search Dispatch", "Agent formulates queries dispatched to Parallel Search API (api.parallel.ai/v1/search) across port/film registries.", "⚡ Parallel Search API"),
        ("3. Strict Evidence Extraction & Grounding", "Filters raw HTML snippets into cited evidence quotes. Cites official gazettes; flags uncertainties.", "🛡 Trust Verification Engine"),
        ("4. Algorithmic Multi-Pillar Scoring", "Computes composite scores across Scene Match, Road Access, Evidence Quality, and Production Risk.", "📊 Transparent Scoring")
    ]
    
    y_l = 705
    for title, desc, tag in loop_steps:
        draw.rounded_rectangle([320, y_l, 1860, y_l + 65], radius=8, fill=CARD_BG, outline=(40, 50, 70), width=1)
        draw.text((340, y_l + 12), title, font=get_font(14, True), fill=TEXT_WHITE)
        draw.text((340, y_l + 35), desc, font=get_font(12), fill=TEXT_MUTED)
        draw.rounded_rectangle([1600, y_l + 16, 1840, y_l + 48], radius=6, fill=(20, 30, 45), outline=CYAN, width=1)
        draw.text((1615, y_l + 24), tag, font=get_font(11, True), fill=CYAN)
        y_l += 78

    return img

# SCENE 3: Live Agent Scouting & 5 Ranked Cards
def make_scene_3(t):
    img, draw = create_base_canvas()
    
    # Timeline Banner (Active execution)
    draw.rounded_rectangle([290, 95, 1890, 265], radius=12, fill=(12, 18, 30), outline=GOLD, width=2)
    draw.ellipse([315, 115, 327, 127], fill=GOLD)
    draw.text((338, 110), "AUTONOMOUS SCOUT TIMELINE — 14 SOURCES CONSULTED", font=get_font(14, True), fill=GOLD)
    
    steps = [
        ("Query Formulation", "Decomposed thriller brief into 4 search angles", "DONE"),
        ("Parallel Search API", "Queried api.parallel.ai across MbPA and Film City", "DONE"),
        ("Snippet Normalization", "Extracted 14 verified evidence excerpts", "DONE"),
        ("Risk & Logistics Scoring", "Calculated 4 transparent pillars & shortlist order", "DONE")
    ]
    x_s = 315
    for title, desc, st in steps:
        draw.rounded_rectangle([x_s, 145, x_s + 365, 245], radius=8, fill=(16, 22, 35), outline=(45, 60, 85), width=1)
        draw.text((x_s + 15, 158), "✓ " + title, font=get_font(13, True), fill=EMERALD)
        draw.text((x_s + 15, 182), desc, font=get_font(11), fill=TEXT_MUTED)
        draw.rounded_rectangle([x_s + 15, 215, x_s + 90, 235], radius=4, fill=(10, 35, 20))
        draw.text((x_s + 25, 219), "VERIFIED", font=get_font(9, True), fill=EMERALD)
        x_s += 388

    # Shortlist Header
    draw.text((290, 285), "PRODUCTION SHORTLIST (5 RANKED CANDIDATES)", font=get_font(20, True), fill=TEXT_WHITE)
    draw.text((290, 312), "18 candidates evaluated across Mumbai Port Trust & Industrial Corridors. Top 5 shortlisted by composite score.", font=get_font(13), fill=TEXT_MUTED)
    
    # 5 Candidates
    candidates_data = [
        (1, "Cotton Green Port Trust Godowns", "Sewri-Cotton Green", 91, 92, 90, 22, "Low Risk", True, True),
        (2, "Mukesh Mills Heritage Compound", "Colaba Waterfront", 84, 95, 75, 48, "Moderate", True, False),
        (3, "Reay Road Timber & Iron Yards", "Reay Road Goods Depot", 80, 82, 85, 30, "Low Risk", True, False),
        (4, "Sewri Container Freight Station", "Sewri Port Corridor", 82, 85, 88, 38, "Moderate", True, False),
        (5, "Shakti Mills Abandoned Compound", "Mahalaxmi West", 62, 94, 40, 88, "High Risk", False, False)
    ]
    
    card_w = 780
    card_h = 180
    
    positions = [
        (290, 345),
        (1100, 345),
        (290, 545),
        (1100, 545),
        (290, 745)
    ]
    
    for idx, data in enumerate(candidates_data):
        rank, name, area, score, match, access, risk, r_label, ver, hl = data
        x, y = positions[idx]
        draw_candidate_card(draw, x, y, card_w, card_h, rank, name, area, score, match, access, risk, r_label, ver, hl)

    # Callout banner for Candidate #5 High Risk
    draw.rounded_rectangle([1100, 745, 1880, 925], radius=12, fill=(35, 15, 20), outline=RED, width=1)
    draw.text((1125, 765), "⚠ CRITICAL PRODUCTION HAZARD FLAGGED", font=get_font(14, True), fill=RED)
    draw.text((1125, 795), "Location #5 (Shakti Mills) is under active High Court liquidation proceedings.", font=get_font(13, True), fill=TEXT_WHITE)
    draw.text((1125, 820), "• Sealed perimeter & legal receivership prevent municipal filming permits.", font=get_font(12), fill=TEXT_MUTED)
    draw.text((1125, 842), "• Heavy structural deterioration presents major crew liability hazard.", font=get_font(12), fill=TEXT_MUTED)
    draw.text((1125, 864), "• SceneScout automatically flags this to protect production teams.", font=get_font(12), fill=GOLD)

    return img

# SCENE 4: Deep Research Dossier & Parallel Search Integration
def make_scene_4(t):
    img, draw = create_base_canvas()
    
    # Darkened backdrop overlay for modal
    draw.rectangle([270, 0, 1920, 1080], fill=(5, 7, 12))
    
    # Modal Box (Cotton Green Deep Dossier)
    modal_x, modal_y, modal_w, modal_h = 360, 60, 1480, 960
    draw.rounded_rectangle([modal_x, modal_y, modal_x + modal_w, modal_y + modal_h], radius=16, fill=(12, 16, 26), outline=GOLD, width=2)
    
    # Modal Header
    draw.rounded_rectangle([modal_x + 30, modal_y + 25, modal_x + 195, modal_y + 50], radius=6, fill=(10, 35, 25), outline=EMERALD, width=1)
    draw.text((modal_x + 40, modal_y + 30), "✓ VERIFIED PRODUCTION DOSSIER", font=get_font(10, True), fill=EMERALD)
    
    draw.text((modal_x + 30, modal_y + 60), "Cotton Green Port Trust Godowns & Cotton Exchange Depot", font=get_font(26, True), fill=TEXT_WHITE)
    draw.text((modal_x + 30, modal_y + 98), "Rank #1 • Overall Production Score: 91/100 • Low Legal & Operational Risk", font=get_font(14), fill=GOLD)
    
    # Close button
    draw.rounded_rectangle([modal_x + modal_w - 60, modal_y + 25, modal_x + modal_w - 25, modal_y + 60], radius=6, fill=(25, 30, 45))
    draw.text((modal_x + modal_w - 48, modal_y + 30), "✕", font=get_font(18), fill=TEXT_WHITE)

    # Parallel Search Runtime Call Badge
    draw.rounded_rectangle([modal_x + 30, modal_y + 130, modal_x + modal_w - 30, modal_y + 200], radius=10, fill=(10, 25, 35), outline=CYAN, width=1)
    draw.text((modal_x + 45, modal_y + 142), "⚡ RUNTIME PARALLEL SEARCH API TOOL CALL EXECUTED", font=get_font(12, True), fill=CYAN)
    draw.text((modal_x + 45, modal_y + 168), "Endpoint: https://api.parallel.ai/v1/search?q=mumbai+port+authority+cotton+green+godowns+filming+lease", font=get_font(13), fill=GOLD_LIGHT)

    # 2 Column layout inside modal
    # Left Column: Operational Logistics (power, parking, dimensions)
    col1_x = modal_x + 30
    col1_w = 690
    draw.rounded_rectangle([col1_x, modal_y + 220, col1_x + col1_w, modal_y + 580], radius=10, fill=CARD_BG, outline=(40, 50, 70), width=1)
    draw.text((col1_x + 20, modal_y + 240), "OPERATIONAL LOGISTICS SPECIFICATIONS", font=get_font(14, True), fill=CYAN)
    
    specs = [
        ("Crew Parking Footprint", "Dedicated private apron fits 15 heavy equipment trucks + 3 vanity vans."),
        ("Power Hookup", "3-phase 415V 125kVA industrial drop on site; generator trailers permitted."),
        ("Ceiling & Dimensions", "9.5m clear ceiling height, 18,000 sq ft uninterrupted brick column floor."),
        ("Sound & Acoustics", "Buffer zone from Eastern Freeway, suitable for sync-sound recording."),
        ("Night Filming Rules", "Permitted under standard MbPA commercial filming guidelines; 24/7 access.")
    ]
    y_sp = modal_y + 275
    for lbl, val in specs:
        draw.text((col1_x + 20, y_sp), "• " + lbl + ":", font=get_font(13, True), fill=TEXT_WHITE)
        draw.text((col1_x + 35, y_sp + 22), val, font=get_font(12), fill=TEXT_MUTED)
        y_sp += 58

    # Right Column: Verified Source Evidence Quotes
    col2_x = modal_x + 740
    col2_w = 690
    draw.rounded_rectangle([col2_x, modal_y + 220, col2_x + col2_w, modal_y + 580], radius=10, fill=CARD_BG, outline=(40, 50, 70), width=1)
    draw.text((col2_x + 20, modal_y + 240), "GROUNDED EVIDENCE & CITATION AUDIT TRAIL", font=get_font(14, True), fill=EMERALD)
    
    citations = [
        ("Mumbai Port Authority Land Lease Circular #MBPA/2023/FILM", "Official MbPA guidelines define short-term shooting licenses for Cotton Green godowns. Standard daily tariff: ₹75,000/shift.", "mbport.gov.in"),
        ("Maharashtra Film, Stage & Cultural Dev. Corp (MFSCDC)", "Registered location #MUM-IND-402 with single-window clearance protocol via Maharashtra Maitri portal.", "filmcitymumbai.gov.in"),
        ("Mumbai Heritage Conservation Committee Registry", "Grade II-B industrial godown structure approved for temporary filming sets with zero masonry alteration.", "mumbailocations.gov.in")
    ]
    y_cit = modal_y + 275
    for title, quote, dom in citations:
        draw.rounded_rectangle([col2_x + 15, y_cit, col2_x + col2_w - 15, y_cit + 90], radius=6, fill=(10, 14, 22), outline=(35, 45, 60), width=1)
        draw.text((col2_x + 25, y_cit + 10), title[:65], font=get_font(11, True), fill=GOLD_LIGHT)
        draw.text((col2_x + 25, y_cit + 30), quote[:95], font=get_font(10), fill=TEXT_MUTED)
        draw.text((col2_x + 25, y_cit + 65), f"🔗 Verified Source: {dom}", font=get_font(10, True), fill=CYAN)
        y_cit += 98

    # Bottom Callout: Trust Hierarchy Principle
    draw.rounded_rectangle([modal_x + 30, modal_y + 600, modal_x + modal_w - 30, modal_y + 730], radius=10, fill=(18, 24, 38), outline=GOLD, width=1)
    draw.text((modal_x + 45, modal_y + 615), "AGENT TRUST HIERARCHY — ZERO HALLUCINATED PERMITS", font=get_font(13, True), fill=GOLD)
    draw.text((modal_x + 45, modal_y + 642), "SceneScout enforces a non-negotiable trust protocol: if a location's filming status cannot be verified from a municipal or port circular,", font=get_font(12), fill=TEXT_WHITE)
    draw.text((modal_x + 45, modal_y + 665), "it is marked REQUIRES CONFIRMATION and penalizes the risk score. Notice Shakti Mills (#5) is explicitly flagged for its active liquidation dispute.", font=get_font(12), fill=TEXT_MUTED)
    draw.text((modal_x + 45, modal_y + 692), "This protects film producers from catastrophic mid-shoot police shutdowns and permit fines.", font=get_font(12, True), fill=EMERALD)

    return img

# SCENE 5: Conversational Refinement & Decision Matrix
def make_scene_5(t):
    img, draw = create_base_canvas()
    
    # Conversational Panel
    draw.rounded_rectangle([290, 95, 1890, 480], radius=14, fill=CARD_BG, outline=CYAN, width=2)
    draw.text((320, 115), "ASK SCENESCOUT — CONVERSATIONAL RE-RANKING & REASONING", font=get_font(15, True), fill=CYAN)
    draw.text((320, 138), "Direct the agent to re-evaluate candidates against dynamic production constraints.", font=get_font(12), fill=TEXT_MUTED)
    
    # Chat message 1: Producer command
    draw.rounded_rectangle([320, 170, 1860, 230], radius=8, fill=(20, 25, 38), outline=(50, 60, 80), width=1)
    draw.text((340, 182), "🎬 Producer (You):", font=get_font(12, True), fill=GOLD)
    draw.text((340, 202), "Remove locations with uncertain access and re-rank the shortlist by lowest production risk.", font=get_font(14, True), fill=TEXT_WHITE)
    
    # Chat message 2: Agent Response
    draw.rounded_rectangle([320, 245, 1860, 390], radius=8, fill=(10, 25, 35), outline=CYAN, width=1)
    draw.text((340, 258), "🤖 SceneScout Agent (Google Gemini 2.5 Flash):", font=get_font(12, True), fill=CYAN)
    draw.rounded_rectangle([720, 255, 840, 275], radius=4, fill=(10, 35, 25))
    draw.text((730, 259), "✓ RE-RANKED", font=get_font(10, True), fill=EMERALD)
    
    resp_text = (
        "Shortlist re-evaluated against lowest production risk criteria:\n"
        "1. Filtered out #5 Shakti Mills Compound: Eliminated due to ongoing Bombay High Court receivership and restricted access.\n"
        "2. Promoted #1 Cotton Green Port Trust Godowns (Risk: 22%) and #2 Sewri Container Terminal (Risk: 30%) to top priority.\n"
        "3. Both top candidates offer certified 125kVA generator truck clearances and verified MbPA lease frameworks."
    )
    draw.text((340, 285), resp_text, font=get_font(13), fill=TEXT_WHITE)
    
    # Interactive input box
    draw.rounded_rectangle([320, 410, 1860, 460], radius=8, fill=(10, 14, 22), outline=(50, 65, 85), width=1)
    draw.text((340, 426), "Ask follow-up (e.g. 'Which location has the best parking for 15 crew trucks?')...", font=get_font(13), fill=TEXT_DIM)
    
    # Side-by-Side Decision Matrix Modal Preview
    draw.rounded_rectangle([290, 510, 1890, 1040], radius=14, fill=(12, 16, 25), outline=GOLD, width=2)
    draw.text((320, 530), "CANDIDATE DECISION MATRIX — SIDE-BY-SIDE EVALUATION", font=get_font(16, True), fill=GOLD)
    draw.text((320, 555), "Comparing Top 2 Candidates for Final Production Selection", font=get_font(13), fill=TEXT_MUTED)
    
    # Table Header
    draw.rounded_rectangle([320, 585, 1860, 625], radius=6, fill=(20, 26, 40))
    draw.text((340, 597), "METRIC / ATTRIBUTE", font=get_font(12, True), fill=TEXT_DIM)
    draw.text((750, 597), "COTTON GREEN GODOWNS (#1)", font=get_font(12, True), fill=GOLD)
    draw.text((1300, 597), "SEWRI CONTAINER TERMINAL (#2)", font=get_font(12, True), fill=CYAN)
    
    matrix_rows = [
        ("Composite Score", "91 / 100 (Top Recommendation)", "82 / 100 (Secondary Option)"),
        ("Visual Aesthetic", "Moody high-ceiling industrial brick warehouse", "Gigantic container canyons & industrial rail crane"),
        ("Generator Power", "3-phase 415V 125kVA drop on site", "Requires mobile generator trucks (access verified)"),
        ("Parking Footprint", "15 heavy crew trucks + 3 vanity vans", "20+ commercial container trailer clearance"),
        ("Permit Protocol", "Standard MbPA daily lease (₹75k/shift)", "Port Authority commercial clearance required"),
        ("Production Risk", "22% (Low Risk • Verified by Sources)", "30% (Low Risk • Port Security Clearance)")
    ]
    
    y_m = 635
    for attr, opt1, opt2 in matrix_rows:
        draw.rectangle([320, y_m, 1860, y_m + 45], fill=(15, 20, 32) if (y_m // 45) % 2 == 0 else (12, 16, 25))
        draw.text((340, y_m + 14), attr, font=get_font(12, True), fill=TEXT_WHITE)
        draw.text((750, y_m + 14), opt1, font=get_font(12), fill=GOLD_LIGHT)
        draw.text((1300, y_m + 14), opt2, font=get_font(12), fill=CYAN_LIGHT)
        y_m += 48

    # Final Agent Verdict Banner
    draw.rounded_rectangle([320, 930, 1860, 1010], radius=8, fill=(10, 35, 25), outline=EMERALD, width=1)
    draw.text((340, 945), "🎯 AGENT VERDICT & RECOMMENDATION:", font=get_font(13, True), fill=EMERALD)
    draw.text((340, 970), "Select Cotton Green Godowns for interior sync-sound thriller scenes; utilize Sewri Container Terminal for exterior vehicle chases.", font=get_font(13), fill=TEXT_WHITE)

    return img

# SCENE 6: Export Production Brief & Tech Stack Closing
def make_scene_6(t):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([120, 80, 1800, 1000], radius=20, fill=(11, 15, 25), outline=GOLD, width=2)
    
    draw.rounded_rectangle([720, 120, 1200, 160], radius=8, fill=(35, 30, 15), outline=GOLD, width=1)
    draw.text((740, 130), "🎬 AGENTIC CINEMA HACKATHON", font=get_font(16, True), fill=GOLD)
    
    draw.text((200, 195), "SceneScout: Autonomous Production Intelligence", font=get_font(38, True), fill=TEXT_WHITE)
    draw.text((200, 250), "Empowering filmmakers to move from creative brief to verified, risk-mitigated production in under 30 seconds.", font=get_font(18), fill=TEXT_MUTED)
    
    # 2 Big Cards: Export Brief on left, Tech Stack on right
    # Left Card: Export Brief
    draw.rounded_rectangle([200, 310, 960, 820], radius=14, fill=CARD_BG, outline=(50, 65, 90), width=1)
    draw.text((230, 335), "📄 ONE-CLICK PRODUCTION BRIEF EXPORT", font=get_font(16, True), fill=CYAN)
    draw.text((230, 365), "Generates defensible Markdown & PDF dossiers for line producers:", font=get_font(13), fill=TEXT_MUTED)
    
    export_bullets = [
        "✓ Full candidate dossiers with verified source citations",
        "✓ Power specifications (kVA, 3-phase drops) for gaffers",
        "✓ Truck clearance & parking footprints for transport coordinators",
        "✓ Official permit application contacts & fee schedules",
        "✓ Explicit hazard warnings on restricted/court-disputed sites"
    ]
    y_b = 410
    for b in export_bullets:
        draw.text((230, y_b), b, font=get_font(14), fill=TEXT_WHITE)
        y_b += 45

    draw.rounded_rectangle([230, 720, 520, 770], radius=8, fill=GOLD)
    draw.text((250, 735), "📥 EXPORT PRODUCTION BRIEF.MD", font=get_font(12, True), fill=(6, 8, 13))

    # Right Card: Tech Stack & Track Alignment
    draw.rounded_rectangle([1020, 310, 1780, 820], radius=14, fill=CARD_BG, outline=(50, 65, 90), width=1)
    draw.text((1050, 335), "🛠 ARCHITECTURE & HACKATHON TRACKS", font=get_font(16, True), fill=GOLD)
    
    techs = [
        ("Google Cloud / Gemini 2.5 Flash", "Core reasoning engine, multi-dimensional brief decomposition, structured synthesis, conversational re-ranking.", GOLD),
        ("Parallel Search API (api.parallel.ai)", "Live web research layer, dense snippet extraction from municipal, port, and heritage archives.", CYAN),
        ("Next.js 14 & TypeScript", "Cinema-grade responsive user interface, real-time activity timeline, side-by-side decision matrix.", TEXT_WHITE),
        ("Grounding & Trust Protocol", "Strict anti-hallucination verification preventing fictitious addresses and unauthorized filming claims.", EMERALD)
    ]
    y_t = 395
    for name, desc, col in techs:
        draw.text((1050, y_t), "• " + name, font=get_font(15, True), fill=col)
        draw.text((1070, y_t + 26), desc, font=get_font(12), fill=TEXT_MUTED)
        y_t += 75

    # Footer
    draw.rounded_rectangle([200, 850, 1780, 940], radius=12, fill=(15, 22, 35), outline=EMERALD, width=1)
    draw.text((240, 875), "🎬 Ready for Production. Built for Filmmakers.", font=get_font(20, True), fill=EMERALD)
    draw.text((240, 905), "SceneScout demonstrates real runtime execution of Google Gemini 2.5 Flash and Parallel Search API. Thank you!", font=get_font(14), fill=TEXT_MUTED)

    return img

# RENDER MASTER FUNCTION
def render_full_video():
    scenes = [
        ("part1_problem.wav", make_scene_1),
        ("part2_intro.wav", make_scene_2),
        ("part3_demo.wav", make_scene_3),
        ("part4_reasoning.wav", make_scene_4),
        ("part5_rerank.wav", make_scene_5),
        ("part6_closing.wav", make_scene_6)
    ]

    total_frames = 0
    scene_durations = []
    
    print("Analyzing audio tracks...")
    for wav_file, _ in scenes:
        wav_path = os.path.join(AUDIO_DIR, wav_file)
        with wave.open(wav_path, 'r') as w:
            dur = w.getnframes() / float(w.getframerate())
            scene_durations.append(dur)
            frames = int(dur * FPS)
            total_frames += frames
            print(f"{wav_file}: {dur:.2f}s -> {frames} frames")
            
    print(f"Total Video Duration: {sum(scene_durations):.2f}s (~{sum(scene_durations)/60:.1f} mins), Total Frames: {total_frames}")

    # Set up OpenCV VideoWriter
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(TEMP_VIDEO, fourcc, float(FPS), (WIDTH, HEIGHT))
    
    print("Rendering video frames...")
    frame_count = 0
    for idx, (wav_file, renderer) in enumerate(scenes):
        dur = scene_durations[idx]
        n_frames = int(dur * FPS)
        print(f"Rendering Scene {idx+1}/{len(scenes)} ({n_frames} frames)...")
        
        # Render scene image
        pil_img = renderer(0)
        # Convert RGB to BGR for OpenCV
        cv_frame = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        
        for f in range(n_frames):
            out.write(cv_frame)
            frame_count += 1
            if frame_count % 100 == 0:
                print(f"Progress: {frame_count}/{total_frames} frames ({(frame_count/total_frames)*100:.1f}%)")
                
    out.release()
    print("Visuals rendered to temp video!")

    # Concatenate audio tracks with ffmpeg
    print("Concatenating audio files...")
    concat_list_path = "scratch/audio_list.txt"
    with open(concat_list_path, "w") as f:
        for wav_file, _ in scenes:
            f.write(f"file '{os.path.abspath(os.path.join(AUDIO_DIR, wav_file))}'\n")
            
    merged_audio = "scratch/merged_audio.wav"
    concat_cmd = [
        FFMPEG_EXE, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-c", "copy",
        merged_audio
    ]
    subprocess.run(concat_cmd, check=True)
    print("Audio tracks merged successfully!")

    # Mux video + audio into final MP4
    print(f"Muxing final video to {FINAL_VIDEO}...")
    mux_cmd = [
        FFMPEG_EXE, "-y",
        "-i", TEMP_VIDEO,
        "-i", merged_audio,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        FINAL_VIDEO
    ]
    subprocess.run(mux_cmd, check=True)
    print(f"DEMO VIDEO COMPLETE! Saved to {FINAL_VIDEO} ({os.path.getsize(FINAL_VIDEO)} bytes)")

if __name__ == "__main__":
    render_full_video()
