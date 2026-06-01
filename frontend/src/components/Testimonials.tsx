import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const activeTestimonial = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-950/65">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-500/10 border border-teal-500/10 px-2.5 py-1 rounded-full block w-fit mx-auto mb-3 font-outfit">
            Buyer Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
            Endorsed By <span className="text-gradient">India's Business Pioneers</span>
          </h2>
        </div>

        {/* Carousel Framework */}
        <div className="relative bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Accent quotes icon */}
          <div className="absolute -top-6 -left-6 text-teal-500/5 pointer-events-none">
            <Quote className="w-48 h-48" />
          </div>

          <div className="relative z-10 space-y-6 flex flex-col justify-between min-h-[220px]">
            
            {/* Quote body */}
            <blockquote className="text-sm sm:text-base text-gray-300 leading-relaxed font-light italic">
              "{activeTestimonial.quote}"
            </blockquote>

            {/* Profile Avatar and Name */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-3.5">
                <img
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/20"
                />
                <div>
                  <h4 className="text-white text-sm font-semibold tracking-wide">
                    {activeTestimonial.name}
                  </h4>
                  <p className="text-[10px] text-teal-400 font-medium font-outfit uppercase tracking-widest mt-0.5">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>

              {/* Navigation button arrays */}
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-gray-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-gray-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Pagination Dots Indicator */}
        <div className="flex justify-center items-center gap-1.5 mt-6">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                activeIndex === idx ? "bg-teal-400 w-4" : "bg-gray-400/20"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
