import { useState, useEffect } from "react";
import { X, Menu, Network } from "lucide-react";
import ieeeLogo from "@/assets/ieee-logo.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const MotionLink = motion(Link);

const navLinks = [
   { label: "Home", href: "/" },
   { label: "About", href: "/about" },
   { label: "Societies", href: "/societies" },
   { label: "Activities", href: "/activities" },
   { label: "Team", href: "/team" },
   { label: "Awards", href: "/awards" },
   { label: "Plans", href: "/annual-plans" },
   { label: "Gallery", href: "/gallery" },
   { label: "ICAECTSD 2027", href: "https://icaectsd-dahz.vercel.app/" },
   { label: "Funding", href: "/funding" },
   { label: "Contact", href: "/contact" },
   { label: "Admin", href: "/admin" },

];

const Navbar = () => {
   const [open, setOpen] = useState(false);
   const location = useLocation();
   const isHomePage = location.pathname === "/";

   // True if user physically scrolled down
   const [hasScrolled, setHasScrolled] = useState(false);

   useEffect(() => {
      const onScroll = () => {
         setHasScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", onScroll);
      onScroll(); // initialize correct state
      return () => window.removeEventListener("scroll", onScroll);
   }, []);

   // The user requested the navbar to be completely white edge-to-edge at all times.
   const isSolidBackground = true;

   // Logos hide ONLY when user specifically scrolls down (on any page)
   const hideLogos = hasScrolled;

   return (
      <>
         {/* Top Navbar */}
         <nav className="fixed top-0 left-0 w-full z-50 flex flex-col items-center">

            <div className="w-full flex flex-col items-center justify-center">

               {/* Top Row: Logos with ultra-smooth cinematic hide animation - Glassmorphism Background - Edge-to-Edge */}
               <motion.div
                  initial={false}
                  animate={{
                     height: hideLogos ? 0 : "auto",
                     opacity: hideLogos ? 0 : 1,
                     scale: hideLogos ? 0.95 : 1
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-white/70 backdrop-blur-xl border-b border-white/30 origin-top relative z-50 overflow-hidden shadow-md"
               >
                  <div className="w-full px-3 sm:px-8 xl:px-12">
                     <div className="relative flex flex-row justify-center xl:justify-between items-center w-full py-2.5 sm:py-3.5 lg:py-4 gap-2 sm:gap-6 xl:gap-0">
                        <div className="flex justify-center items-center">
                           <img src={srecLogo} alt="SREC" className="h-[38px] sm:h-[55px] md:h-[65px] lg:h-[75px] xl:h-[80px] w-auto object-contain flex-shrink-0" />
                        </div>
                        <div className="flex justify-center items-center xl:absolute xl:left-1/2 xl:-translate-x-1/2">
                           <img src={ieeeLogo} alt="IEEE" className="h-[38px] sm:h-[55px] md:h-[65px] lg:h-[75px] xl:h-[80px] w-auto object-contain flex-shrink-0" />
                        </div>
                        <div className="flex justify-center items-center">
                           <img src={snrLogo} alt="SNR Trust" className="h-[38px] sm:h-[55px] md:h-[65px] lg:h-[75px] xl:h-[80px] w-auto object-contain flex-shrink-0" />
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Mobile Hamburger Icon & Sitemap (Aligned at ends below logos on mobile/tablet) */}
               <div className="xl:hidden flex justify-between items-center w-full px-6 sm:px-12 mt-3 z-[70]">
                  <button
                     onClick={() => setOpen(true)}
                     className="p-2.5 rounded-full transition-all shadow-md bg-[#002855] text-white hover:bg-blue-600 active:scale-95"
                  >
                     <Menu size={20} className="md:w-6 md:h-6" />
                  </button>
                  <a
                     href="https://www.ieee.org/sitemap.html"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="p-2.5 rounded-full transition-all shadow-md bg-[#002855] text-white hover:bg-blue-650 active:scale-95 flex items-center justify-center"
                     title="IEEE Sitemap"
                  >
                     <Network size={20} className="md:w-6 md:h-6" />
                  </a>
               </div>

               {/* Bottom Row: Desktop Horizontal Nav Links - Glassmorphism Dark Blue Cylinder/Pill */}
               <div className="hidden xl:flex items-center justify-center gap-x-6 xl:gap-x-8 gap-y-2 w-fit mx-auto mt-4 backdrop-blur-2xl border py-3.5 px-8 xl:px-10 rounded-full relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(0, 40, 85, 0.85) 0%, rgba(0, 24, 60, 0.75) 100%)", borderColor: "rgba(147, 197, 253, 0.25)", boxShadow: "0 8px 32px rgba(0, 40, 85, 0.3), 0 2px 8px rgba(0, 24, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)" }}>
                  {navLinks.map((l, index) => {
                     const isExternal = l.href.startsWith("http://") || l.href.startsWith("https://");
                     return isExternal ? (
                        <motion.a
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 1.2, delay: 0.2 + (index * 0.05), ease: [0.16, 1, 0.3, 1] }}
                           key={l.label}
                           href={l.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-white/95 hover:text-white font-bold tracking-[0.11em] xl:tracking-[0.13em] text-[15.5px] uppercase transition-all duration-550 relative group"
                        >
                           {l.label}
                           <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-555 group-hover:w-full bg-white"></span>
                        </motion.a>
                     ) : (
                        <MotionLink
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 1.2, delay: 0.2 + (index * 0.05), ease: [0.16, 1, 0.3, 1] }}
                           key={l.label}
                           to={l.href}
                           className="text-white/95 hover:text-white font-bold tracking-[0.11em] xl:tracking-[0.13em] text-[15.5px] uppercase transition-all duration-555 relative group"
                        >
                           {l.label}
                           <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-555 group-hover:w-full bg-white"></span>
                        </MotionLink>
                     );
                  })}
                  <motion.a
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 1.2, delay: 0.2 + (navLinks.length * 0.05), ease: [0.16, 1, 0.3, 1] }}
                     href="https://vtools.vtools.ieee.org/" target="_blank"
                     className="text-white/95 hover:text-white font-bold tracking-[0.11em] xl:tracking-[0.13em] text-[15.5px] uppercase transition-all duration-555 relative group mr-1"
                  >
                     VTOOLS
                     <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-555 group-hover:w-full bg-white"></span>
                  </motion.a>
                  <motion.a
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 1.2, delay: 0.2 + ((navLinks.length + 1) * 0.05), ease: [0.16, 1, 0.3, 1] }}
                     href="https://www.ieee.org/sitemap.html" target="_blank"
                     rel="noopener noreferrer"
                     className="text-white/80 hover:text-white transition-colors duration-300 ml-1 flex items-center justify-center"
                     title="IEEE Sitemap"
                  >
                     <Network size={18} className="hover:scale-110 transition-transform" />
                  </motion.a>
               </div>

            </div>
         </nav>

         {/* Global Transparent Spacer for Subpages to prevent content clipping under the tall fixed navbar */}
         {!isHomePage && (
            <div className="h-[140px] sm:h-[160px] md:h-[180px] xl:h-[220px] w-full bg-transparent pointer-events-none" aria-hidden="true"></div>
         )}

         {/* Mobile Sidebar/Dropdown Menu */}
         <AnimatePresence>
            {open && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-0 z-[100] bg-[#002855]/90 backdrop-blur-3xl w-full h-screen overflow-y-auto"
               >
                  <div className="absolute top-8 right-8">
                     <button onClick={() => setOpen(false)} className="p-3 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all">
                        <X size={32} />
                     </button>
                  </div>
                  <div className="flex flex-col items-center justify-center min-h-screen py-20 space-y-6">
                     {navLinks.map((l, idx) => {
                        const isExternal = l.href.startsWith("http://") || l.href.startsWith("https://");
                        return isExternal ? (
                           <motion.a
                              key={l.label}
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 + (idx * 0.05) }}
                              onClick={() => setOpen(false)}
                              className="text-white/80 text-xl tracking-[0.3em] uppercase font-semibold hover:text-blue-200 transition-colors"
                           >
                              {l.label}
                           </motion.a>
                        ) : (
                           <MotionLink
                              key={l.label}
                              to={l.href}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 + (idx * 0.05) }}
                              onClick={() => setOpen(false)}
                              className="text-white/80 text-xl tracking-[0.3em] uppercase font-semibold hover:text-blue-200 transition-colors"
                           >
                              {l.label}
                           </MotionLink>
                        );
                     })}
                     <motion.a
                        href="https://vtools.vtools.ieee.org/" target="_blank"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + (navLinks.length * 0.05) }}
                        onClick={() => setOpen(false)}
                        className="text-white/80 text-xl tracking-[0.3em] uppercase font-semibold hover:text-blue-200 transition-colors"
                     >
                        VTOOLS
                     </motion.a>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Floating Back to Home Button globally visible across all pages except landing page */}
         {!isHomePage && (
            <Link
               to="/"
               className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[40] bg-black text-white p-4 rounded-full shadow-2xl flex flex-col items-center justify-center gap-1 hover:bg-slate-900 transition-all duration-500 group w-12 h-12 md:w-14 md:h-14 border border-white/20"
               title="Back to Home"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform duration-500">
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
               </svg>
            </Link>
         )}
      </>
   )
};

export default Navbar;