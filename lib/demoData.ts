import { LocationCandidate, AgentActivityStep, ResearchSession } from './types';

export const DEMO_BRIEF = 
  "Find 5 warehouse or industrial-style filming locations in Mumbai suitable for a thriller scene. Prioritize strong visual match, realistic accessibility, useful public information, and low production risk. Include location details, why it matches the scene, potential filming restrictions or uncertainties, contact information if publicly available, and sources.";

export const DEMO_CANDIDATES: LocationCandidate[] = [
  {
    id: "loc-mumbai-01",
    name: "Mukesh Mills Heritage Mill Compound",
    area: "Colaba / Sassoon Docks",
    city: "Mumbai",
    description: "Iconic 19th-century private mill ruins facing the Arabian Sea. Features weathered brick arches, cavernous roofless boiler rooms, dramatic coastal light, and gritty dystopian textures quintessential for noir and crime thrillers.",
    sceneMatchScore: 96,
    accessibilityScore: 78,
    productionRiskScore: 38, // Low-Medium risk
    evidenceQualityScore: 92,
    overallScore: 88,
    visualCharacteristics: [
      "Distressed 1870s Victorian brick chimneys and skeletal iron trusses",
      "High natural contrast with direct sea-facing lighting and shadow corridors",
      "Large open courtyard alongside cavernous roofless machine halls",
      "Overgrown wild vegetation intertwined with rusted industrial machinery"
    ],
    productionConsiderations: {
      accessibility: "Direct vehicular approach via Colaba / Sassoon Dock Road; internal pathway suitable for crew vans and generator trucks.",
      parking: "Dedicated private compound parking for up to 6 vanity vans and equipment trucks.",
      operatingEnvironment: "Private property with gated perimeter. High ambient sea breeze and distant dock horn noise.",
      ownershipStatus: "Private Estate (Trustees of Mukesh Mills / Private Lineage)",
      potentialRestrictions: [
        "Strict curfew: Many productions restrict night shooting past 10:00 PM due to residential proximity.",
        "Structural fragility: Upper catwalks are cordoned off for crew safety.",
        "Private commercial filming rate card applies; BMC and local police NOC required."
      ],
      contactInformation: "Estate Caretaker & Location Manager Liaison: Sassoon Docks Compound Office, Colaba",
      powerAvailability: "Industrial 3-phase line connection point available; backup 125kVA generator strongly recommended.",
      noiseProfile: "Moderate: Ocean surf and distant dock activity; manageable for sync sound with directional shotgun mics."
    },
    potentialRestrictions: [
      "Night shooting curfew enforced past 22:00 IST",
      "Structural safety waiver mandatory for upper catwalk levels",
      "Requires Colaba Police Station local NOC"
    ],
    contactInformation: "Colaba Compound Booking Office / Local Line Producer Guild",
    estimatedTariff: "₹75,000 - ₹1,20,000 / shift (12 hrs)",
    contactDetails: {
      phone: "+91 22 2218 4402",
      email: "estates@mukeshcompound.co.in",
      officeDesk: "Colaba Sassoon Docks Estate Office, Gate 3",
      notes: "Requires local police NOC; bookings coordinated via Sassoon Docks estate manager."
    },
    sources: [
      {
        title: "Mumbai Film Office - Historic Mill Production Directory",
        url: "https://mumbaifilmoffice.org/locations/mukesh-textile-mills-colaba",
        domain: "mumbaifilmoffice.org",
        snippet: "Mukesh Textile Mills remains South Mumbai's most frequently scouted atmospheric ruin for cinematic action, suspense, and thriller sequences with coastal backdrops.",
        relevance: "Primary historic filming directory verification"
      },
      {
        title: "Architectural Heritage of Bombay Cotton Mills",
        url: "https://architecturaldigest.in/story/abandoned-textile-mills-mumbai-cinematic-history",
        domain: "architecturaldigest.in",
        snippet: "Documents the skeletal iron architecture, dramatic natural shadows, and structural conditions of Colaba's coastal mill sector.",
        relevance: "Visual texture and layout corroboration"
      },
      {
        title: "Maharashtra Film Stage and Cultural Development Corp (Film City)",
        url: "https://filmcitymumbai.gov.in/location-scouting-guidelines",
        domain: "filmcitymumbai.gov.in",
        snippet: "Guidelines on single-window clearance and mandatory local police permissions for filming at heritage dockside properties in South Mumbai.",
        relevance: "Regulatory and safety protocol verification"
      }
    ],
    recommendation: "Top visual choice for thriller climaxes. Unrivaled cinematic atmosphere, but secure early BMC/police clearances for night shifts.",
    confidence: 94,
    trustStatus: "PUBLIC INFORMATION FOUND",
    evidenceQuotes: [
      {
        claim: "High visual match with brick chimneys and skeletal iron trusses suitable for gritty thrillers.",
        sourceTitle: "Architectural Heritage of Bombay Cotton Mills",
        sourceUrl: "https://architecturaldigest.in/story/abandoned-textile-mills-mumbai-cinematic-history"
      },
      {
        claim: "Private property with dedicated staging area for production generator trucks.",
        sourceTitle: "Mumbai Film Office - Historic Mill Production Directory",
        sourceUrl: "https://mumbaifilmoffice.org/locations/mukesh-textile-mills-colaba"
      },
      {
        claim: "Filming permissions require BMC NOC and local precinct notification.",
        sourceTitle: "Maharashtra Film Stage and Cultural Development Corp",
        sourceUrl: "https://filmcitymumbai.gov.in/location-scouting-guidelines"
      }
    ]
  },
  {
    id: "loc-mumbai-02",
    name: "Cotton Green Port Trust Godowns & Cotton Exchange Depot",
    area: "Cotton Green / Kalachowki",
    city: "Mumbai",
    description: "Expansive 1920s port storage godowns with vaulted 40-foot timber-and-corrugated iron ceilings, railway siding tracks, and damp concrete alleys. Ideal for clandestine warehouse meetings, chase sequences, and illicit cargo plotlines.",
    sceneMatchScore: 92,
    accessibilityScore: 89,
    productionRiskScore: 28, // Low risk
    evidenceQualityScore: 90,
    overallScore: 91,
    visualCharacteristics: [
      "Endless parallel warehouse corridors with corrugated sheet walls and heavy sliding iron bay doors",
      "Overhead clerestory skylights providing moody, dusty beam shafts of daylight",
      "Decommissioned narrow-gauge freight rail tracks embedded in cracked concrete flooring",
      "Massive industrial loading bays with raised wooden dispatch platforms"
    ],
    productionConsiderations: {
      accessibility: "Wide multi-lane access off Eastern Freeway and Reay Road. Easy turnaround for 40-foot grip trucks.",
      parking: "Sprawling private tarmac capable of staging over 15 production trucks and basecamp.",
      operatingEnvironment: "Active daylight commercial freight depot, but nighttime operations drop to near-zero silence.",
      ownershipStatus: "Mumbai Port Authority (MbPA) / Leased Warehousing operators",
      potentialRestrictions: [
        "MbPA commercial permit required 7 working days prior to shoot.",
        "Security pass required for all cast and crew entering the port security perimeter.",
        "Fire department inspection mandatory if practical pyro or smoke FX are planned."
      ],
      contactInformation: "Mumbai Port Authority Estate & Commercial Filming Division, Ballard Estate",
      powerAvailability: "Commercial grid hookup (63 Amp socket) + ample space for dual silenced generators.",
      noiseProfile: "Low at night; daytime suffers from intermittent harbor railway shunting and loading trucks."
    },
    potentialRestrictions: [
      "MbPA official port filming permit with 7-day advance notice",
      "No flammable open flames or pyrotechnics without dedicated fire tender on site",
      "Security identification check for entire technical crew"
    ],
    contactInformation: "Mumbai Port Authority Filming Cell: mbpa.gov.in/estate-filming",
    estimatedTariff: "₹60,000 / 12-hr shift (MbPA Official Gazette rate)",
    contactDetails: {
      phone: "+91 22 6656 4051",
      email: "commercialfilming@mumbaiport.gov.in",
      officeDesk: "MbPA Estate Division, Port House, Shoorji Vallabhdas Marg, Ballard Estate",
      notes: "Official MbPA single-window shoot clearance; requires 7 working days notice."
    },
    sources: [
      {
        title: "Mumbai Port Authority (MbPA) - Commercial Filming Guidelines",
        url: "https://mumbaiport.gov.in/filming-clearance-guidelines",
        domain: "mumbaiport.gov.in",
        snippet: "Official port gazette detailing hourly filming tariffs, security deposit rates, and single-window shoot applications for Cotton Green and Sewri godowns.",
        relevance: "Official legal and permit authority"
      },
      {
        title: "Locations India: Industrial Godowns of Central Mumbai",
        url: "https://filminginindia.com/locations/cotton-green-industrial-depots",
        domain: "filminginindia.com",
        snippet: "Cotton Green warehouses offer 12,000 sq ft uninterrupted interior clear-span, accessible for heavy equipment rigs and high-angle camera cranes.",
        relevance: "Logistics and technical production specifications"
      },
      {
        title: "Times of India: Port land transformations for Bollywood film shoots",
        url: "https://timesofindia.indiatimes.com/city/mumbai/port-trust-opens-historic-warehouses-for-film-crews/articleshow/98421.cms",
        domain: "timesofindia.indiatimes.com",
        snippet: "Port authority actively encourages filming in decommissioned cotton storage units under standardized tariff schemes.",
        relevance: "Practical filming precedent and accessibility confirmation"
      }
    ],
    recommendation: "Highest overall score and lowest bureaucratic risk. Standardized official MbPA permit pathway with supreme logistics for heavy crews.",
    confidence: 96,
    trustStatus: "VERIFIED BY SOURCES",
    evidenceQuotes: [
      {
        claim: "Standardized commercial shoot tariff and single-window clearance through Mumbai Port Authority.",
        sourceTitle: "Mumbai Port Authority (MbPA) - Commercial Filming Guidelines",
        sourceUrl: "https://mumbaiport.gov.in/filming-clearance-guidelines"
      },
      {
        claim: "Massive 12,000 sq ft uninterrupted column-free interior with 40ft clear height.",
        sourceTitle: "Locations India: Industrial Godowns of Central Mumbai",
        sourceUrl: "https://filminginindia.com/locations/cotton-green-industrial-depots"
      },
      {
        claim: "Unrestricted access for large production vehicles via Eastern Freeway feeder roads.",
        sourceTitle: "Times of India: Port land transformations",
        sourceUrl: "https://timesofindia.indiatimes.com/city/mumbai/port-trust-opens-historic-warehouses-for-film-crews/articleshow/98421.cms"
      }
    ]
  },
  {
    id: "loc-mumbai-03",
    name: "Reay Road Timber & Iron Yard Sheds",
    area: "Reay Road / Darukhana",
    city: "Mumbai",
    description: "Gritty industrial labyrinth of maritime scrap yards, iron foundries, and soaring timber storage hangers. Deep rust patina, heavy steel beams, and towering stacks of weathered teak create a raw, dangerous underworld aesthetic.",
    sceneMatchScore: 94,
    accessibilityScore: 68,
    productionRiskScore: 54, // Moderate-High risk
    evidenceQualityScore: 79,
    overallScore: 78,
    visualCharacteristics: [
      "Towering 30-foot stacks of weathered maritime timber and oxidizing iron chains",
      "Corrugated iron roof overhangs casting sharp geometric shadows",
      "Active industrial dust and haze providing natural atmospheric volumetric light",
      "Narrow damp cobblestone alleys with authentic working-class industrial grit"
    ],
    productionConsiderations: {
      accessibility: "Tight approach road frequently congested by flatbed steel haulers; best accessed during weekend or night windows.",
      parking: "Limited internal lot; production basecamp must be established 200m away in leased open yard.",
      operatingEnvironment: "High daytime activity with cutting torches, diesel haulers, and metal grinding.",
      ownershipStatus: "Mixed private timber merchants / MbPA leaseholders",
      potentialRestrictions: [
        "Daytime sync sound is practically impossible due to metal cutting and heavy transport.",
        "Individual yard owners require direct cash or commercial rental agreements.",
        "Strict health & safety precautions needed regarding protruding rebar and heavy timber."
      ],
      contactInformation: "Darukhana Iron & Steel Scrap Merchants Association Office",
      powerAvailability: "No reliable high-amp commercial line; mobile silent generators required.",
      noiseProfile: "Very high during working hours (8 AM - 7 PM); drops significantly after 8 PM."
    },
    potentialRestrictions: [
      "Night shooting only recommended for clean audio",
      "Narrow lanes require smaller grip vehicles (mini-vans instead of 40ft trailers)",
      "Individual owner permissions negotiated yard-by-yard"
    ],
    contactInformation: "Reay Road Timber Association Secretariat / Local Ward Line Producer",
    estimatedTariff: "₹40,000 - ₹65,000 / night shift",
    contactDetails: {
      phone: "+91 98201 54320",
      email: "darukhana.merchants.assoc@gmail.com",
      officeDesk: "Darukhana Scrap & Timber Association Office, Coal Bunder Road",
      notes: "Private negotiations per yard owner; night shoots strongly advised for clean audio."
    },
    sources: [
      {
        title: "Mid-Day Mumbai: The cinematic allure of Darukhana's scrap yards",
        url: "https://mid-day.com/mumbai/mumbai-culture/article/darukhana-the-underbelly-backdrop-of-indie-cinema-23194",
        domain: "mid-day.com",
        snippet: "Independent neo-noir directors frequently film at Darukhana yards for authentic underworld and smuggling scenes without studio artificiality.",
        relevance: "Cultural & cinematic precedent"
      },
      {
        title: "Mumbai Film Location Guide - Central Industrial Belt",
        url: "https://filminginindia.com/guide/reay-road-timber-depots",
        domain: "filminginindia.com",
        snippet: "Logistics warning: Heavy commercial traffic on Reay Road requires careful scheduling; night shoots strongly advised.",
        relevance: "Operational risk and logistics verification"
      }
    ],
    recommendation: "Maximum raw authenticity for underworld thriller aesthetics, but requires experienced location managers to coordinate parking and sound.",
    confidence: 82,
    trustStatus: "REQUIRES CONFIRMATION",
    evidenceQuotes: [
      {
        claim: "Authentic working scrap metal and timber yards with intense industrial grit.",
        sourceTitle: "Mid-Day Mumbai: The cinematic allure of Darukhana",
        sourceUrl: "https://mid-day.com/mumbai/mumbai-culture/article/darukhana-the-underbelly-backdrop-of-indie-cinema-23194"
      },
      {
        claim: "High daytime operational noise makes sync-sound challenging without night filming schedule.",
        sourceTitle: "Mumbai Film Location Guide",
        sourceUrl: "https://filminginindia.com/guide/reay-road-timber-depots"
      }
    ]
  },
  {
    id: "loc-mumbai-04",
    name: "Sewri Container Freight Station & Rail Godown",
    area: "Sewri / BPT Harbor",
    city: "Mumbai",
    description: "Vast concrete apron surrounded by stacked shipping containers, towering maritime gantry cranes, and a cavernous, disused cargo dispatch shed. Evokes high-stakes international thriller and espionage thriller vibes.",
    sceneMatchScore: 88,
    accessibilityScore: 92,
    productionRiskScore: 32, // Low-Moderate risk
    evidenceQualityScore: 86,
    overallScore: 86,
    visualCharacteristics: [
      "Geometric container canyon walls (multi-colored, weathered industrial metal)",
      "High-mast sodium-vapor stadium lights creating harsh cinematic rim lighting",
      "50,000 sq ft flat asphalt surface suitable for complex vehicle stunt choreography",
      "Covered rail dispatch shed with concrete loading platforms and steel pillars"
    ],
    productionConsiderations: {
      accessibility: "Superb access straight off Sewri-Nhava Sheva Atal Setu link and Eastern Freeway.",
      parking: "Unrivaled staging area: can easily park 30+ production vehicles, catering tents, and honeywagons.",
      operatingEnvironment: "Controlled security perimeter with gated boom barriers and 24/7 security watchtowers.",
      ownershipStatus: "Private Logistics Operator & Central Warehousing Corporation (CWC)",
      potentialRestrictions: [
        "Filming in active container zones requires 48-hour container movement freeze agreement.",
        "Customs bonded area restrictions apply to specific demarcated bays.",
        "Drone/aerial camera operations require Bureau of Civil Aviation Security (BCAS) clearance."
      ],
      contactInformation: "Sewri Logistics Park Management & Event Bookings Desk",
      powerAvailability: "Multiple 415V 3-phase industrial power drops across the apron.",
      noiseProfile: "Moderate: Low urban echo; occasional distant container truck horn."
    },
    potentialRestrictions: [
      "Drone flights prohibited without BCAS / Police aerial permit",
      "Customs-bonded bays strictly off-limits to filming equipment",
      "Commercial liability insurance policy proof required"
    ],
    contactInformation: "Sewri CFS Operations & Filming Desk, BPT Road",
    estimatedTariff: "₹85,000 / day (Apron + Rail Shed)",
    contactDetails: {
      phone: "+91 22 2413 7789",
      email: "cfs-shoots@cewacor.nic.in",
      officeDesk: "Central Warehousing Corp Regional Office, BPT Freight Terminal, Sewri",
      notes: "Requires 48-hour container movement freeze notice and BCAS clearance for drone camera work."
    },
    sources: [
      {
        title: "Central Warehousing Corporation Commercial Filming Policy",
        url: "https://cewacor.nic.in/filming-and-promotional-shoots-guidelines",
        domain: "cewacor.nic.in",
        snippet: "Standardized booking rates for open CFS yards and empty rail godowns in maritime transit zones.",
        relevance: "Official rate and permit guidelines"
      },
      {
        title: "Location Scouter India: Stunt & Chase Locations Mumbai",
        url: "https://filminginindia.com/stunt-chase-locations-mumbai-freight-station",
        domain: "filminginindia.com",
        snippet: "Sewri freight yard praised by Bollywood action directors for wide-turning radius, vehicle stunts, and clean electrical grid tie-ins.",
        relevance: "Production stunt and logistical feasibility"
      }
    ],
    recommendation: "Premier choice if your thriller brief includes vehicle chases, tactical armed confrontations, or massive production footprints.",
    confidence: 91,
    trustStatus: "VERIFIED BY SOURCES",
    evidenceQuotes: [
      {
        claim: "50,000+ sq ft clear paved apron with ample staging for vehicle stunt sequences.",
        sourceTitle: "Location Scouter India",
        sourceUrl: "https://filminginindia.com/stunt-chase-locations-mumbai-freight-station"
      },
      {
        claim: "Official CWC single-window shoot reservation system with transparent fee structure.",
        sourceTitle: "Central Warehousing Corporation Commercial Filming Policy",
        sourceUrl: "https://cewacor.nic.in/filming-and-promotional-shoots-guidelines"
      }
    ]
  },
  {
    id: "loc-mumbai-05",
    name: "Shakti Mills Abandoned Compound Ruins",
    area: "Mahalaxmi / Famous Studio Lane",
    city: "Mumbai",
    description: "Deep overgrown industrial forest reclaiming collapsed textile spinning sheds and Victorian brick masonry. Uniquely eerie, claustrophobic atmosphere with dangling banyan roots, moss-covered steel boilers, and silent crumbling chimneys.",
    sceneMatchScore: 91,
    accessibilityScore: 55,
    productionRiskScore: 78, // High risk
    evidenceQualityScore: 84,
    overallScore: 69,
    visualCharacteristics: [
      "Lush jungle vegetation engulfing 100-year-old collapsed masonry structures",
      "Deep shadowy nooks and broken glass skylights with emerald moss patina",
      "Striking juxtaposition of decrepit ruin against modern Lower Parel skyscrapers",
      "Gothic industrial atmosphere ideal for psychological suspense and horror thrillers"
    ],
    productionConsiderations: {
      accessibility: "Pedestrian entrance via narrow lane off Dr E Moses Road; equipment must be carted in by hand/trolleys (no heavy vehicle drive-in).",
      parking: "Zero on-site parking; crew vehicles must pay for external commercial parking at Mahalaxmi Racecourse / Famous Studios.",
      operatingEnvironment: "Completely abandoned, unlit, and unmaintained. Highly sensitive historical and legal backdrop.",
      ownershipStatus: "Court Liquidator (Official Liquidator, Bombay High Court)",
      potentialRestrictions: [
        "HIGH LEGAL RISK: The property is subject to ongoing Bombay High Court liquidation proceedings.",
        "Strict police surveillance; unauthorized entry is considered trespassing.",
        "BMC health warning regarding stagnant monsoon water, venomous reptiles, and structural roof collapses."
      ],
      contactInformation: "Office of the Official Liquidator, High Court of Bombay, Bank Street, Fort",
      powerAvailability: "Zero electrical infrastructure; 100% reliant on portable silent generators carted on hand-trucks.",
      noiseProfile: "Surprisingly quiet interior enclave muffled by heavy tree canopy, with periodic suburban train horn from Mahalaxmi station."
    },
    potentialRestrictions: [
      "HIGH REGULATORY UNCERTAINTY: Requires formal Bombay High Court Liquidator permission",
      "No vehicle access inside compound gates",
      "Severe structural hazard warnings for unstable brick gables",
      "Night shoots require private security ring and emergency medical crew on standby"
    ],
    contactInformation: "Official Liquidator, High Court of Bombay (Requires legal filing)",
    estimatedTariff: "Non-Standard (Judicial Escrow / ₹1,50,000+ legal deposit)",
    contactDetails: {
      phone: "+91 22 2267 0411",
      email: "ol-mumbai@mca.gov.in",
      officeDesk: "Office of the Official Liquidator, High Court of Bombay, 5th Floor, Bank Street, Fort",
      notes: "Formal High Court application mandatory; unauthorized entry strictly prosecuted."
    },
    sources: [
      {
        title: "Bombay High Court Official Liquidator Public Notices",
        url: "https://bombayhighcourt.nic.in/official-liquidator-notices",
        domain: "bombayhighcourt.nic.in",
        snippet: "Notices governing security custody, trespass prohibitions, and court clearance requirements for defunct Mahalaxmi textile estates.",
        relevance: "Legal custody and judicial jurisdiction"
      },
      {
        title: "The Indian Express: The silent ruins of Mahalaxmi's mill lands",
        url: "https://indianexpress.com/article/cities/mumbai/the-ghost-mills-of-central-mumbai-shakti-mills-ruins-8192301",
        domain: "indianexpress.com",
        snippet: "Detailed investigation into the court receivership, security perimeter, and structural decay of the Shakti Mills compound.",
        relevance: "Safety and access risk validation"
      }
    ],
    recommendation: "Visually haunting but legally hazardous. Recommended only if your production has dedicated legal counsel to petition the High Court liquidator.",
    confidence: 88,
    trustStatus: "REQUIRES CONFIRMATION",
    evidenceQuotes: [
      {
        claim: "Property is currently under judicial custody of the Bombay High Court Official Liquidator.",
        sourceTitle: "Bombay High Court Official Liquidator Public Notices",
        sourceUrl: "https://bombayhighcourt.nic.in/official-liquidator-notices"
      },
      {
        claim: "Vehicle access impossible inside the gates; equipment must be hand-carried across uneven terrain.",
        sourceTitle: "The Indian Express: The silent ruins of Mahalaxmi",
        sourceUrl: "https://indianexpress.com/article/cities/mumbai/the-ghost-mills-of-central-mumbai-shakti-mills-ruins-8192301"
      }
    ]
  }
];

export const DEMO_ACTIVITY_STEPS: AgentActivityStep[] = [
  {
    id: "step-1",
    stepNumber: 1,
    title: "Interpreting Production Brief",
    description: "Extracting core criteria: Thriller aesthetic, Mumbai region, industrial warehouse architecture, accessibility balance, and production risk evaluation.",
    status: "completed",
    timestamp: "00:01",
    toolUsed: "brief_parser"
  },
  {
    id: "step-2",
    stepNumber: 2,
    title: "Planning Research Strategy",
    description: "Generated 6 targeted search vectors covering Mumbai port lands, heritage mills, railway freight depots, and commercial film permits.",
    status: "completed",
    timestamp: "00:03",
    toolUsed: "research_planner"
  },
  {
    id: "step-3",
    stepNumber: 3,
    title: "Executing Parallel Search API",
    description: "Dispatched queries to Parallel Search API (api.parallel.ai/v1/search) with objective: 'industrial filming locations Mumbai warehouse thriller'.",
    status: "completed",
    timestamp: "00:06",
    toolUsed: "parallel_search"
  },
  {
    id: "step-4",
    stepNumber: 4,
    title: "Extracting & Normalizing Sources",
    description: "Gathered 14 web sources from Mumbai Port Authority, Film City Maharashtra, architectural archives, and location agency directories.",
    status: "completed",
    timestamp: "00:09",
    toolUsed: "source_extractor"
  },
  {
    id: "step-5",
    stepNumber: 5,
    title: "Cross-Checking Visual Suitability",
    description: "Analyzed ceiling heights, corrugated textures, shadow corridors, and cinematic grimness against thriller scene specifications.",
    status: "completed",
    timestamp: "00:12",
    toolUsed: "visual_evaluator"
  },
  {
    id: "step-6",
    stepNumber: 6,
    title: "Evaluating Logistics & Accessibility",
    description: "Assessed heavy vehicle access off Eastern Freeway, generator parking space, and crew basecamp viability for each candidate.",
    status: "completed",
    timestamp: "00:14",
    toolUsed: "accessibility_analyzer"
  },
  {
    id: "step-7",
    stepNumber: 7,
    title: "Evaluating Legal & Production Risks",
    description: "Flagged High Court receivership on Shakti Mills and night curfew on Mukesh Mills. Verified official MbPA permit route for Cotton Green.",
    status: "completed",
    timestamp: "00:16",
    toolUsed: "risk_evaluator"
  },
  {
    id: "step-8",
    stepNumber: 8,
    title: "Synthesizing Evidence & Verifying Claims",
    description: "Attached explicit source URLs and domain citations to every visual and logistical claim. Applied legal caution labels.",
    status: "completed",
    timestamp: "00:18",
    toolUsed: "evidence_verifier"
  },
  {
    id: "step-9",
    stepNumber: 9,
    title: "Multi-Criteria Algorithmic Ranking",
    description: "Calculated weighted scores: Scene Match (40%), Accessibility (20%), Evidence (20%), and Risk Penalty (20%).",
    status: "completed",
    timestamp: "00:20",
    toolUsed: "ranker"
  },
  {
    id: "step-10",
    stepNumber: 10,
    title: "Preparing Production Shortlist Report",
    description: "Compiled 5 top candidate dossiers with full contact pathways, restrictions, and agentic recommendations.",
    status: "completed",
    timestamp: "00:22",
    toolUsed: "report_generator"
  }
];

export const DEMO_SESSION: ResearchSession = {
  id: "session-mumbai-thriller-demo",
  userBrief: DEMO_BRIEF,
  criteria: {
    city: "Mumbai",
    sceneType: "Industrial Thriller Warehouse",
    budgetSensitivity: "Moderate",
    budgetRange: "₹50,000 - ₹1,00,000 / day (Commercial standard)",
    maxDistanceKm: 35,
    priorities: {
      sceneMatch: 40,
      accessibility: 20,
      evidenceQuality: 20,
      productionRisk: 20
    }
  },
  candidates: DEMO_CANDIDATES,
  activity: DEMO_ACTIVITY_STEPS,
  sourcesConsultedCount: 14,
  candidatesFoundCount: 18,
  shortlistedCount: 5,
  mode: "demo",
  summary: "18 candidate industrial sites in Mumbai were researched across municipal port records, film commission archives, and location guilds. 5 high-potential locations have been shortlisted and ranked based on visual match, crew logistics, and legal clarity.",
  createdAt: new Date().toISOString()
};
