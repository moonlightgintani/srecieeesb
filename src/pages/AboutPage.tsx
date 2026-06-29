import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CalendarRange, Trophy, Globe2, Users, Rocket, Sparkles, BookOpen, Award, ShieldCheck, Target, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
    desc: "We prioritize cutting-edge knowledge sharing through specialized workshops, hands-on seminars, and technical symposia.",
    color: "from-blue-500 to-indigo-600",
    lightColor: "bg-blue-50/50 text-blue-600 border-blue-100",
    icon: BookOpen
  },
  {
    title: "Leadership & Growth",
    desc: "We build tomorrow's leaders by giving students complete autonomy to organize, manage, and execute large-scale events.",
    color: "from-emerald-400 to-teal-500",
    lightColor: "bg-emerald-50/50 text-emerald-600 border-emerald-100",
    icon: Users
  },
  {
    title: "Global Collaboration",
    desc: "Through IEEE Xtreme and international conferences, we bridge the gap between our college and the global engineering community.",
    color: "from-purple-500 to-fuchsia-600",
    lightColor: "bg-purple-50/50 text-purple-600 border-purple-100",
    icon: Globe2
  }
];

const AboutPage = () => {
  const { data: counselor } = useQuery({
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden font-sans">
      
      {/* High-tech ambient background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      
      {/* Dynamic blurred ambient blobs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-3/4 right-0 w-[600px] h-[600px] bg-gradient-to-l from-purple-300/10 to-pink-300/10 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />

      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 relative z-10">
        <AboutSection showStats={true} />
      </div>

      {/* Core Pillars Section */}
      <section className="py-12 md:py-16 relative z-10 bg-white border-y border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs tracking-widest uppercase mb-4 border border-blue-100/60 shadow-sm">
              <Target size={14} />
              <span>Our Foundations</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00629b] to-[#00a3e0]">Pillars</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              The foundational principles that guide every decision, event, and initiative we take at Sri Ramakrishna Engineering College.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
                className="bg-white/80 backdrop-blur-md rounded-none p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,98,155,0.08)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Glow bar top border */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${pillar.color}`} />
                
                <div className={`w-16 h-16 rounded-none flex items-center justify-center mb-8 border border-white/80 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${pillar.lightColor}`}>
                  <pillar.icon size={30} />
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-slate-800 mb-4 group-hover:text-[#00629b] transition-colors duration-300">
                  {pillar.title}
                </h3>
                
                <p className="text-slate-500 text-base leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                  {pillar.desc}
                </p>

                {/* Aesthetic hover card highlight */}
                <div className={`absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-[0.03] rounded-full blur-2xl transition-all duration-700 ease-in-out`} />
              </motion.div>
            ))}
          </div>
          
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="py-12 md:py-16 relative z-10 bg-slate-50/50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs tracking-widest uppercase mb-4 border border-indigo-100/60 shadow-sm">
              <CalendarRange size={14} />
              <span>Our Legacy timeline</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              The Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">IEEE SREC</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Over two decades of unwavering commitment to technical empowerment, student leadership, and societal impact.
            </p>
          </div>

          <div className="relative space-y-8">
            {/* Left vertical timeline line */}
            <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-slate-200 pointer-events-none" />
            
            {milestones.map((item, index) => (
              <div key={index} className="relative pl-12 md:pl-24 group">
                {/* Timeline Dot on the left line */}
                <div className="absolute left-6 md:left-12 w-8 h-8 -translate-x-1/2 bg-white border-4 border-slate-200 rounded-full shadow-sm flex items-center justify-center z-10 group-hover:border-[#00629b] transition-colors duration-500">
                  <div className="w-2.5 h-2.5 bg-slate-400 group-hover:bg-[#00629b] rounded-full transition-colors duration-500" />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-none border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden group"
                >
                  {/* Decorative horizontal accent */}
                  <div className={`absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-b ${item.color} opacity-80`} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Left Column: Icon and Year */}
                    <div className="md:col-span-3 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                      <div className={`p-3 rounded-none bg-gradient-to-br ${item.color} text-white shadow-sm shrink-0`}>
                        <item.icon size={24} />
                      </div>
                      <span className={`text-4xl md:text-5xl font-black font-serif bg-gradient-to-br ${item.color} bg-clip-text text-transparent opacity-40 select-none group-hover:opacity-100 transition-opacity duration-500`}>
                        {item.year}
                      </span>
                    </div>
                    
                    {/* Right Column: Title and Description */}
                    <div className="md:col-span-9">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 font-serif group-hover:text-[#00629b] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                        {item.description}
                      </p>
                    </div>
                    
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Message Section */}
      <section className="py-12 md:py-16 bg-white relative z-10 border-y border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-none p-6 md:p-10 border border-slate-800 shadow-xl relative overflow-hidden"
          >
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,98,155,0.15),transparent_60%)] pointer-events-none" />
            
            {/* Glowing quote background */}
            <div className="absolute top-0 right-0 p-8 text-blue-500/10 pointer-events-none select-none">
              <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 21L16.439 12.015L11.536 12L11.503 3H21.5V12.015L19.078 21H14.017ZM4.517 21L6.939 12.015L2.036 12L2.003 3H12V12.015L9.578 21H4.517Z" />
              </svg>
            </div>
            
            <div className="relative z-10 max-w-5xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-xs tracking-widest uppercase mb-6 border border-blue-500/20">
                <Heart size={12} className="animate-pulse" />
                <span>Leadership Message</span>
              </span>
              
              <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-8 text-slate-100 tracking-tight">
                "Empowering students to transcend boundaries and embrace the technological future with confidence, leadership, and ethical responsibility."
              </h3>
              
              <p className="text-slate-300 text-lg leading-relaxed mb-10">
                At IEEE SREC, we believe that education extends far beyond the classroom. Our student branch is a living ecosystem where raw talent meets global opportunity. Through thousands of hours dedicated to technical workshops, leadership training, and collaborative projects, we have consistently nurtured engineers who don't just adapt to the future, but actively build it.
              </p>
              
              <div className="flex items-center gap-5">
                {counselor?.image_url ? (
                  <img 
                    src={counselor.image_url} 
                    alt={counselor.name || "Dr. K. Balamurugan"} 
                    className="w-16 h-16 rounded-none object-cover shadow-md border border-white/10 shrink-0" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-none bg-gradient-to-br from-[#00629b] to-[#00a3e0] flex items-center justify-center text-white font-serif font-black text-2xl shadow-md border border-white/10 shrink-0">
                    KB
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-100 text-xl font-serif">{counselor?.name || "Dr. K. Balamurugan"}</h4>
                  <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Branch Counselor, IEEE SREC Student Branch</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Member Benefits Section */}
      <section className="py-12 md:py-16 bg-slate-50/50 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-4 border border-emerald-100/60 shadow-sm">
              <ShieldCheck size={14} />
              <span>Membership Benefits</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Why Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">IEEE SREC</span>?
            </h2>
            <p className="text-slate-600 text-lg">
              Unlock exclusive opportunities, network globally, and accelerate your academic and professional journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "IEEE Xplore Library",
                desc: "Gain free access to millions of highly cited engineering documents, papers, and journals essential for your research and projects.",
                color: "border-t-blue-500 hover:shadow-blue-500/10",
                icon: BookOpen,
                iconBg: "bg-blue-50 text-blue-500"
              },
              {
                title: "Global Networking",
                desc: "Connect directly with industry leaders, researchers, and fellow engineering students across more than 160 countries.",
                color: "border-t-indigo-500 hover:shadow-indigo-500/10",
                icon: Globe2,
                iconBg: "bg-indigo-50 text-indigo-500"
              },
              {
                title: "Financial Grants",
                desc: "Eligibility for exclusive IEEE scholarships, travel grants, and project funding to support your innovative ideas and research papers.",
                color: "border-t-emerald-500 hover:shadow-emerald-500/10",
                icon: Award,
                iconBg: "bg-emerald-50 text-emerald-500"
              },
              {
                title: "Skill Credentials",
                desc: "Earn internationally recognized certificates for participating in standardized technical contests and leadership roles.",
                color: "border-t-purple-500 hover:shadow-purple-500/10",
                icon: Trophy,
                iconBg: "bg-purple-50 text-purple-500"
              }
            ].map((perk, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`bg-white p-8 rounded-none shadow-[0_4px_25px_rgba(0,0,0,0.01)] border-t-[3px] ${perk.color} border-x border-b border-slate-200/60 hover:shadow-xl transition-all duration-500 group flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-none ${perk.iconBg} flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                  <perk.icon size={22} />
                </div>
                <h4 className="font-serif font-bold text-slate-800 text-lg mb-3">{perk.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
          
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-br from-[#003764] via-[#004a80] to-[#00284d] py-12 md:py-16 relative overflow-hidden text-center text-white z-10 border-t border-[#00629b]/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00a3e0] to-transparent" />
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">Ready to Innovate With Us?</h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Become a part of the world's largest technical professional organization. Expand your network, build your resume, and gain exclusive access to research and opportunities.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
