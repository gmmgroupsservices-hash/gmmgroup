import React, { useState } from "react";
import { Play, Pause, Video, Eye, Award } from "lucide-react";
import { REELS } from "../data";

export default function VideoReels() {
  const [playingReelId, setPlayingReelId] = useState<string | null>(null);

  const togglePlayReel = (id: string) => {
    if (playingReelId === id) {
      setPlayingReelId(null);
    } else {
      setPlayingReelId(id);
    }
  };

  return (
    <section id="reels" className="py-24 relative overflow-hidden bg-slate-950">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[300px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Heading */}
        <div className="text-center max-w-3xl mx-auto border-b border-white/5 pb-12 mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 px-3 py-1 bg-teal-500/10 rounded-full border border-teal-500/10 block w-fit mx-auto mb-4 font-outfit">
            Cinematic Walkthroughs
          </span>
          <h2 className="text-3xl sm:text-4xl text-white font-display font-medium">
            GMM <span className="text-gradient">Sovereign Video Reels</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-2 max-w-xl mx-auto leading-relaxed">
            Take an instant, vertical immersive journey across selected landmark penthouses and private estates. Click to play.
          </p>
        </div>

        {/* Vertical reels listing layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-4xl mx-auto">
          {REELS.map((reel) => {
            const isPlaying = playingReelId === reel.id;

            return (
              <div 
                key={reel.id} 
                className="relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group aspect-[9/16] max-w-[280px] mx-auto w-full transition-all duration-500 hover:scale-101 hover:border-teal-500/30"
              >
                
                {/* 1. Backdrop Video Elements */}
                {isPlaying ? (
                  <video
                    src={reel.videoUrl}
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    onClick={() => togglePlayReel(reel.id)}
                  />
                ) : (
                  <div className="absolute inset-0 z-0">
                    {/* Generates high-res corresponding image block */}
                    <img
                      src={
                        reel.id === "reel-1" ? "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=400" :
                        reel.id === "reel-2" ? "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=400" :
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={reel.title}
                      className="w-full h-full object-cover transition-opacity duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-black/30" />
                  </div>
                )}

                {/* 2. Top Header Metadata */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[9px] uppercase tracking-wider bg-black/60 backdrop-blur-sm text-teal-300 font-bold px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 font-outfit">
                    <Video className="w-3 h-3 text-teal-400" />
                    <span>Live Reel Walkthrough</span>
                  </span>
                  
                  <span className="text-[9px] font-mono bg-black/60 backdrop-blur-sm text-gray-300 px-2.5 py-0.5 rounded-full border border-white/10 font-bold">
                    {reel.duration}
                  </span>
                </div>

                {/* 3. Central Trigger Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayReel(reel.id);
                    }}
                    className={`pointer-events-auto w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
                      isPlaying ? "opacity-0 group-hover:opacity-100 bg-black/60 text-white" : "opacity-100"
                    }`}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-slate-950 text-slate-950" />}
                  </button>
                </div>

                {/* 4. Bottom context descriptor */}
                <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pt-12 z-10 space-y-1.5 leading-normal pointer-events-none">
                  <h4 className="text-white text-xs font-bold font-display line-clamp-1">
                    {reel.title}
                  </h4>
                  <p className="text-[10px] text-gray-300 font-light line-clamp-2">
                    {reel.description}
                  </p>
                  
                  <div className="flex items-center space-x-1.5 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] text-teal-300 uppercase tracking-widest font-outfit font-bold">
                      GMM EXCLUSIVE PROPERTY VIEW
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
