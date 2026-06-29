import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    ArcElement, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type MemberRow = {
    id: number;
    year: number;
    professional_members: number;
    student_members: number;
    total_members: number;
};

type SortField = "year" | "professional_members" | "student_members" | "total_members";

const pct = (a: number, b?: number) =>
    b ? Math.round(((a - b) / b) * 100) : null;

const StatCard = ({
    label, value, delta, refYear,
}: { label: string; value: number | string; delta?: number | null; refYear?: number }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        <div className="flex items-center gap-2 mt-2">
            {delta !== null && delta !== undefined ? (
                <>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${delta >= 0 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
                        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
                    </span>
                    <span className="text-xs text-gray-400">vs {refYear}</span>
                </>
            ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">2020 – 2024</span>
            )}
        </div>
    </div>
);

const TrendBars = ({ data, currentId }: { data: MemberRow[]; currentId: number }) => {
    const idx = data.findIndex((r) => r.id === currentId);
    const slice = data.slice(Math.max(0, idx - 3), idx + 1).reverse();
    const max = Math.max(...slice.map((r) => r.total_members), 1);
    return (
        <div className="flex items-end gap-0.5">
            <style>{slice.map((r) => `.tb-${currentId}-${r.id} { height: ${Math.round((r.total_members / max) * 18)}px; }`).join(' ')}</style>
            {slice.map((r) => (
                <div
                    key={r.id}
                    className={`w-1.5 rounded-sm bg-blue-300 tb-${currentId}-${r.id}`}
                />
            ))}
        </div>
    );
};

const RankBadge = ({ rank }: { rank: number }) => {
    const styles: Record<number, string> = {
        0: "bg-amber-100 text-amber-800",
        1: "bg-gray-200 text-gray-700",
        2: "bg-orange-100 text-orange-700",
    };
    return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium ${styles[rank] ?? "bg-gray-100 text-gray-500"}`}>
            {rank + 1}
        </div>
    );
};

const MembersPage = () => {
    const [rows, setRows] = useState<MemberRow[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("year");
    const [sortAsc, setSortAsc] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("member_counts").select("*").order("year", { ascending: false });
            if (error) { setErrorMsg(error.message); setRows([]); }
            else setRows(data || []);
            setLoading(false);
        })();
    }, []);

    const years = useMemo(() => [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a), [rows]);

    const latest = rows[0];
    const prev = rows[1];
    const maxTotal = Math.max(...rows.map((r) => r.total_members), 1);

    const filtered = useMemo(() => {
        let r = rows;
        if (selectedYear !== "all") r = r.filter((x) => x.year === Number(selectedYear));
        if (search) r = r.filter((x) => String(x.year).includes(search));
        return [...r].sort((a, b) => sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField]);
    }, [rows, selectedYear, search, sortField, sortAsc]);

    const handleSort = (field: SortField) => {
        if (sortField === field) setSortAsc((p) => !p);
        else { setSortField(field); setSortAsc(false); }
    };

    const exportCSV = () => {
        const csv = "Year,Professional Members,Student Members,Total Members\n"
            + filtered.map((r) => `${r.year},${r.professional_members},${r.student_members},${r.total_members}`).join("\n");
        const a = document.createElement("a");
        a.href = "data:text/csv," + encodeURIComponent(csv);
        a.download = "ieee_members.csv"; a.click();
    };

    const sortedByTotal = useMemo(() => [...filtered].sort((a, b) => b.total_members - a.total_members), [filtered]);

    const barData = {
        labels: [...rows].reverse().map((r) => r.year),
        datasets: [
            { label: "Professional", data: [...rows].reverse().map((r) => r.professional_members), backgroundColor: "#185FA5", borderRadius: 4 },
            { label: "Student", data: [...rows].reverse().map((r) => r.student_members), backgroundColor: "#1D9E75", borderRadius: 4 },
        ],
    };

    const donutData = latest ? {
        labels: ["Professional", "Student"],
        datasets: [{ data: [latest.professional_members, latest.student_members], backgroundColor: ["#185FA5", "#1D9E75"], borderWidth: 0 }],
    } : null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="bg-[#185FA5] px-6 py-7 text-white">
                <h1 className="text-2xl font-semibold">Membership Dashboard</h1>
                <p className="text-sm text-blue-200 mt-1">IEEE Professional &amp; Student member analytics — Sri Ramakrishna Engineering College</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {["all", ...years].map((y) => (
                        <button
                            key={y}
                            onClick={() => setSelectedYear(String(y))}
                            className={`text-xs px-3 py-1 rounded-full border transition ${selectedYear === String(y)
                                ? "bg-white text-blue-700 font-medium border-white"
                                : "border-white/30 text-white/80 hover:border-white"}`}
                        >
                            {y === "all" ? "All Years" : y}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
                {loading && <p className="text-gray-500">Loading…</p>}
                {!loading && errorMsg && <p className="text-red-600 text-sm">Error: {errorMsg}</p>}

                {!loading && !errorMsg && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                            <StatCard label="Total members (latest)" value={latest?.total_members ?? "—"} delta={pct(latest?.total_members, prev?.total_members)} refYear={prev?.year} />
                            <StatCard label="Professional members" value={latest?.professional_members ?? "—"} delta={pct(latest?.professional_members, prev?.professional_members)} refYear={prev?.year} />
                            <StatCard label="Student members" value={latest?.student_members ?? "—"} delta={pct(latest?.student_members, prev?.student_members)} refYear={prev?.year} />
                            <StatCard label="Years tracked" value={rows.length} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-7">
                            <div className="md:col-span-3 bg-white border border-gray-100 rounded-xl p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Membership growth</p>
                                <p className="text-xs text-gray-400 mb-4">Professional vs student members by year</p>
                                <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }} />
                                <div className="flex gap-4 mt-3">
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <span className="w-3 h-3 rounded-sm inline-block bg-[#185FA5]" />Professional
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <span className="w-3 h-3 rounded-sm inline-block bg-[#1D9E75]" />Student
                                    </span>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Member split (latest year)</p>
                                <p className="text-xs text-gray-400 mb-4">Professional vs student ratio</p>
                                {donutData && <Doughnut data={donutData} options={{ cutout: "68%", plugins: { legend: { display: false } } }} />}
                                <div className="flex flex-col gap-1 mt-3">
                                    {donutData?.labels?.map((l, i) => (
                                        <span key={String(l)} className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <span className={`w-3 h-3 rounded-sm inline-block ${i === 0 ? "bg-[#185FA5]" : "bg-[#1D9E75]"}`} />
                                            {String(l)} — {donutData.datasets[0].data[i]} ({Math.round((donutData.datasets[0].data[i] / (latest?.total_members || 1)) * 100)}%)
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">Year:</span>
                                    <select aria-label="Filter by year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:border-blue-500">
                                        <option value="all">All</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search year…" className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-36 outline-none focus:border-blue-500" />
                                </div>
                                <button onClick={exportCSV} className="text-sm bg-blue-700 text-white px-4 py-1.5 rounded-lg hover:bg-blue-800 transition">
                                    Export CSV
                                </button>
                            </div>

                            {filtered.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-10">No data found.</p>
                            ) : (
                                <>
                                    <style>
                                        {filtered.map(r => {
                                            const p = Math.round((r.professional_members / r.total_members) * 100);
                                            const t = Math.round((r.total_members / maxTotal) * 100);
                                            return `.bar-p-${r.id}{width:${p}%} .bar-s-${r.id}{width:${100-p}%} .bar-t-${r.id}{width:${t}%}`;
                                        }).join(' ')}
                                    </style>
                                <table className="w-full border-collapse">
                                    <thead className="bg-[#0C447C] text-white text-xs">
                                        <tr>
                                            <th className="px-5 py-3 text-left w-12">#</th>
                                            {(["year", "professional_members", "student_members", "total_members"] as SortField[]).map((f) => (
                                                <th key={f} className="px-5 py-3 text-left cursor-pointer hover:bg-blue-800" onClick={() => handleSort(f)}>
                                                    {f === "year" ? "Year" : f === "professional_members" ? "Professional" : f === "student_members" ? "Student" : "Total"}
                                                    {sortField === f ? (sortAsc ? " ▲" : " ▼") : " ⇅"}
                                                </th>
                                            ))}
                                            <th className="px-5 py-3 text-left">Share</th>
                                            <th className="px-5 py-3 text-left">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((row) => {
                                            const rank = sortedByTotal.findIndex((x) => x.id === row.id);
                                            const profPct = Math.round((row.professional_members / row.total_members) * 100);
                                            return (
                                                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                                    <td className="px-5 py-3"><RankBadge rank={rank} /></td>
                                                    <td className="px-5 py-3">
                                                        <span className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{row.year}</span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm w-7">{row.professional_members}</span>
                                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className={`h-full bg-blue-700 rounded-full bar-p-${row.id}`} />
                                                            </div>
                                                            <span className="text-xs text-gray-400">{profPct}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm w-7">{row.student_members}</span>
                                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className={`h-full bg-teal-600 rounded-full bar-s-${row.id}`} />
                                                            </div>
                                                            <span className="text-xs text-gray-400">{100 - profPct}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 font-semibold text-blue-700">{row.total_members}</td>
                                                    <td className="px-5 py-3">
                                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`h-full bg-blue-400 rounded-full bar-t-${row.id}`} />
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3"><TrendBars data={rows} currentId={row.id} /></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                </>
                            )}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default MembersPage;