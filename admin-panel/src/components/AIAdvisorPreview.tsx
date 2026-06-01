/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Settings, 
  MessageSquareCode, 
  Plus, 
  Trash2, 
  Send, 
  Bot, 
  User, 
  Check, 
  HelpCircle,
  Smartphone,
  Save,
  X
} from 'lucide-react';
import { AIAdvisorConfig, Property, ServiceItem } from '../types';

interface AIAdvisorPreviewProps {
  config: AIAdvisorConfig;
  onSaveConfig: (updated: AIAdvisorConfig) => void;
  properties: Property[];
  services: ServiceItem[];
  onLogActivity: (type: 'general', action: string, details: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export default function AIAdvisorPreview({
  config,
  onSaveConfig,
  properties,
  services,
  onLogActivity
}: AIAdvisorPreviewProps) {
  // Config state binding
  const [tempConfig, setTempConfig] = useState<AIAdvisorConfig>({ ...config });
  const [newQuestion, setNewQuestion] = useState('');

  // Sandbox Chat Simulator state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: config.welcomeMessage || "Welcome to GMM groups! How can I assist you?",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempConfig({ ...config });
    // Reset conversation on config shifts
    setChatHistory([
      {
        id: 'welcome',
        sender: 'bot',
        text: config.welcomeMessage || "Welcome to GMM groups! How can I assist you?",
        timestamp: new Date()
      }
    ]);
  }, [config]);

  // Scroll to bottom helper
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSaveConfig = () => {
    onSaveConfig(tempConfig);
    onLogActivity('general', 'update', "Updated GMM AI Advisor system guidelines & prompt parameters");
    alert("AI Advisor config has been updated successfully.");
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const questions = [...tempConfig.suggestedQuestions, newQuestion.trim()].slice(0, 6); // Max 6
    setTempConfig({ ...tempConfig, suggestedQuestions: questions });
    setNewQuestion('');
  };

  const handleDeleteQuestion = (index: number) => {
    const questions = tempConfig.suggestedQuestions.filter((_, i) => i !== index);
    setTempConfig({ ...tempConfig, suggestedQuestions: questions });
  };

  // Chat message engine (Matches properties & services dynamically!)
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Append User message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    // Simulate standard streaming reply delay
    setTimeout(() => {
      const responseText = generateContextualReply(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  // Intelligently creates a reply based on user prompt and CURRENT real properties!
  const generateContextualReply = (input: string): string => {
    const q = input.toLowerCase();

    // 1. Match specific villa queries
    if (q.includes('villa') || q.includes('worli') || q.includes('waterfront')) {
      const villa = properties.find(p => p.category === 'Villa') || properties[0];
      if (villa) {
        return `Absolutely! GMM Groups offers the premium "${villa.title}" located at ${villa.location}, ${villa.city}. \n\n🔹 **Specifications:** ${villa.beds} BHK layout with ${villa.baths} baths measuring ${villa.squareFeet.toLocaleString()} sqft.\n🔹 **Price:** ₹${(villa.price / 10000000).toFixed(2)} Crores.\n🔹 **RERA Status:** ${villa.reraFlag ? "Registered & Approved ✅" : "Pending registration"}.\n\nIt features an immaculate master architectural layout and infinity pool. Would you like our broker team to set up a private VR walk-through?`;
      }
    }

    // 2. Match commercial office spaces
    if (q.includes('office') || q.includes('commercial') || q.includes('rent') || q.includes('bengaluru')) {
      const comm = properties.find(p => p.category === 'Commercial');
      if (comm) {
        const costStr = comm.price >= 100000 ? `₹${(comm.price / 100000).toFixed(2)} L/month` : `₹${comm.price}/month`;
        return `We currently have a highly coveted commercial spot in Bengaluru: "${comm.title}". \n\n🔹 **Location:** ${comm.location}, ${comm.city}\n🔹 **Spacious Area:** ${comm.squareFeet.toLocaleString()} sq.ft. \n🔹 **Rent Price:** ${costStr}\n🔹 **Highlights:** Custom corporate fitouts, central high-efficiency HVAC, independent server room, and executive boardroom.\n\nThis site is perfectly structured for IT operations, creative agencies, or NRI branch expansion. Shall I request our leasing executive block a field tour for you?`;
      }
    }

    // 3. Match land deeds or registry document services
    if (q.includes('deed') || q.includes('registry') || q.includes('documentation') || q.includes('land') || q.includes('services')) {
      const docSrv = services.find(s => s.title.toLowerCase().includes('document') || s.title.toLowerCase().includes('registry'));
      return `Certainly! GMM Groups provides comprehensive **Property & Lands Documentation Support**. Under our administrative service wing, we cover:\n\n1. **Title Deed Registration & mutations** to guarantee secure handholding.\n2. **NA (Non-Agricultural) Plot Conversions** and fast-track municipal permissions.\n3. **30-Year Chain Search Validation certificates** to guard against underlying title disputes.\n\nOur service prices are highly competitive, starting around ${docSrv?.priceRange || "₹15,000"}. Would you like to schedule a callback with our legal desk?`;
    }

    // 4. Match financial guidance or loan requests
    if (q.includes('loan') || q.includes('interest') || q.includes('mortgage') || q.includes('emi')) {
      return `Securing home loans is hassle-free with GMM Groups. We coordinate directly with major nationalized banks to ensure maximum loan LTV ratio and optimized interest brackets (roughly starting at 8.4% to 8.75% current floating rate).\n\n Our **Financial Guidance and Consultation is free of charge** for active GMM property buyers. We handle everything from parsing credit reports to drafting bank-specific affidavits.`;
    }

    // 5. Match general properties overview
    if (q.includes('properties') || q.includes('stock') || q.includes('buy') || q.includes('listings')) {
      const published = properties.filter(p => p.status === 'Published');
      const listStr = published.map(p => `&bull; **${p.title}** (${p.category} in ${p.city}, priced around ₹${p.price >= 10000000 ? `${(p.price/10000000).toFixed(1)} Cr` : `${(p.price/100000).toFixed(1)}L`})`).join('\n');
      return `GMM Groups has **${published.length} highly exclusive properties** published in India's leading metro zones. Here is our primary focus stock:\n\n${listStr}\n\nAll of these undergo clear-title verifications and have active 3D virtual drafts on site. Let me know which of these aligns with your budget!`;
    }

    // 6. General fallback combining system prompt directive instructions
    return `Greetings! Under the "GMM Groups & Services" umbrella, I can consult on property purchase deals, deed records, RERA rules, or mortgage evaluations.\n\nIf you have a quick inquiry regarding Worli Sea Face villas, MG Road commercial offices, or Title registry services, feel free to ask! Alternatively, reach out to our Lower Parel headquarters team directly at +91 98765 43210.`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* LEFT: SYSTEM PROMPT CONFIG (7 cols) */}
      <div className="lg:col-span-7 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            AI Advisor Text
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dictate the tone, knowledge limits, and visual welcoming scripts powering GMM's automated assistant widget.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Header Banners Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 block font-sans">Advisor Widget Main Name</label>
              <input
                type="text"
                value={tempConfig.bannerTitle}
                onChange={(e) => setTempConfig({ ...tempConfig, bannerTitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 block">Sub-header advice slogan</label>
              <input
                type="text"
                value={tempConfig.bannerSubtitle}
                onChange={(e) => setTempConfig({ ...tempConfig, bannerSubtitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Chat Initial Welcome Message */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 block">Initial Greeting Message (Welcome Statement)</label>
            <input
              type="text"
              value={tempConfig.welcomeMessage}
              onChange={(e) => setTempConfig({ ...tempConfig, welcomeMessage: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          {/* Master System Prompt */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-zinc-400 block">Master System Prompt (LLM Instruction block)</label>
              <span className="text-[10px] text-zinc-555 font-mono text-zinc-500">Injected into LLM context</span>
            </div>
            <textarea
              rows={8}
              value={tempConfig.systemPrompt}
              onChange={(e) => setTempConfig({ ...tempConfig, systemPrompt: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl p-3 text-xs focus:ring-1 focus:ring-emerald-500 leading-relaxed font-mono"
            />
          </div>

          {/* Suggestive Questions Pills List */}
          <div className="space-y-3 pt-2">
            <label className="text-xs text-zinc-400 block font-sans">Suggested Question Quick Pills (Max 6)</label>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Find villas in Mumbai..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim() || tempConfig.suggestedQuestions.length >= 6}
                className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 text-xs px-3.5 py-1.5 rounded-xl font-semibold transition active:scale-95 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Pill
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tempConfig.suggestedQuestions.map((q, idx) => (
                <div 
                  key={idx} 
                  className="bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-lg text-[10px] text-zinc-300 flex items-center gap-1.5"
                >
                  <span className="truncate max-w-[190px]">{q}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(idx)}
                    className="text-zinc-650 hover:text-rose-400 transition shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save panel Button */}
          <div className="pt-4 border-t border-zinc-900 flex justify-end">
            <button
              id="save-ai-advisor-config-btn"
              onClick={handleSaveConfig}
              className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save AI Advisor Config
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT: SMART DEVICE PLAYGROUND WIDGET SIMULATOR (5 cols) */}
      <div className="lg:col-span-5 flex flex-col items-center">
        
        {/* Device frame casing */}
        <div className="w-full max-w-[360px] bg-zinc-950 border-4 border-zinc-800 rounded-[36px] overflow-hidden shadow-2xl flex flex-col h-[580px] relative ring-1 ring-zinc-100/10">
          
          {/* Smartphone Speaker Grill & Camera cutout */}
          <div className="h-5 bg-zinc-950 w-full flex justify-center items-center relative z-20 shrink-0">
            <div className="w-16 h-3 bg-zinc-900 rounded-full" />
          </div>

          {/* Chat header area */}
          <div className="bg-zinc-900 px-4 py-3.5 border-b border-zinc-850 flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center relative">
              <Bot className="w-4 h-4 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-zinc-900 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight truncate">{tempConfig.bannerTitle}</p>
              <p className="text-[9px] text-zinc-400 italic truncate">{tempConfig.bannerSubtitle}</p>
            </div>
          </div>

          {/* Message Area Screen */}
          <div className="flex-1 bg-zinc-950 overflow-y-auto p-3 space-y-3 flex flex-col">
            {chatHistory.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                  msg.sender === 'bot' ? 'bg-emerald-700/20 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {msg.sender === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble text content */}
                <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-sm font-medium' 
                    : 'bg-zinc-900 text-zinc-100 rounded-tl-sm border border-zinc-850/60'
                }`}>
                  <span className="whitespace-pre-line">{msg.text}</span>
                  <span className="text-[8px] text-zinc-500 block text-right mt-1 font-mono">
                    {msg.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated AI is typing helper bubble */}
            {isTyping && (
              <div className="flex gap-2 max-w-[80%] self-start">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-400 shrink-0 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-2.5 bg-zinc-900 border border-zinc-850 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Suggested Quick Question pills list strictly pinned at footer */}
          {chatHistory.length <= 4 && (
            <div className="bg-zinc-950 p-2 border-t border-zinc-900 shrink-0 space-y-1">
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono font-bold pl-1 block">SUGGESTED CHECKS:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {tempConfig.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-[9px] bg-zinc-900 border border-zinc-850/70 hover:bg-zinc-800 text-emerald-400 hover:text-white px-2 py-1.5 rounded-lg shrink-0 max-w-[180px] truncate transition duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input controls */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-850 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (userInput.trim() && !isTyping) {
                  handleSendMessage(userInput);
                }
              }}
              className="flex gap-1.5"
            >
              <input
                id="smartphone-text-input"
                type="text"
                disabled={isTyping}
                placeholder="Ask about properties or registry..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <button
                id="smartphone-send-btn"
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2 rounded-xl transition shrink-0 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-white" />
              </button>
            </form>
          </div>

        </div>

        {/* Small informational caption */}
        <p className="text-[10px] text-zinc-500 text-center max-w-[260px] leading-relaxed mt-3 italic font-sans flex items-center gap-1 justify-center">
          <HelpCircle className="w-3 h-3 text-zinc-500" />
          Playground simulates model replies based on prompt metrics above.
        </p>
      </div>

    </div>
  );
}
