import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CalendarRange, Trophy, Globe2, Users, Rocket, Sparkles, BookOpen, Award, ShieldCheck, Target, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { usePageContent } from "@/hooks/useContent";
import journeyImage from "@/assets/IMG20251015144015.jpg";

const milestones = [
  {
    year: "2001",
    title: "Inception of IEEE SREC",
    description: "The IEEE Student Branch of Sri Ramakrishna Engineering College was officially inaugurated on June 11th, 2001, setting the foundation for technical excellence.",
    icon: Rocket,
    color: "from-blue-500 to-indigo-600"
  },
  {
    year: "2008",
    title: "Branch Expansion",
    description: "Launched specialized technical societies including the Computer Society and Power & Energy Society to cater to diverse engineering disciplines.",
    icon: Globe2,
    color: "from-emerald-400 to-teal-500"
  },
  {
    year: "2015",
    title: "Global Recognition",
    description: "Awarded continuous outstanding student branch rebates from IEEE Headquarters, New York, recognizing the massive scale of events conducted.",
    icon: Award,
    color: "from-amber-400 to-orange-500"
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Successfully transitioned to virtual platforms, hosting massive online hackathons, ideathons, and webinars reaching a global audience during the pandemic.",
    icon: Sparkles,
    color: "from-purple-500 to-fuchsia-600"
  },
  {
    year: "2024",
    title: "Legacy of Excellence",
    description: "Surpassed 500+ active members and marked 23+ years of continuous operation, remaining one of the most active student branches under the IEEE Madras Section.",
    icon: Trophy,
    color: "from-rose-500 to-pink-600"
  }
];

const pillars = [
  {
    title: "Technical Excellence",
    desc: "We prioritize cutting-edge knowledge sharing through workshops, seminars, and technical symposia.",
    color: "from-blue-500 to-indigo-600",
    lightColor: "bg-blue-50/50 text-blue-600 border-blue-100",
    icon: BookOpen
  },
  {
    title: "Leadership & Growth",
    desc: "We build leaders by giving students complete autonomy to organize and execute large-scale initiatives.",
    color: "from-emerald-400 to-teal-500",
    lightColor: "bg-emerald-50/50 text-emerald-600 border-emerald-100",
    icon: Users
  },
  {
    title: "Global Collaboration",
    desc: "Through international conferences and contests, we bridge SREC and the global tech community.",
    color: "from-purple-500 to-fuchsia-600",
    lightColor: "bg-purple-50/50 text-purple-600 border-purple-100",
    icon: Globe2
  }
];

const AboutPage = () => {
  const { data: counselor } = useQuery<any>({
    queryKey: ["counselor_image"],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_bearers")
        .select("image_url, name")
        .eq("role", "Student Branch Counsellor")
        .eq("year", 2025)
        .maybeSingle();
      return data;
    }
  });

  const { data: principal } = useQuery<any>({
    queryKey: ["principal_info"],
    queryFn: async () => {
      const { data } = await supabase
        .from("senior_members")
        .select("image_url, name")
        .ilike("current_role", "%Principal%")
        .maybeSingle();
      return data;
    }
  });

  const { data: content } = usePageContent("about");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden font-sans">
      
      {/* High-tech ambient background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      
      {/* Dynamic blurred ambient blobs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-3/4 right-0 w-[600px] h-[600px] bg-gradient-to-l from-purple-300/10 to-pink-300/10 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 py-12 flex flex-col gap-16 md:gap-24">
        
         {/* SECTION 1: Intro & Counselor Message (Two Columns) */}
         <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
            <div className="lg:col-span-7">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-6 shadow-sm">
                  <Sparkles size={12} className="animate-pulse" />
                  Discover Our Legacy
               </span>
               <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                  About <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-serif"> SREC IEEE SB </span>
               </h1>
               <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                  {content?.intro_text || "The IEEE Student Branch of Sri Ramakrishna Engineering College, operating since June 11th, 2001 under the IEEE Madras Section, is a vibrant hub promoting continuous technical excellence and professional evolution."}
               </p>
            </div>

            <div className="lg:col-span-5 space-y-6">
               {/* Principal Message Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_60%)] pointer-events-none" />
                  <div className="relative z-10">
                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-xs tracking-widest uppercase mb-6 border border-indigo-500/20">
                       <Award size={12} className="animate-pulse" />
                       <span>Principal Message</span>
                     </span>
                     <p className="text-slate-100 text-sm italic font-serif leading-relaxed mb-6">
                       "{content?.principal_message || "Fostering innovation, research, and technical excellence to empower young minds to solve global challenges with ethical values and leadership."}"
                     </p>
                     
                     <div className="flex items-center gap-4">
                       {principal?.image_url ? (
                         <img 
                           src={principal.image_url} 
                           alt={principal.name || "Dr. A. Soundarrajan"} 
                           className="w-12 h-12 rounded-full object-cover shadow-md border border-white/10 shrink-0" 
                         />
                       ) : (
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-serif font-black text-lg shadow-md border border-white/10 shrink-0">
                           AS
                         </div>
                       )}
                       <div>
                         <h4 className="font-bold text-slate-100 text-sm font-serif">{principal?.name || "Dr. A. Soundarrajan"}</h4>
                         <p className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase">Principal, SREC</p>
                       </div>
                     </div>
                  </div>
               </motion.div>

               {/* Counselor Message Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,98,155,0.1),transparent_60%)] pointer-events-none" />
                  <div className="relative z-10">
                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-xs tracking-widest uppercase mb-6 border border-blue-500/20">
                       <Heart size={12} className="animate-pulse" />
                       <span>Counselor Message</span>
                     </span>
                     <p className="text-slate-100 text-sm italic font-serif leading-relaxed mb-6">
                       "{content?.counselor_message || "Empowering students to transcend boundaries and embrace the technological future with confidence, leadership, and ethical responsibility."}"
                     </p>
                     
                     <div className="flex items-center gap-4">
                       {counselor?.image_url ? (
                         <img 
                           src={counselor.image_url} 
                           alt={counselor.name || "Dr. K. Balamurugan"} 
                           className="w-12 h-12 rounded-full object-cover shadow-md border border-white/10 shrink-0" 
                         />
                       ) : (
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-serif font-black text-lg shadow-md border border-white/10 shrink-0">
                           KB
                         </div>
                       )}
                       <div>
                         <h4 className="font-bold text-slate-100 text-sm font-serif">{counselor?.name || "Dr. K. Balamurugan"}</h4>
                         <p className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase">Branch Counselor, IEEE SREC</p>
                       </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* SECTION 2: Historic Timeline (Two Columns) */}
         <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left border-t border-slate-200/80 pt-16 md:pt-24">
            <div className="lg:col-span-5 lg:sticky lg:top-48 space-y-6">
               <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">Milestones</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-4 leading-tight">Our Historic Journey</h2>
                  <p className="text-slate-550 text-sm md:text-base leading-relaxed">
                     Over two decades of unwavering commitment to technical empowerment, student leadership, and societal impact.
                  </p>
               </div>
               <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 bg-white p-1">
                  <img 
                     src={journeyImage} 
                     alt="SREC IEEE Historic Group Photo" 
                     className="w-full h-auto rounded-2xl object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
               </div>
            </div>

            <div className="lg:col-span-7">
               <div className="relative space-y-6 pl-4 md:pl-8">
                  {/* vertical timeline connector line */}
                  <div className="absolute left-[9px] md:left-4 top-2 bottom-2 w-[2px] bg-slate-200" />
                  
                  {milestones.map((item, index) => (
                     <div key={index} className="relative pl-8 group">
                        {/* Dot */}
                        <div className="absolute left-[3px] md:left-[10px] top-1.5 w-3.5 h-3.5 -translate-x-1/2 bg-white border-2 border-slate-300 rounded-full shadow-sm group-hover:border-blue-600 transition-colors z-10">
                           <div className="w-1.5 h-1.5 bg-slate-300 group-hover:bg-blue-600 rounded-full mx-auto my-0.5" />
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                           <div className="flex items-center gap-3 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded bg-gradient-to-r ${item.color} text-white`}>
                                 {item.year}
                              </span>
                              <h3 className="font-serif font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                                 {item.title}
                              </h3>
                           </div>
                           <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {item.description}
                           </p>
                        </motion.div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* SECTION 3: Pillars & Benefits (Two Columns) */}
         <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left border-t border-slate-200/80 pt-16 md:pt-24">
            
            {/* Left Column: Pillars */}
            <div className="lg:col-span-6 space-y-6">
               <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">Foundations</span>
                  <h2 className="text-3xl font-serif font-black text-slate-800 mb-6">Our Core Pillars</h2>
               </div>

               <div className="flex flex-col gap-4">
                  {pillars.map((pillar, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 group"
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${pillar.lightColor}`}>
                           <pillar.icon size={20} />
                        </div>
                        <div>
                           <h3 className="font-serif text-base font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                              {pillar.title}
                           </h3>
                           <p className="text-slate-500 text-xs leading-relaxed">
                              {pillar.desc}
                           </p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>

            {/* Right Column: Benefits */}
            <div className="lg:col-span-6 space-y-6">
               <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">Perks</span>
                  <h2 className="text-3xl font-serif font-black text-slate-800 mb-6">Membership Benefits</h2>
               </div>

               <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "IEEE Xplore Library",
                      desc: "Gain free access to millions of highly cited engineering documents, papers, and journals.",
                      icon: BookOpen,
                      color: "text-blue-500 bg-blue-50"
                    },
                    {
                      title: "Global Networking",
                      desc: "Connect directly with industry leaders and engineering students across more than 160 countries.",
                      icon: Globe2,
                      color: "text-indigo-500 bg-indigo-50"
                    },
                    {
                      title: "Financial Grants",
                      desc: "Eligibility for exclusive IEEE scholarships, travel grants, and project funding.",
                      icon: Award,
                      color: "text-emerald-500 bg-emerald-50"
                    },
                    {
                      title: "Skill Credentials",
                      desc: "Earn internationally recognized certificates for participating in technical contests.",
                      icon: Trophy,
                      color: "text-purple-500 bg-purple-50"
                    }
                  ].map((perk, i) => (
                     <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-3 ${perk.color}`}>
                           <perk.icon size={16} />
                        </div>
                        <div>
                           <h4 className="font-serif font-bold text-slate-800 text-xs mb-1">{perk.title}</h4>
                           <p className="text-slate-500 text-[10px] leading-relaxed">{perk.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
