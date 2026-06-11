import React, { useState } from "react";
import { Search, MapPin, DollarSign, Home, Users, Percent, HelpCircle } from "lucide-react";
import { INDIA_STATE_OPTIONS, getDistrictOptionsForState, getLocalityOptionsForDistrict } from "../locationData";

interface FiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  locationOptions: string[];
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedBudget: number;
  setSelectedBudget: (budget: number) => void;
  selectedBeds: number;
  setSelectedBeds: (beds: number) => void;
  onResetFilters: () => void;
}

export default function Filters({
  activeTab,
  setActiveTab,
  searchText,
  setSearchText,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedLocation,
  setSelectedLocation,
  locationOptions,
  selectedType,
  setSelectedType,
  selectedBudget,
  setSelectedBudget,
  selectedBeds,
  setSelectedBeds,
  onResetFilters
}: FiltersProps) {
  
  // Local state for interactive calculators & valuations corresponding to supplementary tabs
  const [mortgageAmount, setMortgageAmount] = useState<number>(50000000); // 5 Crore
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20);
  
  // Home Value Appraisal Form State
  const [appraisalSqft, setAppraisalSqft] = useState<string>("3500");
  const [appraisalCity, setAppraisalCity] = useState<string>("Bangalore");
  const [appraisalType, setAppraisalType] = useState<string>("Villa");
  const [appraisedValue, setAppraisedValue] = useState<string | null>(null);

  // Home Sales Submission State
  const [sellTitle, setSellTitle] = useState<string>("");
  const [sellPhone, setSellPhone] = useState<string>("");
  const [sellSubmitted, setSellSubmitted] = useState<boolean>(false);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(""); // Reset district when state shifts
    setSelectedLocation("");
  };

  const handleSearchClick = () => {
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Pre-approval quick EMI calculator logic
  const calculateEMI = () => {
    const P = mortgageAmount;
    const r = (interestRate / 12) / 100;
    const n = tenureYears * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? 0 : Math.round(emi);
  };

  const handleAppraise = (e: React.FormEvent) => {
    e.preventDefault();
    const size = parseInt(appraisalSqft) || 2000;
    let ratePerSqft = 9000; // Base rate
    if (appraisalCity === "Hyderabad") ratePerSqft = 12500;
    if (appraisalCity === "Bangalore") ratePerSqft = 14000;
    if (appraisalType === "Villa") ratePerSqft *= 1.4;
    if (appraisalType === "Commercial") ratePerSqft *= 1.8;

    const approxInr = size * ratePerSqft;
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(approxInr);
    setAppraisedValue(formatted);
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellTitle && sellPhone) {
      setSellSubmitted(true);
      setTimeout(() => setSellSubmitted(false), 8000);
    }
  };

  const localitySuggestions = Array.from(
    new Set([...getLocalityOptionsForDistrict(selectedState, selectedCity), ...locationOptions])
  ).sort();

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      
      {/* Outer Floating Glass Frame */}
      <div className="bg-slate-950/90 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] relative border border-white/10 overflow-hidden">
        
        {/* Glow Line Top */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-sky-400" />

        {/* Tab Header Selector */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto border-b border-white/5 pb-4 mb-6">
          {["All", "Buy", "Rent", "Just Sold", "Pre-approval", "Home Value", "Sell"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setAppraisedValue(null);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-gradient-teal-blue text-white shadow-md shadow-teal-500/10 border border-teal-400/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TABS 1-3: PROPERTY DIRECTORIES SEARCH ENGINE */}
        {(activeTab === "All" || activeTab === "Buy" || activeTab === "Rent" || activeTab === "Just Sold") && (
          <div className="space-y-6">
            
            {/* Row 1: Instant search text lookup */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 animate-pulse" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={
                  activeTab === "Rent"
                    ? "Enter BHK size, apartment or commercial in any Indian state, district, or locality"
                    : activeTab === "All"
                      ? "Search all GMM listings by property name, state, district, locality, or type..."
                      : "Try '4BHK Villa in Hyderabad', 'Jubilee Hills Mansion' or 'Sovereign Plots'..."
                }
                className="w-full glass-input pl-12 pr-4 py-4 rounded-2xl text-sm tracking-wide shadow-inner"
              />
            </div>

            {/* Row 2: Select Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Filter 1: State Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-outfit font-medium flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-teal-400" />
                  <span>State</span>
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="">All India States & UTs</option>
                  {INDIA_STATE_OPTIONS.map((state) => (
                    <option key={state.code} value={state.name}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Dynamic District based on State */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-outfit font-medium flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>District</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedLocation("");
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                  disabled={!selectedState}
                >
                  <option value="">{selectedState ? "All Districts" : "Select state first"}</option>
                  {getDistrictOptionsForState(selectedState).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 3: Exact Locality Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-outfit font-medium flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Locality</span>
                </label>
                <input
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  list="locality-suggestions"
                  placeholder="Search locality / village / society"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
                <datalist id="locality-suggestions">
                  {localitySuggestions.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>

              {/* Filter 4: Property Type Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-outfit font-medium flex items-center space-x-1">
                  <Home className="w-3 h-3 text-teal-400" />
                  <span>Property Type</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="">All Properties</option>
                  <option value="Villa">Open Villa Plots</option>
                  <option value="Apartment">Apartment Flats</option>
                  <option value="Commercial">Agricultural Lands</option>
                  <option value="Plot">Commercial Properties</option>
                </select>
              </div>

              {/* Filter 5: Capital Range Ceiling */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-outfit font-medium flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>Max Budget (INR)</span>
                </label>
                <select
                  value={selectedBudget || ""}
                  onChange={(e) => setSelectedBudget(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="">No Sovereign Ceiling</option>
                  <option value="300000">₹3 Lakh/mo Ceiling</option>
                  <option value="20000000">₹2.0 Crore Max</option>
                  <option value="50000000">₹5.0 Crore Max</option>
                  <option value="90000000">₹9.0 Crore Max</option>
                  <option value="150000000">₹15.0 Crore Max</option>
                  <option value="360000001">₹40.0 Crore Max</option>
                </select>
              </div>

              {/* Filter 6: BHK Beds count */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-outfit font-medium flex items-center space-x-1">
                  <Users className="w-3 h-3 text-teal-400" />
                  <span>Bedrooms BHK</span>
                </label>
                <select
                  value={selectedBeds || ""}
                  onChange={(e) => setSelectedBeds(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="">Any BHK Configuration</option>
                  <option value="2">2 BHK Suites</option>
                  <option value="3">3 BHK Premium</option>
                  <option value="4">4 BHK Skydeck</option>
                  <option value="5">5+ BHK Grand Estates</option>
                </select>
              </div>
            </div>

            {/* Quick Helper reset triggers */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-400">
                Found active grounded results matching your parameters...
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <Search className="h-4 w-4" />
                  Search Properties
                </button>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-xs font-semibold text-teal-400 underline transition hover:text-teal-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HIGH-FIDELITY PRE-APPROVAL PREWIEW MORTGAGE EMIS */}
        {activeTab === "Pre-approval" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-950/40 rounded-2xl p-5 border border-white/5">
            
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-lg text-teal-300 flex items-center space-x-2">
                <Percent className="w-5 h-5 text-teal-400" />
                <span>GMM Partner Premium Lending Estimator</span>
              </h3>
              <p className="text-xs text-gray-400">
                Optimize high-value mortgage plans pre-negotiated through our tier-1 private banking partners including ICICI Private Banking, HDFC Premium, and HSBC Premier.
              </p>

              {/* Principal Input */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Mortgage Loan Principal:</span>
                  <span className="text-teal-300 font-bold">₹{(mortgageAmount / 10000000).toFixed(2)} Crore</span>
                </div>
                <input
                  type="range"
                  min={10000000}
                  max={300000000}
                  step={5000000}
                  value={mortgageAmount}
                  onChange={(e) => setMortgageAmount(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-800"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Interest Formula (Annual):</span>
                  <span className="text-teal-300 font-bold">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={15}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-800"
                />
              </div>

              {/* Tenure in Years */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Syndicate Amortization Period:</span>
                  <span className="text-teal-200 font-bold">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-800"
                />
              </div>
            </div>

            {/* Simulated Calculations Panel */}
            <div className="bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/15 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-2 right-3 flex items-center space-x-1 bg-teal-400/10 px-2.5 py-0.5 rounded-full text-[9px] text-teal-300">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>RERA Clear Financing</span>
              </div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 mt-2">
                Estimated Monthly Sovereign Escrow Pay:
              </p>
              <h4 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2">
                ₹{new Intl.NumberFormat("en-IN").format(calculateEMI())}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">
                *Values are advisory figures. Contact GMM's legal banking syndics to prepare a pre-qualified executive letter.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: INSTANT HOME APPRISAL SCHEMES */}
        {activeTab === "Home Value" && (
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <form onSubmit={handleAppraise} className="space-y-4">
                <h3 className="font-display font-semibold text-base text-teal-300">
                  Precision Instant GMM Automated appraisal (AVM)
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Utilizes historical micro-market registry feeds and infrastructure corridor projections to calculate instant capital appraisals.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-gray-400">Built Area (Sqft)</span>
                    <input
                      type="number"
                      value={appraisalSqft}
                      onChange={(e) => setAppraisalSqft(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-teal-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-gray-400">Micro Market</span>
                    <select
                      value={appraisalCity}
                      onChange={(e) => setAppraisalCity(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-teal-300"
                    >
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Vizag">Vizag</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-gray-400">Architecture</span>
                    <select
                      value={appraisalType}
                      onChange={(e) => setAppraisalType(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-teal-300"
                    >
                      <option value="Villa">Villa Estate</option>
                      <option value="Apartment">Sky Suites</option>
                      <option value="Commercial">Commercial Offices</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-teal-blue text-white py-2 rounded-xl text-xs font-bold shadow-md hover:scale-101 cursor-pointer transition-transform"
                >
                  Generate Sovereign Valuation
                </button>
              </form>

              {/* Appraisal Statement Output */}
              <div className="bg-gradient-to-bl from-slate-900 via-teal-950/20 to-slate-950 border border-white/5 rounded-2xl p-6 text-center relative min-h-[170px] flex flex-col justify-center items-center">
                {appraisedValue ? (
                  <div className="space-y-2 animate-fade-in">
                    <span className="text-[9px] uppercase bg-teal-400/10 px-2.5 py-0.5 rounded-full text-teal-300 font-bold border border-teal-500/10">
                      GMM Trust Cleared Appraisal
                    </span>
                    <p className="text-gray-400 text-xs mt-2">Recommended Portfolio List Price Range:</p>
                    <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-white">{appraisedValue}</h4>
                    <p className="text-[9px] text-gray-500">
                      Confidence Score: 94% (Computed based on 23 recent comparable registered deeds).
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-400 space-y-2">
                    <HelpCircle className="w-10 h-10 mx-auto text-teal-400/35 animate-bounce" />
                    <p className="text-xs">Fill the registry settings and trigger GMM Valuation Calculator.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DISCREET ASSET SALE / ACQUISITION OFFERS */}
        {activeTab === "Sell" && (
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <form onSubmit={handleSellSubmit} className="space-y-3">
                <h3 className="font-display font-semibold text-sm text-teal-300">
                  Off-Market Liquidation Suite
                </h3>
                <p className="text-xs text-gray-400">
                  Are you holding private landmark developments? List discreetly with our private sales syndicate to connect with 150+ verified GMM family offices.
                </p>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    value={sellTitle}
                    onChange={(e) => setSellTitle(e.target.value)}
                    placeholder="e.g., 4BHK Elite Villa inside Jubilee Hills layouts"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-teal-300 focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={sellPhone}
                    onChange={(e) => setSellPhone(e.target.value)}
                    placeholder="Private Contact Number (+91)"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-teal-300 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-teal-blue text-white py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Initiate Strategic Valuation Call
                </button>
              </form>

              {/* Status Output */}
              <div className="bg-slate-900/55 rounded-2xl p-6 text-center border border-white/5 min-h-[170px] flex flex-col justify-center items-center">
                {sellSubmitted ? (
                  <div className="space-y-2 text-teal-300 animate-fade-in-up">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-sm font-bold">✓</span>
                    <p className="text-xs font-bold text-white mt-2">Handshake Initiated Securely</p>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Your asset has been registered under private ID prefix GMM-LQS. A executive registrar will call your contact code within 15 minutes over highly encrypted lines.
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">
                    <p className="leading-relaxed">
                      "GMM maintains complete off-record secrecy. Listed property indicators will never be displayed in public catalogs. Private sales are fully closed in absolute privacy."
                    </p>
                    <p className="text-teal-400 uppercase tracking-widest text-[9px] mt-2 font-bold">— GMM TRUST COMMITTEE</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
