import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import {
    BadgeIndianRupee,
    FileText,
    Mail,
    Layers3,
    Search,
    Filter,
    ArrowUpDown,
    LayoutGrid,
    Rows3,
    Loader2,
    RefreshCw,
    BarChart3,
    TrendingUp,
    Database,
} from "lucide-react";
import { toast } from "sonner";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    CartesianGrid,
} from "recharts";

type Funding = {
    id: number;
    s_no?: number;
    title: string;
    submission_type: string;
    description: string | null;
    budget_amount: number | null;
    contact_email: string | null;
    created_at?: string | null;
};

const CHART_COLORS = [
    "#00629b",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
    "#f97316",
];

const cardContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const formatCurrency = (value: number | null | undefined) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getYearFromFunding = (item: Funding) => {
    if (item.created_at) {
        const d = new Date(item.created_at);
        if (!Number.isNaN(d.getTime())) return String(d.getFullYear());
    }

    const text = `${item.title} ${item.description || ""}`;
    const match = text.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : "Unknown";
};

const FundingsPage = () => {
    const [fundings, setFundings] = useState<Funding[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedYear, setSelectedYear] = useState("All");
    const [sortBy, setSortBy] = useState<"latest" | "highest" | "lowest">("latest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchFundings();
    }, []);

    const fetchFundings = async () => {
        setLoading(true);
        setErrorMessage("");

        const { data, error } = await supabase
            .from("funding_submissions")
            .select("*")
            .order("created_at", { ascending: false });

        console.log("funding_submissions data:", data);
        console.log("funding_submissions error:", error);

        if (error) {
            console.error(error);
            setErrorMessage(error.message || "Failed to load funding records.");
            toast.error("Failed to load funding records.");
            setFundings([]);
        } else {
            setFundings((data as Funding[]) || []);
            toast.success("Funding records loaded");
        }

        setLoading(false);
    };

    const submissionTypes = useMemo(() => {
        const types = new Set(
            fundings.map((f) => f.submission_type).filter((v): v is string => Boolean(v))
        );
        return ["All", ...Array.from(types).sort()];
    }, [fundings]);

    const years = useMemo(() => {
        const values = Array.from(new Set(fundings.map((f) => getYearFromFunding(f))))
            .filter((y) => y !== "Unknown")
            .sort((a, b) => Number(b) - Number(a));
        return ["All", ...values];
    }, [fundings]);

    const filteredFundings = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        const result = fundings.filter((f) => {
            const matchesSearch =
                !term ||
                f.title?.toLowerCase().includes(term) ||
                f.submission_type?.toLowerCase().includes(term) ||
                (f.description || "").toLowerCase().includes(term) ||
                (f.contact_email || "").toLowerCase().includes(term);

            const matchesType =
                selectedType === "All" || f.submission_type === selectedType;

            const matchesYear =
                selectedYear === "All" || getYearFromFunding(f) === selectedYear;

            return matchesSearch && matchesType && matchesYear;
        });

        result.sort((a, b) => {
            if (sortBy === "highest") return (b.budget_amount || 0) - (a.budget_amount || 0);
            if (sortBy === "lowest") return (a.budget_amount || 0) - (b.budget_amount || 0);

            const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
            return bTime - aTime;
        });

        return result;
    }, [fundings, searchTerm, selectedType, selectedYear, sortBy]);

    const totalFilteredAmount = useMemo(
        () => filteredFundings.reduce((sum, f) => sum + Number(f.budget_amount || 0), 0),
        [filteredFundings]
    );

    const highestFunding = useMemo(
        () =>
            filteredFundings.reduce((max, curr) => {
                return Number(curr.budget_amount || 0) > Number(max?.budget_amount || 0)
                    ? curr
                    : max;
            }, filteredFundings[0]),
        [filteredFundings]
    );

    const chartByType = useMemo(() => {
        const grouped = filteredFundings.reduce<Record<string, number>>((acc, item) => {
            const key = item.submission_type || "Other";
            acc[key] = (acc[key] || 0) + Number(item.budget_amount || 0);
            return acc;
        }, {});

        return Object.entries(grouped).map(([name, amount]) => ({
            name,
            amount,
        }));
    }, [filteredFundings]);

    const chartByYear = useMemo(() => {
        const grouped = filteredFundings.reduce<Record<string, number>>((acc, item) => {
            const key = getYearFromFunding(item);
            acc[key] = (acc[key] || 0) + Number(item.budget_amount || 0);
            return acc;
        }, {});

        return Object.entries(grouped)
            .filter(([year]) => year !== "Unknown")
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([year, amount]) => ({
                year,
                amount,
            }));
    }, [filteredFundings]);

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedType("All");
        setSelectedYear("All");
        setSortBy("latest");
    };    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
            {/* Background ambient glowing spheres */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
            <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-slate-55 to-white pt-24 pb-14 md:pt-28 md:pb-18 border-b border-slate-200/60">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 backdrop-blur text-xs font-semibold text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.05)] mb-4"
                    >
                        <Layers3 size={14} className="text-blue-600" />
                        IEEE SREC Finance Hub
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-3 text-slate-900"
                    >
                        Funding <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 drop-shadow-[0_4px_15px_rgba(37,99,235,0.08)]">Records</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base md:text-lg text-slate-550 max-w-2xl leading-relaxed font-light"
                    >
                        Search, filter, analyze, and track funding records, rebates,
                        sponsorships, and budget allocations from the student branch.
                    </motion.p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-12 relative z-20 flex-grow w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        whileHover={{ y: -4 }}
                        className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Records</p>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">
                                    {filteredFundings.length}
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 text-blue-600 flex items-center justify-center shadow-inner">
                                <Database size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="group relative bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white rounded-2xl p-5 overflow-hidden border border-blue-400/20 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-wider mb-1">Visible Total</p>
                                <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                                    {formatCurrency(totalFilteredAmount)}
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-sm shrink-0 ml-4">
                                <BadgeIndianRupee size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        whileHover={{ y: -4 }}
                        className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Categories</p>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">
                                    {submissionTypes.length - 1}
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 text-amber-500 flex items-center justify-center shadow-inner">
                                <Filter size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        whileHover={{ y: -4 }}
                        className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Highest Record</p>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight mt-1 line-clamp-2 shrink-0">
                                    {highestFunding ? formatCurrency(highestFunding.budget_amount) : "₹0"}
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 text-purple-600 flex items-center justify-center shadow-inner shrink-0 ml-4">
                                <BarChart3 size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200/60 p-4 md:p-6 mb-8 flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                    <div className="relative flex-1 w-full xl:max-w-xl">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search records by title, type, description, or email..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-xs text-slate-800 placeholder-slate-400 transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center xl:justify-end">
                        <div className="relative shrink-0 select-none">
                            <Filter
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3b82f6] pointer-events-none"
                                size={14}
                            />
                            <select
                                aria-label="Filter by Category"
                                className="pl-9 pr-6 py-2.5 bg-slate-100 text-blue-700 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-bold appearance-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-850"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                {submissionTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type === "All" ? "All Categories" : type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <select
                            aria-label="Filter by Year"
                            className="px-4 py-2.5 bg-slate-100 border border-slate-200/60 text-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-bold appearance-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-850"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year === "All" ? "All Years" : year}
                                </option>
                            ))}
                        </select>

                        <div className="relative shrink-0 select-none">
                            <ArrowUpDown
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                                size={14}
                            />
                            <select
                                aria-label="Sort by"
                                className="pl-9 pr-6 py-2.5 bg-slate-100 border border-slate-200/60 text-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-bold appearance-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-850"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "latest" | "highest" | "lowest")}
                            >
                                <option value="latest">Newest First</option>
                                <option value="highest">Highest Amount</option>
                                <option value="lowest">Lowest Amount</option>
                            </select>
                        </div>

                        <button
                            onClick={resetFilters}
                            className="px-4 py-2.5 bg-slate-100 text-slate-650 hover:bg-slate-200 rounded-xl border border-slate-200 font-bold text-xs transition"
                        >
                            Reset
                        </button>

                        <button
                            onClick={fetchFundings}
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold border border-blue-500/20 text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-blue-500/10"
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>

                        <div className="w-px h-8 bg-slate-200 hidden md:block mx-1"></div>

                        <div className="flex bg-slate-100 border border-slate-200/60 p-1 rounded-xl">
                            <button
                                aria-label="Grid view"
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition ${viewMode === "grid"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md text-white border border-blue-500/20"
                                        : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                aria-label="List view"
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition ${viewMode === "list"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md text-white border border-blue-500/20"
                                        : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                <Rows3 size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white border border-slate-200/80 rounded-2xl shadow-md p-5 lg:p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-blue-600 flex items-center justify-center border border-slate-200/60 shadow-inner">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Funding Categories</h3>
                                <p className="text-xs font-light text-slate-500">
                                    Total amount grouped by category
                                </p>
                            </div>
                        </div>

                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartByType}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} />
                                    <Tooltip 
                                        cursor={{ fill: "rgba(59, 130, 246, 0.01)" }}
                                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#334155' }}
                                        formatter={(value: number) => formatCurrency(value)} 
                                    />
                                    <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={32}>
                                        {chartByType.map((_, index) => (
                                            <Cell
                                                key={`bar-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                className="hover:opacity-85 transition-opacity cursor-pointer"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white border border-slate-200/80 rounded-2xl shadow-md p-5 lg:p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-blue-600 flex items-center justify-center border border-slate-200/60 shadow-inner">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Funding by Year</h3>
                                <p className="text-xs font-light text-slate-500">
                                    Historical budget amount trend
                                </p>
                            </div>
                        </div>

                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartByYear} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#334155' }}
                                        formatter={(value: number) => formatCurrency(value)} 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#2563eb" 
                                        strokeWidth={3}
                                        dot={{ fill: "#1d4ed8", r: 5, strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 7, strokeWidth: 0, fill: "#1d4ed8" }}
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                    <p className="text-slate-500 font-medium tracking-wide text-xs">
                        Showing <span className="font-bold text-slate-800">{filteredFundings.length}</span> records
                    </p>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl border border-blue-500/20 shadow-md shadow-blue-500/10">
                        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                            Visible Total
                        </span>
                        <span className="text-lg font-black tracking-tight">
                            {formatCurrency(totalFilteredAmount)}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="py-16 flex flex-col items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                        <p className="text-slate-500 text-xs font-medium tracking-wide animate-pulse">
                            Loading Funding Database...
                        </p>
                    </div>
                ) : errorMessage ? (
                    <div className="bg-white rounded-2xl border border-red-200 py-12 text-center px-4 shadow-md">
                        <FileText size={40} className="mx-auto text-red-500 mb-3" />
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            Unable to load records
                        </h3>
                        <p className="text-red-600 text-xs max-w-lg mx-auto font-light">{errorMessage}</p>
                        <button
                            onClick={fetchFundings}
                            className="mt-4 px-5 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredFundings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 border-dashed py-16 text-center px-4 shadow-md">
                        <FileText size={40} className="mx-auto text-slate-400 mb-3 animate-pulse" />
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No Records Found</h3>
                        <p className="text-slate-500 text-xs max-w-sm mx-auto font-light">
                            Try adjusting your search or filters.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 px-5 py-2 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-xl text-xs transition"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={cardContainer}
                        initial="hidden"
                        animate="visible"
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "flex flex-col gap-3"
                        }
                    >
                        <AnimatePresence>
                            {filteredFundings.map((fund) => (
                                <motion.div
                                    key={fund.id}
                                    variants={cardItem}
                                    layout
                                    className={`group relative bg-white border border-slate-200/80 hover:border-blue-500/30 hover:shadow-xl transition-all duration-500 overflow-hidden rounded-2xl ${viewMode === "list" ? "flex flex-col md:flex-row" : "flex flex-col"
                                        }`}
                                >
                                    {/* Top decorative gradient line on hover */}
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${viewMode === "list" ? "md:bottom-0 md:top-0 md:left-0 md:w-1.5 md:h-full" : ""}`} />

                                    <div
                                        className={`bg-slate-50/50 relative overflow-hidden transition-colors duration-500 border-b border-slate-100 p-6 ${viewMode === "list"
                                                ? "w-full md:w-1/3 min-w-[300px] border-b-0 border-r border-slate-100 md:flex md:flex-col md:justify-center"
                                                : ""
                                            }`}
                                    >
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-[20px] pointer-events-none" />

                                        <div className="relative flex items-center justify-between gap-4 mb-4">
                                            <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                                                {fund.submission_type}
                                            </span>
                                            {fund.s_no && (
                                                <span className="text-slate-400 font-bold text-xs">#{fund.s_no}</span>
                                            )}
                                        </div>

                                        <h2 className="relative text-lg font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-4">
                                            {fund.title}
                                        </h2>

                                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-3">
                                            Added on {formatDate(fund.created_at)}
                                        </div>

                                        <div className="mt-auto pt-3 border-t border-slate-150 flex items-center justify-between">
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                                Amount
                                            </p>
                                            <h3 className="text-xl font-black text-blue-600">
                                                {formatCurrency(fund.budget_amount)}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-center bg-transparent">
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                                                        Description
                                                    </p>
                                                    <p className="text-slate-600 text-xs leading-relaxed font-light line-clamp-3">
                                                        {fund.description || "Detailed description unavailable."}
                                                    </p>
                                                </div>
                                            </div>

                                            {fund.contact_email && (
                                                <div className="flex gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                                                        <Mail size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                                                            Point of Contact
                                                        </p>
                                                        <p className="text-slate-700 text-xs font-semibold">
                                                            {fund.contact_email}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>


            <Footer />
        </div>
    );
};

export default FundingsPage;