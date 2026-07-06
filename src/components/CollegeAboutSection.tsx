import { useState } from "react";
import { BookOpen, Trophy, Target, Building, Sparkles, GraduationCap, MapPin, Award } from "lucide-react";
import srecLogo from "@/assets/srec-logo.png";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  { 
    id: "campus", 
    icon: Building, 
    title: "Established Campus", 
    desc: "A lush 45-acre green campus equipped with state-of-the-art infrastructure, a massive central library, and high-tech modern laboratories.", 
    stat: "45 Acres",
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/10 border-emerald-100 bg-emerald-50 text-emerald-600"
  },
  { 
    id: "vision", 
    icon: Target, 
    title: "Visionary Goals", 
    desc: "Committed to producing world-class engineers through quality education, applied research, and an industry-oriented curriculum bridging the technology gap.", 
    stat: "Global Standards",
    color: "from-blue-600 to-indigo-600",
    glow: "shadow-blue-500/10 border-blue-100 bg-blue-50 text-blue-600"
  },
  { 
    id: "academic", 
    icon: BookOpen, 
    title: "Academic Excellence", 
    desc: "Offering a wide range of NBA accredited undergraduate and postgraduate programs across advanced engineering disciplines.", 
    stat: "15+ Programs",
    color: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/10 border-purple-100 bg-purple-50 text-purple-600"
  },
  { 
    id: "awards", 
    icon: Trophy, 
    title: "Awards & Recognition", 
    desc: "Consistent top-tier national ranks for exceptional academic performance, robust placements, and cutting-edge research grants.", 
    stat: "Top Rankings",
    color: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/10 border-amber-100 bg-amber-50 text-amber-600"
  },
];

const CollegeAboutSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>("campus");
  const activeFeature = features.find(f => f.id === hoveredFeature) || features[0];

  return (
    <section id="college" className="py-16 md:py-24 relative overflow-hidden bg-slate-50/50">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white -skew-x-12 translate-x-32 -z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-4 shadow-sm">
              <GraduationCap size={14} className="animate-pulse" />
              <span>Our Institution</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Sri Ramakrishna <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-serif">Engineering College</span>
            </h2>
          </div>
          <div className="max-w-md text-slate-500 leading-relaxed text-sm md:text-base lg:text-right lg:pb-2">
            Established in 1994 by the <span className="font-bold text-slate-800">SNR Sons Charitable Trust</span>. SREC has grown into an eminent institution of international standards, empowering technical innovators.
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Spotlight Showcase (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-stretch">
            <div className="relative aspect-square bg-white rounded-3xl border border-slate-250/50 shadow-lg p-8 flex flex-col justify-between overflow-hidden group text-center min-h-[420px]">
              
              {/* Dynamic glowing ambient backing */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />
              
              {/* Dynamic matching backdrop gradient tint on active selection */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activeFeature.color} opacity-[0.03] transition-all duration-700 pointer-events-none`} />

              <div className="relative mx-auto my-auto flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-8"
                >
                  <img 
                    src={srecLogo} 
                    alt="SREC Emblem" 
                    className="h-32 md:h-40 object-contain drop-shadow-md relative z-10" 
                  />
                </motion.div>
                
                <div className="h-24 w-full flex items-center justify-center relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeFeature.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeFeature.color} font-serif font-black tracking-tight text-3xl md:text-4xl filter saturate-150`}>
                        {activeFeature.stat}
                      </span>
                      <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mt-2.5 flex items-center gap-1.5">
                        <Sparkles size={10} className="fill-blue-500 text-blue-500 animate-spin-slow" /> {activeFeature.title}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Decorative coordinates tag */}
              <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <MapPin size={12} className="text-slate-350" /> Coimbatore, TN, India
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Detail Stack (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-left">
            {features.map((f) => {
              const isHovered = hoveredFeature === f.id;
              const Icon = f.icon;

              return (
                <div 
                  key={f.id}
                  onMouseEnter={() => setHoveredFeature(f.id)}
                  onClick={() => setHoveredFeature(f.id)}
                  className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ease-out cursor-pointer flex gap-6 relative overflow-hidden ${
                    isHovered 
                      ? 'bg-white shadow-md border-slate-150 scale-[1.01] translate-x-1' 
                      : 'bg-transparent border-slate-200/60 hover:bg-white/40'
                  }`}
                >
                  {/* Left border neon stripe on hover */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b ${f.color} transition-transform duration-300 ${
                    isHovered ? 'scale-y-100' : 'scale-y-0'
                  }`} />

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isHovered ? f.glow + ' shadow-md scale-105' : 'bg-slate-100 text-slate-500 border-slate-200/50'
                  }`}>
                    <Icon size={22} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      isHovered ? 'text-blue-650' : 'text-slate-800'
                    }`}>
                      {f.title}
                    </h3>
                    <p className={`text-xs md:text-sm leading-relaxed transition-all duration-300 ${
                      isHovered ? 'text-slate-650' : 'text-slate-500'
                    }`}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default CollegeAboutSection;
