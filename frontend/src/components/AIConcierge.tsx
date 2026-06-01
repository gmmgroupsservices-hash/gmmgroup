import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Sparkles, Send, Bot, User, ArrowRight, Eye, RefreshCw } from "lucide-react";
import { ChatMessage, Property } from "../types";

interface AIConciergeProps {
  onQuickViewProperty: (property: Property) => void;
}

export default function AIConcierge({ onQuickViewProperty }: AIConciergeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-message",
      role: "model",
      text: "Greetings. I am GMM's Property Advisor. I have scrutinized all RERA certificates, pricing variables, and location assets in our database. Tell me, what capital objectives or premium architectural aesthetic are you searching for today? (e.g. 4BHK Jubilee Hills luxury villa, beachfront plot in Vizag, or Whitefield penthouses)",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: inputVal,
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputVal("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, text: m.text }))
        })
      });

      if (!res.ok) throw new Error("Cognitive link interrupted");

      const responseData = await res.json();
      setMessages((prev) => [...prev, responseData]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          text: "My cognitive systems are momentarily analyzing our private escrow legal deeds. Please resend your inquiry or contact our representatives directly.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInputVal(q);
  };

  return (
    <section id="ai-advisor" className="py-20 relative overflow-hidden bg-gray-950">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl border-b border-white/5 pb-12 mb-16 mx-auto">
          <span className="text-[10px] uppercase bg-teal-400/10 px-3 py-1 rounded-full text-teal-300 font-bold tracking-widest block w-fit mx-auto border border-teal-500/10 mb-4 font-outfit">
            Next-Gen AI Core Grounding
          </span>
          <h2 className="text-3xl sm:text-4xl text-white font-display font-bold leading-normal">
            Consult the GMM <span className="text-gradient">Property Advisor</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-xl mx-auto mt-2">
            Ask our intelligent system regarding RERA approval details, dynamic pricing comparisons, and matching villa architectures. Chat in real-time.
          </p>
        </div>

        {/* Dynamic Multi-column chat setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Column A: Prompt Guidelines and suggestions (Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            
            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4 flex-grow flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-teal-300">
                <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
                <h3 className="font-display font-semibold text-sm">Advisor Guidelines</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Our elite advisor chatbot searches, matches, and appraises our active portfolio from Whitefield, Jubilee Hills, and coastal Vizag. Try clicking one of our pre-analyzed suggestions below:
              </p>

              {/* Instant Suggestions */}
              <div className="space-y-2.5 pt-2">
                {[
                  "4BHK luxury villa in Jubilee Hills Hyderabad",
                  "I want penthouses in Whitefield Bangalore",
                  "What plots do you have under 4 Crore in Vizag?",
                  "Show me properties with high rental yield"
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/20 text-[11px] text-gray-300 hover:text-white transition-all hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3 h-3 text-teal-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950/20 border border-white/5 p-4 rounded-xl text-center">
              <p className="text-[10px] text-gray-400">
                Powered by <span className="text-teal-300 font-bold">Gemini 3.5 Flash Model</span>. Security escrowed context validated on 2026 registry feeds.
              </p>
            </div>
          </div>

          {/* Column B: Active Glass Chat Workspace (Span 8) */}
          <div className="lg:col-span-8 flex flex-col justify-between glass-panel rounded-2xl border border-white/10 shadow-2xl h-[470px] relative overflow-hidden">
            
            {/* Chat header banner */}
            <div className="absolute top-0 left-0 w-full bg-slate-950/80 border-b border-white/5 px-4 py-3 flex items-center justify-between z-10 font-outfit">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="text-xs text-white font-semibold">GMM Advisor Core Node</h4>
                  <p className="text-[9px] text-gray-400 tracking-wide">CONFIDENTIAL COGNITIVE CHAT</p>
                </div>
              </div>
              <div className="bg-teal-500/10 px-2.5 py-0.5 rounded-full text-[9px] text-teal-300 border border-teal-500/10">
                Grounded Ledger Mode
              </div>
            </div>

            {/* Chat message list area */}
            <div className="flex-grow overflow-y-auto p-4 pt-16 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                >
                  {m.role === "model" && (
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 mt-1 flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="space-y-1.5 max-w-[80%]">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-teal-blue text-white rounded-tr-none"
                          : "bg-slate-950/75 border border-white/5 text-gray-300 rounded-tl-none font-light"
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Appended structured recommendation widgets */}
                    {m.suggestedProperties && m.suggestedProperties.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {m.suggestedProperties.map((prop) => (
                          <div
                            key={prop.id}
                            className="bg-slate-900 rounded-xl p-2.5 border border-white/15 flex items-center justify-between shadow-lg"
                          >
                            <div className="min-w-0 flex-grow pr-2">
                              <p className="text-[10px] text-teal-300 font-bold truncate">{prop.title}</p>
                              <p className="text-[9px] text-gray-400 truncate">{prop.location}</p>
                              <p className="text-xs text-white font-semibold mt-0.5">{prop.price}</p>
                            </div>
                            <button
                              onClick={() => onQuickViewProperty(prop)}
                              className="p-1 px-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-[9px] font-bold flex items-center space-x-0.5 flex-shrink-0 cursor-pointer"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              <span>Inspect</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-gray-300 mt-1 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-slate-950/75 border border-white/5 p-3.5 rounded-2xl rounded-tl-none text-xs text-gray-400 flex items-center space-x-1.5 font-light">
                    <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                    <span>Analyzing real estate deeds and calculating returns...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/90 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask GMM Advisor... (e.g. recommend villas in Jubilee Hills)"
                className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-teal-blue text-white hover:scale-103 cursor-pointer flex-shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
