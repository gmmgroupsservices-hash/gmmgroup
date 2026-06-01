import { Property } from "./types";

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "GMM Lumina Sky Mansion",
    price: "₹8.5 Crore",
    numericPrice: 85000000,
    location: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    beds: 5,
    baths: 6,
    sqft: 6800,
    type: "Villa",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-home-with-swimming-pool-and-lights-at-night-41584-large.mp4",
    rera: true,
    featured: true,
    description: "An architectural masterpiece in Hyderabad's premier quarter. Featuring double-height ceilings, a private glass pool cascading over the hillside, state-of-the-art automation by Crestron, and custom Italian marble flooring throughout.",
    highlights: ["Panoramic Hill City Views", "12m Infinite Cascading Pool", "Underground 4-Car Gallery"],
    amenities: ["Smart Home OS", "Private Elevator", "Wine Cellar", "Private Theatre", "24/7 Butler Service"],
    category: "Buy",
    valuation: "₹8.2 - ₹8.8 Crore",
    investmentYield: "7.2% Projected ROI"
  },
  {
    id: "prop-2",
    title: "Aura Horizon Penthouse",
    price: "₹4.8 Crore",
    numericPrice: 48000000,
    location: "Whitefield, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    beds: 4,
    baths: 4,
    sqft: 4200,
    type: "Apartment",
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-interior-design-of-a-luxury-living-room-34289-large.mp4",
    rera: true,
    featured: true,
    description: "Soaring high above India's tech hub, this penthouse offers an immersive sky-loft experience. Wrapped in floor-to-ceiling high-performance glazing, it boasts a 360-degree view of Bangalore's shimmering horizon.",
    highlights: ["Overhanging Skydeck Lounge", "Triplex Floor-to-ceiling Windows", "Acoustician-optimized Media Salon"],
    amenities: ["Infinity Sky Pool", "Private Concierge", "Biometric Security", "Wellness Pavilion", "EV Supercharger Hub"],
    category: "Buy",
    valuation: "₹4.5 - ₹5.1 Crore",
    investmentYield: "6.8% Rental Yield"
  },
  {
    id: "prop-3",
    title: "The GMM Vista Sovereign Estates",
    price: "₹12.0 Crore",
    numericPrice: 120000000,
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    beds: 6,
    baths: 7,
    sqft: 8500,
    type: "Villa",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-gorgeous-house-surrounded-by-trees-at-sunset-41585-large.mp4",
    rera: true,
    featured: true,
    description: "Nestled in the lush lanes of Indiranagar, these boutique villas combine mid-century modernist tropical styling with sovereign security assets. Handcrafted teakwood columns meet ultra-clear monolithic smart-tinting glass panels.",
    highlights: ["Internal Zero-Oxygen Botanical Courtyard", "Fully Armored Safe Room", "Solar-Faceted Green Battery Backup"],
    amenities: ["Spa Sauna", "Private Chef Kitchen", "High-Fidelity Audio Zone", "Hydroponic Organic Garden", "Tesla Powerwall Backup"],
    category: "Buy",
    valuation: "₹11.5 - ₹12.4 Crore",
    investmentYield: "8.1% Capitalization Rate"
  },
  {
    id: "prop-4",
    title: "GMM TechPark Obsidian HQ",
    price: "₹35.0 Crore",
    numericPrice: 350000000,
    location: "Gachibowli, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    beds: 0,
    baths: 8,
    sqft: 22000,
    type: "Commercial",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    rera: true,
    featured: false,
    description: "A premier futuristic commercial corporate tower headquarters. Designed for high-frequency trading firms, deep tech startups, or family offices demanding sovereign technical grade connectivity and bulletproof secure zones.",
    highlights: ["Gigabit Fiber Triple Ring Redundancy", "Dedicated Tier-3 Data Center Ground Suite", "Helipad Authorized Runway Access"],
    amenities: ["Biometric Portal Sluice", "Pressurized Air Filter Matrix", "Ultra-Silent Chiller Arrays", "240-Seat Amphitheatre", "Secure Executive Lounge"],
    category: "Buy",
    valuation: "₹33.5 - ₹36.8 Crore",
    investmentYield: "11.4% Long-Term Yield"
  },
  {
    id: "prop-5",
    title: "Marina Boulevard Horizon Plots",
    price: "₹3.5 Crore",
    numericPrice: 35000000,
    location: "Rushikonda Beach, Vizag",
    city: "Vizag",
    state: "AP",
    beds: 0,
    baths: 0,
    sqft: 4500,
    type: "Plot",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
    rera: true,
    featured: false,
    description: "Prime beach-facing premium developmental high-value lands in Andhra Pradesh's burgeoning executive capital. Pre-approved for instant multi-elevation luxury villa development with direct private beach slipway permissions.",
    highlights: ["Full Unobstructed Oceanfront Shoreline", "A-grade Gated Layout Infrastructure", "Dynamic Corner Multi-elevation Dual Aspect"],
    amenities: ["Private Slipway Access", "Direct Underground Fiber Line", "24/7 Patrol Sentry", "Fresh Groundwater Recharge Grid"],
    category: "Buy",
    valuation: "₹3.2 - ₹3.7 Crore",
    investmentYield: "15% Projected Land Appreciation"
  },
  {
    id: "prop-6",
    title: "Nova Crest Elite Executive Suites",
    price: "₹2.5 Lakh/mo",
    numericPrice: 250000,
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    beds: 2,
    baths: 3,
    sqft: 1950,
    type: "Apartment",
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-inside-a-tastefully-decorated-living-room-34288-large.mp4",
    rera: true,
    featured: false,
    description: "High-contrast urban elegance meets tech-nomad luxury. Fully furnished with bespoke Scandinavian custom oak cabinetry, sub-zero premium cooling stacks, and high-frequency noise-dampening acoustic panels.",
    highlights: ["Fully Furnished with Masterpiece Works", "Triple Pane Zero Noise Window Glaze", "Direct Elevator Transit Keycard Access"],
    amenities: ["Integrated Multiroom Sonos Audio", "Rooftop Heated Wellness Hot Tub", "Weekly Housekeeper Maid", "Underground Secure Valet Park"],
    category: "Rent",
    valuation: "₹2.2 - ₹2.7 Lakh/mo",
    investmentYield: "5.4% Cash-on-Cash Return"
  },
  {
    id: "prop-7",
    title: "Nagarjuna Luxury Sovereign Plots",
    price: "₹1.9 Crore",
    numericPrice: 19000000,
    location: "Vijayawada Smart Layout, Vijayawada",
    city: "Vijayawada",
    state: "AP",
    beds: 0,
    baths: 0,
    sqft: 3600,
    type: "Plot",
    imageUrl: "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&q=80&w=1200",
    rera: true,
    featured: false,
    description: "Premium investment-ready dynamic plots in AP's heartland district. Fully integrated urban high-efficiency master development with wide solar-illuminated avenues, private parks, and advanced smart automated security infrastructure.",
    highlights: ["100 ft. Wide Direct Connecting Avenue", "Fully Gated Premium High-Fenced Community", "Water Connection Dedicated Pipeline Matrix"],
    amenities: ["Smart Solar Avenues", "Central Recreation Field", "Gated Security Guard Gates", "Self-sustainable Biogas Digester Ready"],
    category: "Buy",
    valuation: "₹1.8 - ₹2.1 Crore",
    investmentYield: "18% Capital Gain Forecast"
  },
  {
    id: "prop-8",
    title: "GMM Cyber Oasis Duplex",
    price: "₹3.80 Lakh/mo",
    numericPrice: 380000,
    location: "HITEC City, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    beds: 3,
    baths: 4,
    sqft: 3100,
    type: "Apartment",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    rera: true,
    featured: false,
    description: "An ultra-contemporary sky duplex catering to the elite tech executive. Nested in the heart of Hyderabad's cybersecurity hub. Features dynamic smart glass partitions, private fitness deck, and premium sub-zero kitchen suites.",
    highlights: ["Biometric Smart Lock Integration", "Acoustic-Insulated private Study Room", "Double-Height Lounge Garden Deck"],
    amenities: ["Dual Zone Smart HVAC", "Infinite Skyline Views", "Fitted Gym System", "Bespoke Italian Kitchen", "2 Dedicated EV Parking Lots"],
    category: "Rent",
    valuation: "₹3.5 - ₹4.0 Lakh/mo",
    investmentYield: "6.2% Gross Rent Yield"
  },
  {
    id: "prop-9",
    title: "Symphony Hills Royal Villa",
    price: "₹7.2 Crore",
    numericPrice: 72000000,
    location: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    beds: 4,
    baths: 5,
    sqft: 5200,
    type: "Villa",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200",
    rera: true,
    featured: false,
    description: "Elegant contemporary villa featuring a private internal water cascade, dual master dressing halls, a state-of-the-art solar roof matrix, and security airlocks.",
    highlights: ["Architectural Water Curtain Entry", "Off-grid Solar Energy Matrix Battery", "Double Security Airtight Entry Portal"],
    amenities: ["Private Pool", "Heated Spa Bath", "Home Concierge Pod", "Central Vacuum Grid", "Surround Sound Living"],
    category: "Just Sold",
    valuation: "₹7.5 Crore (Realized)",
    investmentYield: "Pre-secured 35% Appreciation Gain"
  }
];

export const SERVICES = [
  {
    icon: "ShieldAlert",
    title: "Sovereign Asset Brokerage",
    description: "Discreet advisory & acquisition representation for India's high-net-worth families, tech-founders, and elite institutional offices."
  },
  {
    icon: "Coins",
    title: "Fintech Mortgage Optimization",
    description: "Proprietory real-time pre-approval integrations providing optimal structural lending formulas from partner premium banking consortia."
  },
  {
    icon: "ShieldCheck",
    title: "GMM Trust Verification (RERA)",
    description: "Stringent structural, statutory and clean tenure verification. Every villa, plot, and commercial landmark carries pre-approved GMM Trust seal."
  },
  {
    icon: "Compass",
    title: "AI-Powered Location Synergy",
    description: "Advanced model simulations compiling micro-market insights, historic land growth rates, infra corridors, and regional air-quality matrices."
  }
];

export const FEATURES_GRID = [
  {
    stat: "₹1,200 Cr+",
    label: "Sovereign Portfolio Value Managed",
    description: "Direct premium property assets under persistent strategic advisory across Bangalore, Hyderabad, and coastal executive sectors."
  },
  {
    stat: "150+",
    label: "Ultra-High Net Worth Clients",
    description: "Trusted partners including multi-family offices, public leaders, and trailblazing tech unicorns."
  },
  {
    stat: "100% RERA",
    label: "Clean Statutory Clearances",
    description: "A total guarantee of absolute clean, conflict-free land titles, zero litigation, and speed-approved clearances."
  },
  {
    stat: "<0.01%",
    label: "Friction Rate Transactions",
    description: "High-velocity paperwork pipelines executing with white-glove banking handshakes and zero downtime."
  }
];

export const REELS = [
  {
    id: "reel-1",
    title: "Inside the ₹12 Cr GMM Sovereignty Estate",
    description: "A comprehensive look at the tropical modernist glass elements and hidden zero-oxygen botanical space in Indiranagar, Bangalore.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-home-with-swimming-pool-and-lights-at-night-41584-large.mp4",
    duration: "45s"
  },
  {
    id: "reel-2",
    title: "Walking Tour: WHITEFIELD AURA Penthouse",
    description: "Soaring 40 floors above Earth. Shimmering high-contrast Bangalore city deck panoramas and integrated private sound stages.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-interior-design-of-a-luxury-living-room-34289-large.mp4",
    duration: "30s"
  },
  {
    id: "reel-3",
    title: "Sovereign Gachibowli HQ Obsidian Tour",
    description: "A short, cinematic flight through the high-frequency trading headquarters' custom air filter matrix and helipad system.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-gorgeous-house-surrounded-by-trees-at-sunset-41585-large.mp4",
    duration: "55s"
  }
];

export const TESTIMONIALS = [
  {
    name: "Dr. K. Srinivas Rao",
    role: "Founder, Peak Horizon Tech",
    quote: "GMM Groups & Services redefined real estate procurement for me. Their advisory was incredibly data-centric, high-trust, and completely sovereign. I bought a penthouse worth ₹4.8 Cr through them with absolute ease and peace of mind.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Anjali Deshmukh",
    role: "Managing Director, Vista Family Office",
    quote: "Finding high-value plots and commercial units in Telangana/AP with clean records is quite challenging. GMM's RERA transparency, robust verification maps, and seamless transactional escrow protocols did wonders for our corporate fleet expansion.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Vikramjit Banerjee",
    role: "Co-Founder, CoreStack Unicorn",
    quote: "The GMM Smart AI Concierge actually suggested Lumina Sky Mansion based on my daily commute and private airfield flight paths. The white-glove closing took only 48 hours. Phenomenal tech synergy and unparalleled customer support.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
];

export const FAQS = [
  {
    question: "What makes GMM Groups & Services different from standard real estate brokers?",
    answer: "We are a full-scale digital prime-brokerage, blending investment banking rigor with modern tech. Unlike basic platforms that match listings blindly, we verify every single property, purchase high-resolutions ourselves, provide sovereign advisory, coordinate white-glove bank syndications, and guarantee 100% litigate-free RERA-certified ownership."
  },
  {
    question: "Do you offer property transactions across AP, Telangana, and Karnataka?",
    answer: "Yes. Our core premium corridors are located in Hyderabad (Jubilee Hills, Gachibowli, HITEC City), Bangalore (Whitefield, Indiranagar, Koramangala), and Vizag (beachfront luxury plots). We are expanding to other major premium sectors soon."
  },
  {
    question: "How does the GMM Smart AI Property Advisor work?",
    answer: "Our intelligent concierge is built on top of elite Gemini language models. It takes your real estate criteria, commute habits, investment yields, and stylistic preferences to instantly filter, suggest, and customize ideal structural itineraries from our exclusive portfolio."
  },
  {
    question: "What are your verification steps for premium Land Plots?",
    answer: "Every land plot marketed through us goes through a rigorous four-phase legal tenure registry audit. We map satellite coordinates, secure RERA authorization, review land use zoning certs, and procure clean, unconditional title deeds verified by senior high-court counsels."
  },
  {
    question: "Can we trade, sell, or liquidate our luxury assets through your network?",
    answer: "Absolutely. Our elite member network comprises over 150+ ultra-high-net-worth individuals, tech founders, and executive trusts. We run high-discretion private sales syndicates that liquidate properties swiftly in private off-market catalogs."
  }
];
