import type React from "react";
import { BrickWall, Hammer, HandCoins, Paintbrush } from "lucide-react";

export type AddOnPageId = "loans" | "interior" | "paints" | "fencing";

export type AddOnPage = {
  id: AddOnPageId;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
  bullets: string[];
  steps: string[];
  cta: string;
};

export const ADD_ON_PAGES: AddOnPage[] = [
  {
    id: "loans",
    eyebrow: "Financial Support",
    title: "Home Loans",
    description: "A dedicated page for loan assistance, pre-approval support, and lender coordination tied to your property search.",
    accent: "from-emerald-500/20 via-teal-500/10 to-cyan-500/5",
    icon: HandCoins,
    details: ["Loan eligibility review", "Pre-approval assistance", "Bank comparison support", "EMI planning and guidance"],
    bullets: ["Loan eligibility review", "Pre-approval assistance", "Bank comparison support", "EMI planning and guidance"],
    steps: ["Share your budget", "Check eligibility", "Review offers", "Move to approval"],
    cta: "Start Loan Enquiry"
  },
  {
    id: "interior",
    eyebrow: "Design Support",
    title: "Interior Design",
    description: "A service page for space planning, premium styling, and turnkey interiors for homes and investment properties.",
    accent: "from-violet-500/20 via-fuchsia-500/10 to-indigo-500/5",
    icon: Hammer,
    details: ["Space planning", "Modular kitchen concepts", "Luxury finishes", "Turnkey execution"],
    bullets: ["Space planning", "Modular kitchen concepts", "Luxury finishes", "Turnkey execution"],
    steps: ["Book a consultation", "Share floor plan", "Approve concept", "Begin execution"],
    cta: "View Interior Options"
  },
  {
    id: "paints",
    eyebrow: "Finish Works",
    title: "Paint Works",
    description: "A dedicated page for interior and exterior paint packages, waterproofing, texture finishes, and color planning.",
    accent: "from-sky-500/20 via-cyan-500/10 to-blue-500/5",
    icon: Paintbrush,
    details: ["Exterior coatings", "Interior palette planning", "Waterproofing", "Premium textures"],
    bullets: ["Exterior coatings", "Interior palette planning", "Waterproofing", "Premium textures"],
    steps: ["Choose finish type", "Confirm palette", "Schedule site visit", "Complete painting"],
    cta: "Explore Paint Packages"
  },
  {
    id: "fencing",
    eyebrow: "Boundary Works",
    title: "Fencing Works",
    description: "A service page for compound walls, boundary protection, gate works, and perimeter design for plots and developments.",
    accent: "from-orange-500/20 via-amber-500/10 to-yellow-500/5",
    icon: BrickWall,
    details: ["Boundary walls", "Gate and grill works", "Perimeter security", "Layout fencing"],
    bullets: ["Boundary walls", "Gate and grill works", "Perimeter security", "Layout fencing"],
    steps: ["Inspect site", "Select fencing type", "Approve drawings", "Install boundary"],
    cta: "Open Fencing Inquiry"
  }
];

export const ADD_ON_PAGE_MAP = Object.fromEntries(ADD_ON_PAGES.map((page) => [page.id, page])) as Record<AddOnPageId, AddOnPage>;
