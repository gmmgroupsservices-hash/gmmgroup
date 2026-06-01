import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { FAQS } from "../data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-gray-950">
      
      {/* Glow Ambience */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-500/10 border border-teal-500/10 px-2.5 py-1 rounded-full block w-fit mx-auto mb-3 font-outfit">
            Statutory FAQ Panel
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
            Answers Regarding <span className="text-gradient">Transaction Security</span>
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Understand how our legal escrow matrix, title diligence, and AI matchmaking protect luxury assets.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {/* Header button triggers */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none focus:bg-white/[0.01]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <HelpCircle className="w-5 h-5 text-teal-400 flex-shrink-0 animate-pulse" />
                    <span className="text-white text-xs sm:text-sm font-semibold tracking-wide truncate sm:whitespace-normal leading-relaxed">
                      {faq.question}
                    </span>
                  </div>
                  
                  <span className="p-1 rounded-lg bg-white/5 text-gray-400 select-none">
                    {isOpen ? <Minus className="w-4.5 h-4.5 text-teal-300" /> : <Plus className="w-4.5 h-4.5" />}
                  </span>
                </button>

                {/* Animated expandable content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-white/5 bg-slate-950/20 text-xs text-gray-400 leading-relaxed font-light animate-fade-in-down">
                    {faq.answer}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
