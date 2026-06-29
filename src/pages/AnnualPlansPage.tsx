import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  CalendarDays,
  Search,
  RefreshCw,
  Table2,
  LayoutList,
  Grid3X3,
  ChevronRight,
  FolderOpen,
  Clock3,
  CheckCircle2,
  Activity,
  Star,
  Download,
  ArrowUpDown,
} from "lucide-react";

type AnnualPlan = {
  id: number;
  s_no: number;
  event: string;
  sub_event: string | null;
  schedule: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } as any
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } as any
  },
};

const AnnualPlansPage = () => {
  const [plans, setPlans] = useState<AnnualPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "cards">("table");
  const [sortBy, setSortBy] = useState<"s_no" | "event" | "schedule">("s_no");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("annual_plan")
      .select("id, s_no, event, sub_event, schedule")
      .order("s_no", { ascending: true });

    if (error) {
      toast.error("Failed to load annual plans");
      console.error(error);
    } else {
      setPlans((data as AnnualPlan[]) || []);
      setLastUpdated(new Date());
    }
    setLoading(false);
  };

  const months = useMemo(() => {
    const unique = Array.from(new Set(plans.map((item) => item.schedule)));
    return ["All", ...unique.sort()];
  }, [plans]);

  const filteredAndSortedPlans = useMemo(() => {
    const result = plans.filter((plan) => {
      const term = search.toLowerCase();
      return (
        (!term ||
          plan.event.toLowerCase().includes(term) ||
          (plan.sub_event || "").toLowerCase().includes(term) ||
          plan.schedule.toLowerCase().includes(term)) &&
        (selectedMonth === "All" || plan.schedule === selectedMonth)
      );
    });

    result.sort((a, b) => {
      if (sortBy === "s_no") return a.s_no - b.s_no;
      if (sortBy === "event") return a.event.localeCompare(b.event);
      return a.schedule.localeCompare(b.schedule);
    });

    return result;
  }, [plans, search, selectedMonth, sortBy]);

  const totalPlans = plans.length;
  const recurringCount = plans.filter((p) => p.schedule === "Every Month").length;
  const monthCount = new Set(
    plans.filter((p) => p.schedule !== "Every Month").map((p) => p.schedule)
  ).size;

  const highlightedPlan = filteredAndSortedPlans[0];

  const exportToCSV = () => {
    if (filteredAndSortedPlans.length === 0) return toast.error("No data to export");

    const csvRows = [
      ["S.No", "Event", "Sub Event", "Schedule"],
      ...filteredAndSortedPlans.map(p => [
        p.s_no.toString(),
        p.event,
        p.sub_event || "",
        p.schedule
      ])
    ];

    const csvContent = csvRows.map(row => row.map(field => `"${field}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IEEE_SREC_Annual_Plans_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <Navbar />

      {/* Catchy & Smooth Hero */}
      <section className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden bg-gradient-to-b from-blue-50 via-slate-55 to-white border-b border-slate-200/60">
        {/* Soft floating accents */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 right-24 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 backdrop-blur text-xs font-semibold text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.05)]">
              <Star className="text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]" size={14} />
              IEEE SREC STUDENT BRANCH
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900">
              Annual Activity <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 drop-shadow-[0_4px_15px_rgba(37,99,235,0.08)]">Roadmap</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-550 max-w-2xl mx-auto leading-relaxed font-light">
              Discover the complete official schedule of events, workshops, and initiatives for the academic year
            </p>
          </div>

          {/* Stats - Premium Glass Tiles */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Events", value: totalPlans, icon: FolderOpen },
              { label: "Months Covered", value: monthCount, icon: CalendarDays },
              { label: "Recurring Events", value: recurringCount, icon: Clock3 },
              { label: "Showing Now", value: filteredAndSortedPlans.length, icon: CheckCircle2, highlight: true },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, y: -4 }}
                className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between h-48 transition-all duration-500 ${
                  s.highlight 
                    ? "bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 border border-blue-400/20" 
                    : "bg-white border border-slate-200/80 shadow-md hover:border-blue-500/30 hover:shadow-xl"
                }`}
              >
                <div>
                  <p className={`text-[10px] uppercase tracking-[0.15em] font-black ${s.highlight ? "text-blue-100" : "text-slate-500"}`}>{s.label}</p>
                  <p className={`text-5xl font-black mt-2 tracking-tight ${s.highlight ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700"}`}>{s.value}</p>
                </div>
                <s.icon className={`mt-6 w-6 h-6 ${s.highlight ? "text-white animate-pulse" : "text-blue-600"}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-8 -mt-12 pb-16 relative z-10 flex-grow w-full">
        {/* Enhanced Control Bar */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200/60 p-5 md:p-6 mb-8">
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, sub-events..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm text-slate-800 placeholder-slate-400 transition-all shadow-inner"
              />
            </div>

            <div className="flex gap-3 flex-wrap w-full xl:w-auto justify-center xl:justify-end items-center">
              <button
                onClick={fetchPlans}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-500/20 border border-blue-500/20"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <Download size={14} /> Export CSV
              </button>

              {/* Segmented View Toggle - Blue Glass */}
              <div className="flex bg-slate-100 border border-slate-200/60 rounded-xl p-1">
                {[
                  { mode: "table", icon: Table2, label: "Table" },
                  { mode: "timeline", icon: LayoutList, label: "Timeline" },
                  { mode: "cards", icon: Grid3X3, label: "Cards" },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as "table" | "timeline" | "cards")}
                    className={`px-4 py-2 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all ${
                      viewMode === mode 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md text-white border border-blue-500/20" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={14} />
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-2 text-slate-500 text-xs">
                <ArrowUpDown size={14} className="text-blue-600" />
                <select
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "s_no" | "event" | "schedule")}
                  className="bg-transparent font-bold outline-none text-slate-700 cursor-pointer [&>option]:bg-white [&>option]:text-slate-800"
                >
                  <option value="s_no">Sort: S.No</option>
                  <option value="event">Sort: Name</option>
                  <option value="schedule">Sort: Schedule</option>
                </select>
              </div>
            </div>
          </div>

          {/* Month Filters */}
          <div className="mt-6 flex flex-wrap gap-1.5 justify-center xl:justify-start">
            {months.map((month) => (
              <motion.button
                key={month}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  selectedMonth === month
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border-transparent"
                    : "bg-slate-100/80 border-slate-200/40 text-slate-600 hover:text-slate-900 hover:border-slate-200/80"
                }`}
              >
                {month}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Highlighted + Status */}
        <div className="grid grid-cols-1 grid-flow-row lg:grid-cols-12 gap-6 mb-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-md relative overflow-hidden group"
          >
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-all duration-500" />
            
            <div className="uppercase text-[10px] tracking-[0.2em] font-black text-blue-600 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Highlight of the Year
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
              {highlightedPlan ? highlightedPlan.event : "No highlighted plan"}
            </h2>
            {highlightedPlan?.sub_event && (
              <p className="mt-3 text-sm text-slate-500 leading-relaxed font-light">{highlightedPlan.sub_event}</p>
            )}
            {highlightedPlan && (
              <div className="mt-6 flex gap-3 flex-wrap">
                <div className="bg-slate-100 border border-slate-200/60 px-4 py-2 rounded-xl font-mono text-xs text-blue-600 font-bold">
                  S.No {highlightedPlan.s_no}
                </div>
                <div className="bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-xl font-bold text-xs">
                  {highlightedPlan.schedule}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-4 bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="uppercase text-[10px] tracking-[0.2em] font-black text-slate-500 mb-4">System Status</div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 text-sm">Connected Live</p>
                    <p className="text-xs text-slate-500 font-light">Supabase • Real-time data</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Activity size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 text-sm">Filters Active</p>
                    <p className="text-xs text-slate-500 font-light">Search • Sort • Month filter</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Explorer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/50 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Star className="text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]" size={24} />
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Event Explorer</h2>
            </div>
            <p className="text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Showing {filteredAndSortedPlans.length} of {totalPlans} events
            </p>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin shadow-md" />
              <p className="mt-4 text-slate-550 text-sm font-medium tracking-wide">Loading the roadmap...</p>
            </div>
          ) : filteredAndSortedPlans.length === 0 ? (
            <div className="py-16 text-center">
              <Search size={48} className="mx-auto text-blue-500/20 mb-3 animate-pulse" />
              <p className="mt-2 text-lg font-semibold text-slate-800">No events match your filters</p>
              <p className="mt-1 text-slate-500 text-xs font-light">Try adjusting your keywords or month selection</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Table View */}
              {viewMode === "table" && (
                 <motion.div
                   key="table"
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   className="overflow-x-auto"
                 >
                   <table className="w-full">
                     <thead>
                       <tr className="bg-slate-50/80 border-b border-slate-200/60">
                         <th className="px-6 py-4 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">S.No</th>
                         <th className="px-6 py-4 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">Event Details</th>
                         <th className="px-6 py-4 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">Schedule</th>
                       </tr>
                     </thead>
                     <motion.tbody variants={stagger} initial="hidden" animate="visible">
                       {filteredAndSortedPlans.map((plan) => (
                         <motion.tr
                           key={plan.id}
                           variants={fadeUp}
                           whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.01)" }}
                           className="border-b border-slate-100 transition-colors"
                         >
                           <td className="px-6 py-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-sm font-bold text-blue-600 shadow-inner">
                               {plan.s_no}
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="font-bold text-slate-800 text-base tracking-tight">{plan.event}</div>
                             {plan.sub_event && (
                               <div className="mt-1 text-slate-500 flex items-center gap-1.5 text-xs font-light">
                                 <ChevronRight size={14} className="text-blue-500 shrink-0" /> 
                                 <span>{plan.sub_event}</span>
                               </div>
                             )}
                           </td>
                           <td className="px-6 py-4">
                             <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                               {plan.schedule}
                             </span>
                           </td>
                         </motion.tr>
                       ))}
                     </motion.tbody>
                   </table>
                 </motion.div>
              )}

              {/* Timeline View */}
              {viewMode === "timeline" && (
                 <motion.div
                   key="timeline"
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   className="p-6 space-y-8 relative"
                 >
                   <div className="absolute top-6 bottom-6 left-[42px] w-[2px] bg-gradient-to-b from-blue-400 via-blue-500 to-indigo-400 opacity-40 pointer-events-none hidden md:block" />
                   {filteredAndSortedPlans.map((plan, index) => (
                     <motion.div
                       key={plan.id}
                       initial={{ opacity: 0, x: -30 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: index * 0.05 }}
                       className="flex flex-col md:flex-row gap-4 md:gap-8 relative z-10"
                     >
                       <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-black shadow-md shadow-blue-500/10 border border-blue-400/20 shrink-0">
                         {plan.s_no}
                       </div>
                       <div className="flex-1 bg-white border border-slate-200/80 hover:border-blue-500/30 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                         <div className="flex justify-between items-start flex-wrap gap-4">
                           <div>
                             <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                               {plan.event}
                             </h3>
                             {plan.sub_event && (
                               <p className="text-slate-500 mt-2 text-xs leading-relaxed font-light">
                                 {plan.sub_event}
                               </p>
                             )}
                           </div>
                           <span className="bg-slate-100 text-slate-700 border border-slate-200/60 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow-sm">
                             {plan.schedule}
                           </span>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </motion.div>
              )}

              {/* Cards View */}
              {viewMode === "cards" && (
                 <motion.div
                   key="cards"
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                 >
                   {filteredAndSortedPlans.map((plan, index) => (
                     <motion.div
                       key={plan.id}
                       initial={{ opacity: 0, y: 25 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.04 }}
                       whileHover={{ y: -4, scale: 1.01 }}
                       className="bg-white border border-slate-200/80 hover:border-blue-500/30 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between group overflow-hidden"
                     >
                       <div>
                         <div className="flex justify-between items-center mb-6">
                           <div className="w-10 h-10 bg-slate-100 border border-slate-200/60 rounded-xl flex items-center justify-center text-sm font-bold text-blue-600 shadow-inner">
                             {plan.s_no}
                           </div>
                           <span className="px-4 py-1.5 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-full text-[9px] font-black uppercase tracking-widest">
                             {plan.schedule}
                           </span>
                         </div>
                         <h3 className="text-lg font-bold text-slate-800 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                           {plan.event}
                         </h3>
                         {plan.sub_event && (
                           <p className="mt-3 text-slate-500 text-xs leading-relaxed font-light">
                             {plan.sub_event}
                           </p>
                         )}
                       </div>
                       <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-500 rounded-full" />
                     </motion.div>
                   ))}
                 </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};


export default AnnualPlansPage;