import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Calendar, Trophy } from "lucide-react";
import img1 from "@/assets/IMG20251015134912.jpg";
import { usePageContent } from "@/hooks/useContent";

const images = [img1];

const HeroSection = () => {
   const [currentIndex, setCurrentIndex] = useState(0);
   const { data: content } = usePageContent("landing");

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentIndex((prev) => (prev + 1));
      }, 6000); // 6 seconds per slide
      return () => clearInterval(interval);
   }, []);

   return (
      <section id="home" className="relative w-full h-[100svh] flex flex-col justify-center overflow-hidden bg-black selection:bg-white selection:text-black">

         {/* Background Image Carousel Layer with Butter-Smooth Fade */}
         <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <AnimatePresence mode="popLayout">
               <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1.5 } }}
                  transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${images[currentIndex % images.length]})` }}
               />
            </AnimatePresence>
            {/* Subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/85 z-10 pointer-events-none"></div>
         </div>

         {/* Text and Interactive Panel on top Layer with Orchestrated Cascading Reveal */}
         <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col xl:flex-row items-center justify-between text-center xl:text-left h-full pt-32 sm:pt-40 xl:pt-52 gap-12">

            {/* Left Column: Heading and Description */}
            <div className="flex flex-col items-center xl:items-start text-center xl:text-left xl:w-[58%] justify-center">
               <motion.div
                  initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 flex space-x-4 items-center justify-center xl:justify-start"
               >
                  <span className="text-white/80 text-xs md:text-sm uppercase tracking-[0.5em] md:tracking-[0.8em] font-medium">SREC Student Branch</span>
               </motion.div>

               <div className="overflow-hidden mb-6">
                  <motion.h1
                     initial={{ y: "100%", opacity: 0 }}
                     animate={{ y: "0%", opacity: 1 }}
                     transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                     className="text-5xl md:text-7xl lg:text-[8rem] font-serif text-white tracking-tight leading-tight md:leading-[0.9] drop-shadow-lg"
                  >
                     {content?.hero_title || "Global Excellence"}<motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
                        className="italic text-blue-400"
                     >.</motion.span>
                  </motion.h1>
               </div>

               <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[1px] w-24 md:w-40 bg-gradient-to-r from-blue-400 to-transparent my-6 origin-left"
               />

               <div className="overflow-hidden max-w-2xl mb-8">
                  <motion.p
                     initial={{ y: "100%", opacity: 0 }}
                     animate={{ y: "0%", opacity: 1 }}
                     transition={{ duration: 1.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                     className="text-white/80 text-sm md:text-md lg:text-lg font-light uppercase tracking-[0.1em] md:tracking-[0.15em] leading-relaxed md:leading-loose"
                  >
                     {content?.hero_desc || "Empowering minds and shaping the future through uncompromising technology research."}
                  </motion.p>
               </div>

               {/* Action Buttons */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
               >
                  <a href="/about" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-sm tracking-widest uppercase hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 group active:scale-95 w-full sm:w-auto justify-center">
                     Explore Branch
                     <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/contact" className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-2 backdrop-blur-md active:scale-95 w-full sm:w-auto justify-center">
                     Join IEEE
                  </a>
               </motion.div>
            </div>

            {/* Right Column: Floating Interactive Glass Dashboard (Visible on desktop) */}
            <motion.div
               initial={{ opacity: 0, x: 50, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="hidden xl:flex flex-col xl:w-[35%] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
            >
               {/* Glowing background blob behind card */}
               <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700 pointer-events-none" />
               <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700 pointer-events-none" />

               <div className="relative z-10 flex flex-col gap-6">
                  <div className="text-left">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-xs tracking-wider uppercase border border-blue-500/30 mb-3">
                        <Sparkles size={12} className="animate-pulse" />
                        Explore. Experiment. Evolve.
                     </span>
                     <h3 className="text-2xl font-serif font-bold text-white tracking-tight">IEEE SREC Portal</h3>
                     <p className="text-white/60 text-xs mt-1">College Code: 41347756 | Branch: 61491</p>
                  </div>

                  <div className="h-[1px] w-full bg-white/15" />

                  <div className="flex flex-col gap-3 text-left">
                     <a href="/societies" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300 group-hover/item:scale-105 transition-transform">
                              <Compass size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-white">Technical Societies</p>
                              <p className="text-xs text-white/50">12+ Special Interest Groups</p>
                           </div>
                        </div>
                        <ArrowRight size={16} className="text-white/40 group-hover/item:translate-x-1 group-hover/item:text-white transition-all" />
                     </a>

                     <a href="/activities" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 group-hover/item:scale-105 transition-transform">
                              <Calendar size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-white">Branch Activities</p>
                              <p className="text-xs text-white/50">Workshops, Hackathons & Seminars</p>
                           </div>
                        </div>
                        <ArrowRight size={16} className="text-white/40 group-hover/item:translate-x-1 group-hover/item:text-white transition-all" />
                     </a>

                     <a href="/awards" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/item">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 group-hover/item:scale-105 transition-transform">
                              <Trophy size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-white">Achievements & Awards</p>
                              <p className="text-xs text-white/50">Recognitions & Benchmarks</p>
                           </div>
                        </div>
                        <ArrowRight size={16} className="text-white/40 group-hover/item:translate-x-1 group-hover/item:text-white transition-all" />
                     </a>
                  </div>
               </div>
            </motion.div>

         </div>

      </section>
   );
};

export default HeroSection;
