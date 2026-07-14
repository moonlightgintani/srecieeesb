import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin,
  Mail,
  ExternalLink,
  GraduationCap,
  Award,
  Search,
  LayoutGrid,
  Users,
  List,
  TrendingUp,
  BarChart3,
  Download,
  Building2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Star,
  History,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartTooltip, Legend);

// --- TYPES ---
type SeniorMember = {
  id: number;
  name: string;
  s_no: number | null;
  current_role: string | null;
  college: string | null;
  linkedin_url: string | null;
  image_url: string | null;
};

type MemberRow = {
  id: number;
  year: number;
  professional_members: number;
  student_members: number;
  total_members: number;
};

type Person = {
  id: number | string;
  name?: string;
  role?: string;
  department?: string;
  year?: number;
  academic_year?: string;
  image_url?: string;
  photo?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  linkedin?: string;
  linkedin_profile?: string;
};

type SortField = "year" | "professional_members" | "student_members" | "total_members";

const ROLE_HIERARCHY = [
  "Chairperson",
  "Chair",
  "Vice Chairperson",
  "Vice Chair",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Webmaster",
  "Technical Head",
  "Technical Lead",
  "Design Head",
  "Design Lead",
  "Content Head",
  "PRO",
  "Public Relations",
];

const getRoleWeight = (role: string) => {
  const r = role.trim().toLowerCase();
  const index = ROLE_HIERARCHY.findIndex(h => r.includes(h.toLowerCase()));
  return index === -1 ? 999 : index;
};

// --- ANIMATION CONFIGS ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } as any
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } as any
  },
};

// --- MEMBERSHIP DASHBOARD STAT CARD ---
const pct = (a: number, b?: number) =>
  b ? Math.round(((a - b) / b) * 100) : null;

const StatCard = ({
  label, value, delta, refYear,
}: { label: string; value: number | string; delta?: number | null; refYear?: number }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
    <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-bold">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <div className="flex items-center gap-2 mt-2">
      {delta !== null && delta !== undefined ? (
        <>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${delta >= 0 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
          <span className="text-xs text-gray-400 font-medium">vs {refYear}</span>
        </>
      ) : (
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">2020 – 2024</span>
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

// --- ADVISORY BOARD CARDS ---
const ExecutiveCard = ({ member }: { member: SeniorMember }) => {
  const roleParts = member.current_role ? member.current_role.split(" - ") : ["Executive Leadership"];
  const primaryRole = roleParts[0];
  const secondaryRole = roleParts.slice(1).join(" - ");

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group relative bg-white border border-slate-200/80 rounded-3xl shadow-lg hover:shadow-2xl hover:border-blue-500/35 transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-full items-stretch"
    >
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-cyan-500 hidden md:block" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 md:hidden" />

      <div className="relative w-full md:w-52 aspect-square md:aspect-auto shrink-0 bg-slate-50 overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center p-6">
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-700">
          <img
            src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563EB&color=fff&size=512`}
            alt={member.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-80" />
        </div>
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-100/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      <div className="p-8 flex flex-col justify-between flex-grow relative bg-white">
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-indigo-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 items-center mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-wider text-blue-700 shadow-sm">
              <Award size={12} className="text-blue-600 animate-pulse" />
              {primaryRole}
            </span>
            {secondaryRole && (
              <span className="text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                {secondaryRole}
              </span>
            )}
          </div>

          {member.linkedin_url ? (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2 group/link mb-2"
            >
              {member.name}
              <ExternalLink size={16} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-400" />
            </a>
          ) : (
            <h3 className="text-2xl font-black text-slate-900 mb-2">{member.name}</h3>
          )}

          <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-4 italic">
            "Providing academic mentorship, driving technological research, and steering the student branch toward exceptional milestones."
          </p>
        </div>

        <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-bold text-slate-600 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin size={12} />
            </div>
            <span className="truncate">{member.college || "Sri Ramakrishna Engineering College"}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Mail size={12} />
            </div>
            <a
              href={`mailto:${member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}
              className="hover:text-blue-600 transition-colors truncate"
            >
              {member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getSeniorMemberImage = (member: SeniorMember): string => {
  const dbUrl = member.image_url;
  if (dbUrl) {
    if (dbUrl.startsWith("http")) return dbUrl;
    const safePath = encodeURIComponent(dbUrl.trim());
    const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
    return data?.publicUrl;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563EB&color=fff&size=256`;
};

const AdvisoryCard = ({ member, isFeatured }: { member: SeniorMember; isFeatured: boolean }) => {
  const roleParts = member.current_role ? member.current_role.split(" - ") : ["Senior Member"];
  const primaryRole = roleParts[0];
  const secondaryRole = roleParts.slice(1).join(" - ");

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className={`group relative bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/35 transition-all duration-300 flex flex-row overflow-hidden h-full items-center p-4 gap-4 ${isFeatured ? "ring-1 ring-blue-500/10" : ""}`}
    >
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Left side: picture */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
        <img
          src={getSeniorMemberImage(member)}
          alt={member.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Right side: details */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="mb-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[9px] font-black uppercase tracking-wider text-blue-700 mb-1.5">
            {isFeatured ? (
              <Award size={10} className="text-blue-600 shrink-0" />
            ) : (
              <GraduationCap size={10} className="text-slate-650 shrink-0" />
            )}
            <span className="truncate">{primaryRole}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {member.linkedin_url ? (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-extrabold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group/link truncate"
              >
                <span className="truncate">{member.name}</span>
                <ExternalLink size={11} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-400 shrink-0" />
              </a>
            ) : (
              <h3 className="text-[15px] font-extrabold text-slate-900 truncate">{member.name}</h3>
            )}
          </div>
          {secondaryRole && (
            <p className="text-slate-500 text-[10px] font-bold mt-0.5 truncate uppercase tracking-wide">{secondaryRole}</p>
          )}
        </div>

        <div className="space-y-1 text-[11px] font-semibold text-slate-500 border-t border-slate-100 pt-2">
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-blue-500 shrink-0" />
            <span className="truncate">{member.college || "Sri Ramakrishna Engineering College"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail size={11} className="text-blue-500 shrink-0" />
            <a
              href={`mailto:${member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}
              className="hover:text-blue-600 transition-colors truncate"
            >
              {member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- OFFICE BEARERS RENDERING UTILS ---
const formatRoleDisplay = (roleText?: string) => {
  if (!roleText) return "Office Bearer";
  if (roleText.toLowerCase().includes("executive member joint")) {
    return (
      <>
        <span className="block">Executive Member</span>
        <span className="block mt-0.5 font-medium opacity-80 text-[9px] uppercase tracking-wider">Joint Activities Co-ordinator</span>
      </>
    );
  }
  return roleText;
};

const getAvatarFallback = (id: string | number) => {
  return `https://randomuser.me/api/portraits/${Number(id) % 2 === 0 ? "women" : "men"}/${(Number(id) % 99) + 1}.jpg`;
};

const getPersonImage = (person: Person): string => {
  const dbUrl = person.image_url || person.photo || person.photo_url;

  if (dbUrl) {
    if (dbUrl.startsWith("http")) return dbUrl;
    const safePath = encodeURIComponent(dbUrl.trim());
    const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
    return data?.publicUrl;
  }
  return getAvatarFallback(person.id);
};

const PersonAvatar = ({ person }: { person: Person }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(() => getPersonImage(person));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(getPersonImage(person));
    setHasError(false);
  }, [person]);

  return (
    <img
      src={imgSrc}
      alt={person.name || "Member"}
      className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-sm bg-slate-50 shrink-0"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(getAvatarFallback(person.id));
        }
      }}
    />
  );
};

const OfficeCard = ({ person }: { person: Person }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group flex flex-col bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-700 ease-in-out font-sans"
  >
    <div className="p-4 flex items-start gap-4">
      <PersonAvatar person={person} />
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[10px] uppercase font-bold tracking-widest text-[#00629b] mb-1">
          {formatRoleDisplay(person.role)}
        </p>
        <h3 className="text-[15px] font-semibold text-slate-900 truncate group-hover:text-[#00629b] transition-colors leading-tight">
          <a
            href={person.website || person.linkedin_url || person.linkedin || person.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(person.name || "")}+IEEE+SREC`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {person.name || "Unnamed"}
          </a>
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{person.department || "Engineering"}</span>
        </div>
      </div>
    </div>
    <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium truncate">
        <Mail className="h-3.5 w-3.5 shrink-0" />{" "}
        <span className="truncate">
          {person.email || `${person.name?.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}
        </span>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
    </div>
  </motion.div>
);

// --- MAIN TEAM PAGE COMPONENT ---
const TeamPage = () => {
  const CURRENT_YEAR = 2026;

  // --- DATA STATES ---
  const [seniorMembers, setSeniorMembers] = useState<SeniorMember[]>([]);
  const [officeBearers, setOfficeBearers] = useState<Person[]>([]);
  const [executiveMembers, setExecutiveMembers] = useState<Person[]>([]);
  const [memberCounts, setMemberCounts] = useState<MemberRow[]>([]);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Search & Filter States
  const [seniorSearch, setSeniorSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "leadership" | "advisory" | "others">("all");
  const [viewMode, setViewMode] = useState<"tiers" | "grid" | "directory">("tiers");

  const [officeSearch, setOfficeSearch] = useState("");
  const [selectedOfficeRole, setSelectedOfficeRole] = useState<string>("All");

  const [execSearch, setExecSearch] = useState("");

  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [analyticsSearch, setAnalyticsSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("year");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPopupYear, setSelectedPopupYear] = useState<number | null>(null);
  const [modalMembers, setModalMembers] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Memos for popup modal details
  const staffMembers = useMemo(() => {
    return modalMembers.filter((m) => m.member_type?.toLowerCase() === "staff" || m.member_type?.toLowerCase() === "professional");
  }, [modalMembers]);

  const studentMembers = useMemo(() => {
    return modalMembers.filter((m) => m.member_type?.toLowerCase() === "student" || m.member_type?.toLowerCase() === "student member" || m.member_type?.toLowerCase() === "student members");
  }, [modalMembers]);

  // Fetch yearly member directory from Supabase on-demand when year is clicked
  useEffect(() => {
    if (selectedPopupYear === null) {
      setModalMembers([]);
      return;
    }
    const fetchYearMembers = async () => {
      setModalLoading(true);
      try {
        const { data, error } = await supabase
          .from("ieee_member_directory")
          .select("*")
          .eq("year", selectedPopupYear)
          .order("s_no", { ascending: true });

        if (data && data.length > 0) {
          setModalMembers(data);
        } else if (selectedPopupYear === CURRENT_YEAR) {
          // Fallback to active memory states for CURRENT_YEAR
          const bearersList = officeBearers.map((b, idx) => {
            const isStaff = b.role?.toLowerCase().includes("counsellor") || 
                            b.role?.toLowerCase().includes("counselor") || 
                            b.role?.toLowerCase().includes("advisor");
            return {
              id: `bearer-${b.id || idx}`,
              name: b.name,
              designation_course: b.role ? `${b.role}${b.department ? ` (${b.department})` : ""}` : (b.department || ""),
              member_type: isStaff ? "Staff" : "Student",
              year: CURRENT_YEAR
            };
          });

          const execsList = executiveMembers.map((e, idx) => {
            return {
              id: `exec-${e.id || idx}`,
              name: e.name,
              designation_course: e.role ? `${e.role}${e.department ? ` (${e.department})` : ""}` : `Executive Committee Member${e.department ? ` (${e.department})` : ""}`,
              member_type: "Student",
              year: CURRENT_YEAR
            };
          });

          const combined = [...bearersList, ...execsList].map((item, idx) => ({
            ...item,
            s_no: idx + 1
          }));
          setModalMembers(combined);
        } else {
          setModalMembers([]);
        }
      } catch (err) {
        console.error("Error fetching year members:", err);
      } finally {
        setModalLoading(false);
      }
    };
    fetchYearMembers();
  }, [selectedPopupYear, officeBearers, executiveMembers]);

  // --- SUPABASE DATA FETCH ---
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [seniorsRes, bearersRes, execsRes, countsRes] = await Promise.all([
          supabase.from("senior_members").select("*").order("s_no", { ascending: true }),
          supabase.from("new_office_bearers").select("*").order("year", { ascending: false }).order("id", { ascending: true }),
          supabase.from("new_executive_members").select("*").order("year", { ascending: false }).order("id", { ascending: true }),
          supabase.from("member_counts").select("*").order("year", { ascending: false })
        ]);

        if (seniorsRes.data) setSeniorMembers(seniorsRes.data);
        if (bearersRes.data) setOfficeBearers(bearersRes.data);
        if (execsRes.data) setExecutiveMembers(execsRes.data);
        if (countsRes.data) setMemberCounts(countsRes.data);
        if (countsRes.error) setErrorMsg(countsRes.error.message);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // --- ADVISORY BOARD MEMOS ---
  const filteredSeniors = useMemo(() => {
    const term = seniorSearch.trim().toLowerCase();
    let result = seniorMembers.filter(m =>
      !term ||
      m.name.toLowerCase().includes(term) ||
      (m.current_role || "").toLowerCase().includes(term) ||
      (m.college || "").toLowerCase().includes(term)
    );

    if (selectedCategory !== "all") {
      result = result.filter(m => {
        const role = (m.current_role || "").toLowerCase();
        if (selectedCategory === "leadership") {
          return role.includes("counsellor") || role.includes("counselor");
        } else if (selectedCategory === "advisory") {
          return role.includes("advisor") || role.includes("advisory");
        } else {
          return !role.includes("counsellor") && !role.includes("counselor") && !role.includes("advisor") && !role.includes("advisory");
        }
      });
    }
    return result;
  }, [seniorMembers, seniorSearch, selectedCategory]);

  const groupedSeniors = useMemo(() => {
    const leadership: SeniorMember[] = [];
    const advisors: SeniorMember[] = [];
    const others: SeniorMember[] = [];

    filteredSeniors.forEach(m => {
      const role = (m.current_role || "").toLowerCase();
      if (role.includes("counsellor") || role.includes("counselor")) {
        leadership.push(m);
      } else if (role.includes("advisor") || role.includes("advisory")) {
        advisors.push(m);
      } else {
        others.push(m);
      }
    });

    return { leadership, advisors, others };
  }, [filteredSeniors]);

  // --- CURRENT OFFICE BEARERS MEMOS ---
  const currentBearers = useMemo(() => {
    return officeBearers.filter(b => b.year === CURRENT_YEAR || !b.year);
  }, [officeBearers]);

  const availableOfficeRoles = useMemo(() => {
    const roles = Array.from(new Set(currentBearers.map((b) => b.role?.trim()).filter((role): role is string => Boolean(role)))).sort();
    return ["All", ...roles];
  }, [currentBearers]);

  const filteredBearers = useMemo(() => {
    return currentBearers.filter((b) => {
      const matchesRole = selectedOfficeRole === "All" || b.role === selectedOfficeRole;
      const term = officeSearch.toLowerCase().trim();
      const matchesSearch = !term || (b.name || "").toLowerCase().includes(term) || (b.role || "").toLowerCase().includes(term) || (b.department || "").toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });
  }, [currentBearers, selectedOfficeRole, officeSearch]);

  const groupedBearers = useMemo(() => {
    const groups: Record<string, Person[]> = {};
    filteredBearers.forEach(b => {
      const role = (b.role || "Member").trim();
      if (!groups[role]) groups[role] = [];
      groups[role].push(b);
    });

    return Object.keys(groups)
      .sort((a, b) => getRoleWeight(a) - getRoleWeight(b))
      .map(role => ({
        role,
        members: groups[role]
      }));
  }, [filteredBearers]);

  const { counsellorGroup, otherGroups } = useMemo(() => {
    const cGroup = groupedBearers.find(g => g.role.toLowerCase().includes("counsellor") || g.role.toLowerCase().includes("counselor"));
    const oGroups = groupedBearers.filter(g => g !== cGroup);
    return { counsellorGroup: cGroup, otherGroups: oGroups };
  }, [groupedBearers]);

  // --- CURRENT EXECUTIVE MEMBERS MEMOS ---
  const currentExecutives = useMemo(() => {
    const execs = executiveMembers.filter(m => m.year === CURRENT_YEAR || !m.year);
    const term = execSearch.toLowerCase().trim();
    return execs.filter(m => !term || (m.name || "").toLowerCase().includes(term) || (m.department || "").toLowerCase().includes(term));
  }, [executiveMembers, execSearch]);


  // --- MEMBERSHIP ANALYTICS MEMOS ---
  const years = useMemo(() => [...new Set(memberCounts.map((r) => r.year))].sort((a, b) => b - a), [memberCounts]);
  const yearsAsc = useMemo(() => [...years].reverse(), [years]);
  const latestCount = memberCounts[0];
  const prevCount = memberCounts[1];
  const maxTotal = Math.max(...memberCounts.map((r) => r.total_members), 1);

  const filteredMembers = useMemo(() => {
    let r = memberCounts;
    if (selectedYear !== "all") r = r.filter((x) => x.year === Number(selectedYear));
    if (analyticsSearch) r = r.filter((x) => String(x.year).includes(analyticsSearch));
    return [...r].sort((a, b) => sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField]);
  }, [memberCounts, selectedYear, analyticsSearch, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc((p) => !p);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const csv = "Year,Professional Members,Student Members,Total Members\n"
      + filteredMembers.map((r) => `${r.year},${r.professional_members},${r.student_members},${r.total_members}`).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = "ieee_members.csv";
    a.click();
  };

  const sortedByTotal = useMemo(() => [...filteredMembers].sort((a, b) => b.total_members - a.total_members), [filteredMembers]);

  const barData = {
    labels: [...memberCounts].reverse().map((r) => r.year),
    datasets: [
      { label: "Professional", data: [...memberCounts].reverse().map((r) => r.professional_members), backgroundColor: "#185FA5", borderRadius: 4 },
      { label: "Student", data: [...memberCounts].reverse().map((r) => r.student_members), backgroundColor: "#1D9E75", borderRadius: 4 },
    ],
  };

  const donutData = latestCount ? {
    labels: ["Professional", "Student"],
    datasets: [{ data: [latestCount.professional_members, latestCount.student_members], backgroundColor: ["#185FA5", "#1D9E75"], borderWidth: 0 }],
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      {/* Ambient background designs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-8 pb-8 md:pt-10 md:pb-10 overflow-hidden bg-gradient-to-b from-blue-50 via-slate-50 to-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 backdrop-blur text-xs font-semibold text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.05)] mb-4"
          >
            <Users size={14} className="text-blue-600" />
            Our Community
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 text-slate-900"
          >
            IEEE SREC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 font-sans">Team &amp; Members</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm md:text-base text-slate-505 max-w-2xl leading-relaxed font-light"
          >
            Meet the office bearers, executive members, and distinguished advisors guiding the student branch, and explore our growth analytics.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12 relative z-10 flex-grow w-full space-y-16">
        {loading ? (
          <div className="py-24 flex flex-col items-center">
            <Loader2 className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin shadow-md" />
            <p className="mt-4 text-slate-505 text-sm font-medium tracking-wide">Fetching Team Data...</p>
          </div>
        ) : (
          <>
            {/* SECTION 1: ADVISORY BOARD */}
            <section id="advisory-board" className="space-y-8 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="text-blue-600" size={24} /> Senior Members 
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Distinguished faculty mentors guiding SREC IEEE Student Branch</p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search advisors..."
                      className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-semibold placeholder-slate-400 w-44"
                      value={seniorSearch}
                      onChange={(e) => setSeniorSearch(e.target.value)}
                    />
                  </div>

                  <select
                    aria-label="Category Filter"
                    className="bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-bold outline-none cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                  >
                    <option value="all">All Advisors</option>
                    <option value="leadership">Leadership</option>
                    <option value="advisory">Advisors</option>
                    <option value="others">Faculty Board</option>
                  </select>

                  <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                    {[{ id: "tiers", icon: Users }, { id: "grid", icon: LayoutGrid }, { id: "directory", icon: List }].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setViewMode(tab.id as any)}
                        className={`p-1.5 rounded-md transition-all ${viewMode === tab.id ? "bg-white text-blue-650 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-900"}`}
                        title={`${tab.id.toUpperCase()} View`}
                      >
                        <tab.icon size={13} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredSeniors.length === 0 ? (
                <p className="text-center text-slate-450 py-10 font-medium">No Advisory Members found matching the search criteria.</p>
              ) : (
                <div>
                  {viewMode === "tiers" && (
                    <div className="space-y-10">
                      {groupedSeniors.leadership.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Executive Leadership</h3>
                          <div className="grid grid-cols-1 gap-6 animate-fade-in">
                            {groupedSeniors.leadership.map(member => (
                              <ExecutiveCard key={member.id} member={member} />
                            ))}
                          </div>
                        </div>
                      )}
                      {groupedSeniors.advisors.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Advisory Council</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedSeniors.advisors.map(member => (
                              <AdvisoryCard key={member.id} member={member} isFeatured={true} />
                            ))}
                          </div>
                        </div>
                      )}
                      {groupedSeniors.others.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Faculty Board</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedSeniors.others.map(member => (
                              <AdvisoryCard key={member.id} member={member} isFeatured={false} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSeniors.map(member => {
                        const role = (member.current_role || "").toLowerCase();
                        return (
                          <AdvisoryCard key={member.id} member={member} isFeatured={role.includes("advisor") || role.includes("counselor")} />
                        );
                      })}
                    </div>
                  )}

                  {viewMode === "directory" && (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-left">Advisor Details</th>
                            <th className="px-6 py-4 text-left">Designation</th>
                            <th className="px-6 py-4 text-left">Institution</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSeniors.map(member => (
                            <tr key={member.id} className="border-b hover:bg-slate-50/50 transition">
                              <td className="px-6 py-4 font-semibold text-slate-900">{member.name}</td>
                              <td className="px-6 py-4 text-xs font-bold text-blue-750 uppercase">{member.current_role}</td>
                              <td className="px-6 py-4 text-xs font-medium text-slate-500">{member.college || "Sri Ramakrishna Engineering College"}</td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex gap-2 justify-center">
                                  {member.linkedin_url && (
                                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* SECTION 2: OFFICE BEARERS */}
            <section id="office-bearers" className="space-y-8 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="text-blue-600" size={24} /> Office Bearers
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Core student executive officers running branch operations</p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search office bearers..."
                      className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-semibold placeholder-slate-400 w-44"
                      value={officeSearch}
                      onChange={(e) => setOfficeSearch(e.target.value)}
                    />
                  </div>

                  <select
                    aria-label="Role Filter"
                    className="bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-bold outline-none cursor-pointer"
                    value={selectedOfficeRole}
                    onChange={(e) => setSelectedOfficeRole(e.target.value)}
                  >
                    {availableOfficeRoles.map(r => (
                      <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>
                    ))}
                  </select>

                  <Link
                    to="/past-bearers"
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold transition flex items-center gap-1.5 text-slate-655"
                  >
                    <History size={13} />
                    View Archive
                  </Link>
                </div>
              </div>

              {filteredBearers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-350 bg-white p-12 text-center">
                  <Users className="w-10 h-10 text-slate-350 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">No personnel found for {CURRENT_YEAR}</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">New office bearers will be added soon.</p>
                  <Link
                    to="/past-bearers"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-xs font-bold transition shadow-sm"
                  >
                    <History size={13} />
                    View Past Office Bearers
                  </Link>
                </div>
              ) : (
                <div>
                  {counsellorGroup && (
                    <div className="mb-10 flex flex-col items-center">
                      <div className="flex items-center justify-center w-full max-w-3xl gap-6 mb-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200"></div>
                        <h3 className="text-base font-black text-slate-900 text-center uppercase tracking-widest">{counsellorGroup.role}</h3>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200"></div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-6 w-full">
                        {counsellorGroup.members.map((b) => (
                          <div key={b.id} className="w-full sm:w-[380px] lg:w-[420px]">
                            <OfficeCard person={b} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {otherGroups.length > 0 && (
                    <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
                      {otherGroups.map((group) => (
                        <div className="relative break-inside-avoid mb-6 inline-block w-full" key={group.role}>
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#00629b]">{formatRoleDisplay(group.role)}</h3>
                            <div className="flex-1 h-px bg-slate-200"></div>
                          </div>
                          <div className="flex flex-col gap-4">
                            {group.members.map((b) => (
                              <OfficeCard key={b.id} person={b} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* SECTION 3: EXECUTIVE MEMBERS */}
            <section id="executive-members" className="space-y-8 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Star className="text-blue-600" size={24} /> Executive Members
                  </h2>
                  <p className="text-xs text-slate-505 mt-1 font-medium">Core committee members supporting operation portfolios</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search executives..."
                    className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-semibold placeholder-slate-400 w-44"
                    value={execSearch}
                    onChange={(e) => setExecSearch(e.target.value)}
                  />
                </div>
              </div>

              {currentExecutives.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-350 bg-white p-12 text-center">
                  <Users className="w-10 h-10 text-slate-350 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">No personnel found for {CURRENT_YEAR}</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">New executive members will be added soon.</p>
                  <Link
                    to="/past-bearers"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-xs font-bold transition shadow-sm"
                  >
                    <History size={13} />
                    View Past Executive Archives
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentExecutives.map((m) => (
                    <OfficeCard key={m.id} person={m} />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 4: MEMBERSHIP ANALYTICS */}
            <section id="membership-analytics" className="space-y-8 scroll-mt-24">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={24} /> Membership Analytics
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">IEEE Professional &amp; Student member analytics and historical growth</p>
              </div>

              {errorMsg && <p className="text-red-650 text-sm">Error: {errorMsg}</p>}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total members (latest)" value={latestCount?.total_members ?? "—"} delta={pct(latestCount?.total_members, prevCount?.total_members)} refYear={prevCount?.year} />
                <StatCard label="Professional members" value={latestCount?.professional_members ?? "—"} delta={pct(latestCount?.professional_members, prevCount?.professional_members)} refYear={prevCount?.year} />
                <StatCard label="Student members" value={latestCount?.student_members ?? "—"} delta={pct(latestCount?.student_members, prevCount?.student_members)} refYear={prevCount?.year} />
                <StatCard label="Years tracked" value={memberCounts.length} />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3 bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                  <p className="text-sm font-bold text-gray-500 mb-1 flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-600" />
                    Membership Growth
                  </p>
                  <p className="text-xs text-gray-400 mb-4 font-semibold">Professional vs student members by year</p>
                  <div className="h-64 relative flex items-center justify-center">
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }} />
                  </div>
                  <div className="flex gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                      <span className="w-3 h-3 rounded-sm inline-block bg-[#185FA5]" />Professional
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                      <span className="w-3 h-3 rounded-sm inline-block bg-[#1D9E75]" />Student
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                  <p className="text-sm font-bold text-gray-500 mb-1 flex items-center gap-2">
                    <Users size={16} className="text-teal-600" />
                    Member Split (Latest Year)
                  </p>
                  <p className="text-xs text-gray-400 mb-4 font-medium">Professional vs student ratio</p>
                  <div className="h-64 relative flex items-center justify-center">
                    {donutData && <Doughnut data={donutData} options={{ cutout: "68%", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />}
                  </div>
                  <div className="flex flex-col gap-1 mt-3">
                    {donutData?.labels?.map((l, i) => (
                      <span key={String(l)} className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                        <span className={`w-3 h-3 rounded-sm inline-block ${i === 0 ? "bg-[#185FA5]" : "bg-[#1D9E75]"}`} />
                        {String(l)} — {donutData.datasets[0].data[i]} ({Math.round((donutData.datasets[0].data[i] / (latestCount?.total_members || 1)) * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year:</span>
                    <select
                      aria-label="Filter by year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:border-blue-500 transition shadow-sm"
                    >
                      <option value="all">All Years</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <input
                      value={analyticsSearch}
                      onChange={(e) => setAnalyticsSearch(e.target.value)}
                      placeholder="Search year…"
                      className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 w-36 outline-none focus:border-blue-500 transition shadow-sm"
                    />
                  </div>
                  <button
                    onClick={exportCSV}
                    className="text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm hover:shadow"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>

                {filteredMembers.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">No records found.</p>
                ) : (
                  <>
                    <style>
                      {filteredMembers.map(r => {
                        const p = Math.round((r.professional_members / r.total_members) * 100);
                        const t = Math.round((r.total_members / maxTotal) * 100);
                        return `.bar-p-${r.id}{width:${p}%} .bar-s-${r.id}{width:${100 - p}%} .bar-t-${r.id}{width:${t}%}`;
                      }).join(' ')}
                    </style>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-700 text-xs font-bold uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3.5 text-left w-20">S.No.</th>
                            {(["year", "professional_members", "student_members", "total_members"] as SortField[]).map((f) => (
                              <th key={f} className="px-5 py-3.5 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => handleSort(f)}>
                                <span className="flex items-center gap-1">
                                  {f === "year" ? "Year" : f === "professional_members" ? "Professional" : f === "student_members" ? "Student" : "Total"}
                                  <span className="text-[10px] text-slate-450 font-normal">
                                    {sortField === f ? (sortAsc ? " ▲" : " ▼") : " ⇅"}
                                  </span>
                                </span>
                              </th>
                            ))}
                            <th className="px-5 py-3.5 text-left">Share</th>
                            <th className="px-5 py-3.5 text-left">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredMembers.map((row, index) => {
                            const profPct = Math.round((row.professional_members / row.total_members) * 100);
                            return (
                              <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="px-5 py-4"><RankBadge rank={index} /></td>
                                <td className="px-5 py-4">
                                  <button
                                    onClick={() => setSelectedPopupYear(row.year)}
                                    className="bg-blue-50 hover:bg-blue-100/90 text-[#0c447c] text-xs font-bold px-3 py-1 rounded-full border border-blue-100/70 hover:border-blue-200 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
                                    title="Click to view office bearers and committee directory"
                                  >
                                    <span>{row.year}</span>
                                    <span className="text-[9px] text-[#0c447c]/60">ℹ️</span>
                                  </button>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-800 w-7">{row.professional_members}</span>
                                    <div className="flex-1 h-2 bg-slate-105 rounded-full overflow-hidden min-w-[60px] md:min-w-[100px]">
                                      <div className={`h-full bg-blue-600 rounded-full bar-p-${row.id}`} />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-semibold">{profPct}%</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-800 w-7">{row.student_members}</span>
                                    <div className="flex-1 h-2 bg-slate-105 rounded-full overflow-hidden min-w-[60px] md:min-w-[100px]">
                                      <div className={`h-full bg-teal-500 rounded-full bar-s-${row.id}`} />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-semibold">{100 - profPct}%</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 font-extrabold text-blue-800 text-sm">{row.total_members}</td>
                                <td className="px-5 py-4">
                                  <div className="w-20 h-2 bg-slate-105 rounded-full overflow-hidden">
                                    <div className={`h-full bg-indigo-400 rounded-full bar-t-${row.id}`} />
                                  </div>
                                </td>
                                <td className="px-5 py-4"><TrendBars data={memberCounts} currentId={row.id} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* Year Details Modal */}
      <AnimatePresence>
        {selectedPopupYear !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-200/80"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-3.5">
                  {/* Previous Year Button */}
                  <button
                    disabled={selectedPopupYear === null || yearsAsc.indexOf(selectedPopupYear) <= 0}
                    onClick={() => {
                      const idx = selectedPopupYear !== null ? yearsAsc.indexOf(selectedPopupYear) : -1;
                      if (idx > 0) setSelectedPopupYear(yearsAsc[idx - 1]);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                    title="Previous Year"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      IEEE Members Directory - Year {selectedPopupYear}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Official record of Staff and Student Members
                    </p>
                  </div>

                  {/* Next Year Button */}
                  <button
                    disabled={selectedPopupYear === null || yearsAsc.indexOf(selectedPopupYear) >= yearsAsc.length - 1}
                    onClick={() => {
                      const idx = selectedPopupYear !== null ? yearsAsc.indexOf(selectedPopupYear) : -1;
                      if (idx !== -1 && idx < yearsAsc.length - 1) setSelectedPopupYear(yearsAsc[idx + 1]);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                    title="Next Year"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedPopupYear(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                {modalLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin" />
                    <p className="mt-2 text-slate-500 text-xs font-semibold">Loading members directory...</p>
                  </div>
                ) : modalMembers.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">No member records found for this year.</p>
                    <p className="text-xs text-gray-400 mt-1">Please populate the Supabase table <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">ieee_member_directory</code>.</p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#0C447C] text-white text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left w-20">S.No.</th>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Designation / Course</th>
                          <th className="px-4 py-3 text-left w-24">Year</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-slate-800">
                        {/* Staff Category */}
                        {staffMembers.length > 0 && (
                          <>
                            <tr className="bg-slate-50 border-y border-slate-200">
                              <td colSpan={4} className="px-4 py-2.5 text-slate-800 font-bold uppercase tracking-wider text-[11px] text-center bg-slate-100/80">
                                Staff
                              </td>
                            </tr>
                            {staffMembers.map((m, index) => (
                              <tr key={m.id || index} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                <td className="px-4 py-2.5 font-medium text-slate-500">{m.s_no || index + 1}.</td>
                                <td className="px-4 py-2.5 font-bold text-slate-900">{m.name}</td>
                                <td className="px-4 py-2.5 text-slate-600 font-medium">{m.designation_course}</td>
                                <td className="px-4 py-2.5 text-slate-500 font-medium">{m.year}</td>
                              </tr>
                            ))}
                          </>
                        )}

                        {/* Student Category */}
                        {studentMembers.length > 0 && (
                          <>
                            <tr className="bg-slate-50 border-y border-slate-200">
                              <td colSpan={4} className="px-4 py-2.5 text-slate-800 font-bold uppercase tracking-wider text-[11px] text-center bg-slate-100/80">
                                Student Members
                              </td>
                            </tr>
                            {studentMembers.map((m, index) => (
                              <tr key={m.id || index} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                <td className="px-4 py-2.5 font-medium text-slate-500">{m.s_no || (staffMembers.length + index + 1)}.</td>
                                <td className="px-4 py-2.5 font-bold text-slate-900">{m.name}</td>
                                <td className="px-4 py-2.5 text-slate-600 font-medium">{m.designation_course}</td>
                                <td className="px-4 py-2.5 text-slate-500 font-medium">{m.year}</td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-150 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setSelectedPopupYear(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition shadow-sm hover:shadow"
                >
                  Close Directory
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
