import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Activity, Users, Settings, Briefcase, FileText, Banknote, ShieldCheck, Image as ImageIcon, LayoutDashboard, LogOut, TrendingUp } from "lucide-react";

type ActivityRow = {
  id: number;
  s_no: number;
  event: string;
  date: string | null;
  chief_guest: string | null;
  participants: string | null;
  image_url: string | null;
};

type MemberRow = {
  id: number;
  year: number;
  professional_members: number;
  student_members: number;
  total_members: number;
};

type OfficeBearer = {
  id: number;
  name: string;
  role: string;
  department: string | null;
  academic_year: string | null;
  year: number;
  group_name: string | null;
  image_url: string | null;
};

type AnnualPlan = {
  id: number;
  s_no: number;
  event: string;
  sub_event: string | null;
  schedule: string;
};

type FundingSubmission = {
  id: number;
  title: string;
  submission_type: string;
  description: string | null;
  budget_amount: number | null;
  contact_email: string | null;
};

type SeniorMember = {
  id: number;
  name: string;
  s_no: number | null;
  current_role: string | null;
  college: string | null;
  linkedin_url: string | null;
  image_url: string | null;
};



const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "activities" | "office" | "members" | "plans" | "funding" | "senior">("overview");

  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [officeRows, setOfficeRows] = useState<OfficeBearer[]>([]);
  const [memberRows, setMemberRows] = useState<MemberRow[]>([]);
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>([]);
  const [fundingRequests, setFundingRequests] = useState<FundingSubmission[]>([]);
  const [seniorMembers, setSeniorMembers] = useState<SeniorMember[]>([]);


  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [editingOfficeId, setEditingOfficeId] = useState<number | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editingFundingId, setEditingFundingId] = useState<number | null>(null);
  const [editingSeniorId, setEditingSeniorId] = useState<number | null>(null);


  const [activityForm, setActivityForm] = useState({
    s_no: "",
    event: "",
    date: "",
    chief_guest: "",
    participants: "",
    image_url: "",
  });

  const [officeForm, setOfficeForm] = useState({
    name: "",
    role: "",
    department: "",
    academic_year: "2025-2026",
    year: "2025",
    group_name: "IEEE SB",
    image_url: "",
  });

  const [memberForm, setMemberForm] = useState({
    year: "2025",
    professional_members: "",
    student_members: "",
    total_members: "",
  });

  const [planForm, setPlanForm] = useState({
    s_no: "",
    event: "",
    sub_event: "",
    schedule: "",
  });

  const [fundingForm, setFundingForm] = useState({
    title: "",
    submission_type: "Annual Plan",
    description: "",
    budget_amount: "",
    contact_email: "",
  });

  const [seniorForm, setSeniorForm] = useState({
    name: "",
    s_no: "",
    current_role: "",
    college: "",
    linkedin_url: "",
    image_url: "",
  });



  const fetchActivities = async () => {
    setActivitiesLoading(true);
    setActivitiesError("");

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("s_no", { ascending: true });

    if (error) {
      setActivitiesError(error.message);
      setActivities([]);
    } else {
      setActivities(data || []);
    }

    setActivitiesLoading(false);
  };

  const fetchOfficeBearers = async () => {
    const { data } = await supabase
      .from("office_bearers")
      .select("*")
      .order("year", { ascending: false })
      .order("id", { ascending: true });

    setOfficeRows(data || []);
  };

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("member_counts")
      .select("*")
      .order("year", { ascending: false });

    setMemberRows(data || []);
  };

  const fetchAnnualPlans = async () => {
    const { data } = await supabase.from("annual_plan").select("*").order("s_no", { ascending: true });
    setAnnualPlans(data || []);
  };

  const fetchFundingRequests = async () => {
    const { data } = await supabase.from("funding_submissions").select("*").order("id", { ascending: false });
    setFundingRequests(data || []);
  };

  const fetchSeniorMembers = async () => {
    const { data } = await supabase.from("senior_members").select("*").order("s_no", { ascending: true });
    setSeniorMembers(data || []);
  };



  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localAdmin = sessionStorage.getItem("admin_auth");
      if (!session && localAdmin !== "true") {
        navigate("/admin-login");
      }
    };
    checkAuth();
    fetchActivities();
    fetchOfficeBearers();
    fetchMembers();
    fetchAnnualPlans();
    fetchFundingRequests();
    fetchSeniorMembers();

  }, [navigate]);

  const resetActivityForm = () => {
    setEditingActivityId(null);
    setActivityForm({
      s_no: "",
      event: "",
      date: "",
      chief_guest: "",
      participants: "",
      image_url: "",
    });
  };

  const resetOfficeForm = () => {
    setEditingOfficeId(null);
    setOfficeForm({
      name: "",
      role: "",
      department: "",
      academic_year: "2025-2026",
      year: "2025",
      group_name: "IEEE SB",
      image_url: "",
    });
  };

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemberForm({
      year: "2025",
      professional_members: "",
      student_members: "",
      total_members: "",
    });
  };

  const resetPlanForm = () => {
    setEditingPlanId(null);
    setPlanForm({ s_no: "", event: "", sub_event: "", schedule: "" });
  };

  const resetFundingForm = () => {
    setEditingFundingId(null);
    setFundingForm({ title: "", submission_type: "Annual Plan", description: "", budget_amount: "", contact_email: "" });
  };

  const resetSeniorForm = () => {
    setEditingSeniorId(null);
    setSeniorForm({ name: "", s_no: "", current_role: "", college: "", linkedin_url: "", image_url: "" });
  };



  const submitActivity = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      s_no: Number(activityForm.s_no),
      event: activityForm.event.trim(),
      date: activityForm.date.trim() || null,
      chief_guest: activityForm.chief_guest.trim() || null,
      participants: activityForm.participants.trim() || null,
      image_url: activityForm.image_url.trim() || null,
    };

    if (!payload.s_no || !payload.event) {
      alert("S.No and Event are required");
      return;
    }

    if (editingActivityId) {
      const { error } = await supabase
        .from("activities")
        .update(payload)
        .eq("id", editingActivityId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("activities").insert([payload]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    resetActivityForm();
    fetchActivities();
  };

  const submitOffice = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: officeForm.name.trim(),
      role: officeForm.role.trim(),
      department: officeForm.department.trim() || null,
      academic_year: officeForm.academic_year.trim() || null,
      year: Number(officeForm.year),
      group_name: officeForm.group_name.trim() || "IEEE SB",
      image_url: officeForm.image_url.trim() || null,
    };

    if (editingOfficeId) {
      const { data, error } = await supabase.from("office_bearers").update(payload).eq("id", editingOfficeId).select();
      if (error) { alert("Error: " + error.message); return; }
      if (!data || data.length === 0) {
        alert("UPDATE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
        return;
      }
    } else {
      const { error } = await supabase.from("office_bearers").insert([payload]);
      if (error) {
        alert("Failed to insert office bearer: " + error.message);
        console.error(error);
        return;
      }
    }

    resetOfficeForm();
    fetchOfficeBearers();
  };

  const submitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      year: Number(memberForm.year),
      professional_members: Number(memberForm.professional_members),
      student_members: Number(memberForm.student_members),
      total_members: Number(memberForm.total_members),
    };
    if (editingMemberId) {
      const { error } = await supabase.from("member_counts").update(payload).eq("id", editingMemberId);
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("member_counts").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetMemberForm();
    fetchMembers();
  };

  const deleteActivity = async (id: number) => {
    const ok = window.confirm("Delete this activity?");
    if (!ok) return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchActivities();
  };

  const deleteOffice = async (id: number) => {
    const ok = window.confirm("Delete this office bearer?");
    if (!ok) return;
    const { data, error } = await supabase.from("office_bearers").delete().eq("id", id).select();
    if (error) { alert("Error: " + error.message); return; }
    if (!data || data.length === 0) {
      alert("DELETE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
      return;
    }
    fetchOfficeBearers();
  };

  const deleteMember = async (id: number) => {
    const ok = window.confirm("Delete this member count?");
    if (!ok) return;
    const { error } = await supabase.from("member_counts").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchMembers();
  };

  const submitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      s_no: Number(planForm.s_no),
      event: planForm.event,
      sub_event: planForm.sub_event || null,
      schedule: planForm.schedule,
    };
    if (editingPlanId) {
      const { error } = await supabase.from("annual_plan").update(payload).eq("id", editingPlanId);
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("annual_plan").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetPlanForm();
    fetchAnnualPlans();
  };

  const submitFunding = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: fundingForm.title,
      submission_type: fundingForm.submission_type,
      description: fundingForm.description || null,
      budget_amount: Number(fundingForm.budget_amount) || null,
      contact_email: fundingForm.contact_email || null,
    };
    if (editingFundingId) {
      const { error } = await supabase.from("funding_submissions").update(payload).eq("id", editingFundingId);
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("funding_submissions").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetFundingForm();
    fetchFundingRequests();
  };

  const deletePlan = async (id: number) => {
    const ok = window.confirm("Delete this annual plan?");
    if (!ok) return;
    const { error } = await supabase.from("annual_plan").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchAnnualPlans();
  };

  const deleteFunding = async (id: number) => {
    const ok = window.confirm("Delete this funding request?");
    if (!ok) return;
    const { error } = await supabase.from("funding_submissions").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchFundingRequests();
  };

  const submitSenior = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: seniorForm.name,
      s_no: Number(seniorForm.s_no) || null,
      current_role: seniorForm.current_role || null,
      college: seniorForm.college || null,
      linkedin_url: seniorForm.linkedin_url || null,
      image_url: seniorForm.image_url || null,
    };
    if (editingSeniorId) {
      const { error } = await supabase.from("senior_members").update(payload).eq("id", editingSeniorId);
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("senior_members").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetSeniorForm();
    fetchSeniorMembers();
  };

  const deleteSenior = async (id: number) => {
    const ok = window.confirm("Delete this senior member?");
    if (!ok) return;
    const { error } = await supabase.from("senior_members").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchSeniorMembers();
  };



  const filteredActivities = useMemo(() => {
    const q = activitySearch.trim().toLowerCase();
    if (!q) return activities;

    return activities.filter((item) =>
      [
        item.s_no?.toString(),
        item.event,
        item.date,
        item.chief_guest,
        item.participants,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [activities, activitySearch]);

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "activities", label: "Activities", icon: <Activity size={18} /> },
    { id: "office", label: "Office Bearers", icon: <Briefcase size={18} /> },
    { id: "members", label: "Members", icon: <Users size={18} /> },
    { id: "plans", label: "Annual Plans", icon: <FileText size={18} /> },
    { id: "funding", label: "Funding", icon: <Banknote size={18} /> },
    { id: "senior", label: "Senior Members", icon: <ShieldCheck size={18} /> },

  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />

      <div className="flex flex-1 w-full mx-auto justify-center max-w-[1600px]">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[260px] xl:w-[280px] bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto shrink-0 shadow-sm z-30">
          <div className="px-6 py-8">
            <h1 className="text-xl xl:text-2xl font-black tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-2">ADMIN PORTAL</h1>
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0b3b8f]">
              <Settings size={14} /> System Control
            </p>
          </div>
          <nav className="flex-1 px-4 space-y-1.5 pb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as "overview" | "activities" | "office" | "members" | "plans" | "funding" | "senior"); window.scrollTo({ top: 0, behavior: "smooth"}); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#0b3b8f] text-white shadow-md shadow-[#0b3b8f]/20 scale-[1.02]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#0b3b8f]"
                }`}
              >
                {tab.icon} <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-100 sticky bottom-0 bg-white">
             <Link
              to="/"
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-red-50 text-red-600 border border-red-100 px-5 py-3 font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} /> Exit Admin
            </Link>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <div className="flex-1 w-full min-w-0 flex flex-col relative">
          {/* MOBILE NAV HORIZONTAL */}
          <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-3 py-3 shadow-sm">
             <nav className="flex overflow-x-auto gap-2 scrollbar-hide snap-x">
               {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as "overview" | "activities" | "office" | "members" | "plans" | "funding" | "senior"); window.scrollTo({ top: 0, behavior: "smooth"}); }}
                    className={`flex whitespace-nowrap items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition snap-start border ${
                      activeTab === tab.id
                        ? "bg-[#0b3b8f] text-white border-[#0b3b8f] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
               ))}
             </nav>
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-[1200px] mx-auto pb-20">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-blue-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-3 text-blue-600"><Activity size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Activities</p>
                        <h3 className="text-2xl font-bold text-slate-800">{activities.length}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-indigo-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-indigo-100 p-3 text-indigo-600"><Briefcase size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Office Bearers</p>
                        <h3 className="text-2xl font-bold text-slate-800">{officeRows.length}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-sky-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-sky-100 p-3 text-sky-600"><ShieldCheck size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Senior Members</p>
                        <h3 className="text-2xl font-bold text-slate-800">{seniorMembers.length}</h3>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-emerald-100 p-3 text-emerald-600"><Users size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Member Track Records</p>
                        <h3 className="text-2xl font-bold text-slate-800">{memberRows.length}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-amber-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-amber-100 p-3 text-amber-600"><FileText size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Annual Plans</p>
                        <h3 className="text-2xl font-bold text-slate-800">{annualPlans.length}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-rose-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-rose-100 p-3 text-rose-600"><Banknote size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Funding Requests</p>
                        <h3 className="text-2xl font-bold text-slate-800">{fundingRequests.length}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0b3b8f] to-indigo-800 p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><TrendingUp size={24} className="text-cyan-400" /> Welcome to your IEEE Dashboard</h2>
                    <p className="text-blue-100 max-w-2xl">Use the navigation menu on the left to add, edit, or remove website content. Any changes made here are instantly synced and published to the live website database.</p>
                    <div className="mt-8 flex gap-4">
                      <button onClick={() => setActiveTab("activities")} className="bg-white text-[#0b3b8f] px-6 py-2.5 rounded-lg font-bold shadow hover:bg-slate-50 transition flex items-center gap-2">
                        <Activity size={18} /> Post New Activity
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                    <ShieldCheck size={250} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activities" && (
              <div className="space-y-8">
                <form onSubmit={submitActivity} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingActivityId ? "Edit Activity" : "Add New Activity"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <input
                      type="number"
                      placeholder="S.No"
                      value={activityForm.s_no}
                      onChange={(e) => setActivityForm({ ...activityForm, s_no: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Event"
                      value={activityForm.event}
                      onChange={(e) => setActivityForm({ ...activityForm, event: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Date"
                      value={activityForm.date}
                      onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />

                    <input
                      type="text"
                      placeholder="Chief Guest / Organizer"
                      value={activityForm.chief_guest}
                      onChange={(e) => setActivityForm({ ...activityForm, chief_guest: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />

                    <input
                      type="text"
                      placeholder="Participants"
                      value={activityForm.participants}
                      onChange={(e) => setActivityForm({ ...activityForm, participants: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />

                    <input
                      type="text"
                      placeholder="Image URL"
                      value={activityForm.image_url}
                      onChange={(e) => setActivityForm({ ...activityForm, image_url: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingActivityId ? "Update Activity" : "Add Activity"}
                    </button>

                    {editingActivityId && (
                      <button
                        type="button"
                        onClick={resetActivityForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-2xl font-bold text-[#0b3b8f]">Activity Records</h3>

                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-full rounded-lg border px-4 py-3 md:w-80"
                    />
                  </div>

                  {activitiesLoading && <p className="text-slate-500">Loading activities...</p>}
                  {!activitiesLoading && activitiesError && (
                    <p className="text-red-600">Error: {activitiesError}</p>
                  )}
                  {!activitiesLoading && !activitiesError && filteredActivities.length === 0 && (
                    <p className="text-slate-500">No activities found.</p>
                  )}

                  {!activitiesLoading && !activitiesError && filteredActivities.length > 0 && (
                    <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-left">S.No</th>
                            <th className="px-4 py-3 text-left">Event</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Chief Guest</th>
                            <th className="px-4 py-3 text-left">Participants</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredActivities.map((row) => (
                            <tr key={row.id} className="border-b hover:bg-slate-50">
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.s_no}</td>
                              <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.event}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.date || "-"}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.chief_guest || "-"}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.participants || "-"}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingActivityId(row.id);
                                      setActivityForm({
                                        s_no: String(row.s_no),
                                        event: row.event || "",
                                        date: row.date || "",
                                        chief_guest: row.chief_guest || "",
                                        participants: row.participants || "",
                                        image_url: row.image_url || "",
                                      });
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteActivity(row.id)}
                                    className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "office" && (
              <div className="space-y-8">
                <form onSubmit={submitOffice} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingOfficeId ? "Edit Office Bearer" : "Add Office Bearer"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={officeForm.name}
                      onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={officeForm.role}
                      onChange={(e) => setOfficeForm({ ...officeForm, role: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Department"
                      value={officeForm.department}
                      onChange={(e) => setOfficeForm({ ...officeForm, department: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="number"
                      placeholder="Year"
                      value={officeForm.year}
                      onChange={(e) => setOfficeForm({ ...officeForm, year: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="Academic Year (e.g., 2025-2026)"
                      value={officeForm.academic_year}
                      onChange={(e) => setOfficeForm({ ...officeForm, academic_year: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={officeForm.image_url}
                      onChange={(e) => setOfficeForm({ ...officeForm, image_url: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="Group Name"
                      value={officeForm.group_name}
                      onChange={(e) => setOfficeForm({ ...officeForm, group_name: e.target.value })}
                      className="rounded-lg border px-4 py-3 md:col-span-2"
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingOfficeId ? "Update" : "Add"}
                    </button>
                    {editingOfficeId && (
                      <button
                        type="button"
                        onClick={resetOfficeForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Year</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officeRows.map((row) => (
                        <tr key={row.id} className="border-b">
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.name}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.role}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.department}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.year}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingOfficeId(row.id);
                                  setOfficeForm({
                                    name: row.name,
                                    role: row.role,
                                    department: row.department || "",
                                    academic_year: row.academic_year || "",
                                    year: String(row.year),
                                    group_name: row.group_name || "IEEE SB",
                                    image_url: row.image_url || "",
                                  });
                                }}
                                className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteOffice(row.id)}
                                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "members" && (
              <div className="space-y-8">
                <form onSubmit={submitMember} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingMemberId ? "Edit Member Count" : "Add Member Count"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <input
                      type="number"
                      placeholder="Year"
                      value={memberForm.year}
                      onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Professional Members"
                      value={memberForm.professional_members}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, professional_members: e.target.value })
                      }
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Student Members"
                      value={memberForm.student_members}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, student_members: e.target.value })
                      }
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Total Members"
                      value={memberForm.total_members}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, total_members: e.target.value })
                      }
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingMemberId ? "Update" : "Add"}
                    </button>
                    {editingMemberId && (
                      <button
                        type="button"
                        onClick={resetMemberForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">Year</th>
                        <th className="px-4 py-3 text-left">Professional</th>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberRows.map((row) => (
                        <tr key={row.id} className="border-b">
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.year}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.professional_members}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.student_members}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.total_members}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingMemberId(row.id);
                                  setMemberForm({
                                    year: String(row.year),
                                    professional_members: String(row.professional_members),
                                    student_members: String(row.student_members),
                                    total_members: String(row.total_members),
                                  });
                                }}
                                className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMember(row.id)}
                                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "plans" && (
              <div className="space-y-8">
                <form onSubmit={submitPlan} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingPlanId ? "Edit Annual Plan" : "Add Annual Plan"}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="number"
                      placeholder="S.No"
                      value={planForm.s_no}
                      onChange={(e) => setPlanForm({ ...planForm, s_no: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Event"
                      value={planForm.event}
                      onChange={(e) => setPlanForm({ ...planForm, event: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Sub Event (Optional)"
                      value={planForm.sub_event}
                      onChange={(e) => setPlanForm({ ...planForm, sub_event: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="Schedule"
                      value={planForm.schedule}
                      onChange={(e) => setPlanForm({ ...planForm, schedule: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingPlanId ? "Update" : "Add"}
                    </button>
                    {editingPlanId && (
                      <button type="button" onClick={resetPlanForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">S.No</th>
                        <th className="px-4 py-3 text-left">Event</th>
                        <th className="px-4 py-3 text-left">Sub Event</th>
                        <th className="px-4 py-3 text-left">Schedule</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annualPlans.map((row) => (
                        <tr key={row.id} className="border-b">
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.s_no}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.event}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.sub_event || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.schedule}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button onClick={() => {
                                setEditingPlanId(row.id);
                                setPlanForm({ s_no: String(row.s_no), event: row.event, sub_event: row.sub_event || "", schedule: row.schedule });
                              }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                              <button onClick={() => deletePlan(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "funding" && (
              <div className="space-y-8">
                <form onSubmit={submitFunding} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingFundingId ? "Edit Funding Request" : "Add Funding Request"}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={fundingForm.title}
                      onChange={(e) => setFundingForm({ ...fundingForm, title: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <select
                      aria-label="Submission Type"
                      value={fundingForm.submission_type}
                      onChange={(e) => setFundingForm({ ...fundingForm, submission_type: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    >
                      <option value="Annual Plan">Annual Plan</option>
                      <option value="Event Funding">Event Funding</option>
                      <option value="Special Project">Special Project</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Budget Amount (Rs)"
                      value={fundingForm.budget_amount}
                      onChange={(e) => setFundingForm({ ...fundingForm, budget_amount: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Contact Email"
                      value={fundingForm.contact_email}
                      onChange={(e) => setFundingForm({ ...fundingForm, contact_email: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={fundingForm.description}
                      onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })}
                      className="rounded-lg border px-4 py-3 md:col-span-2"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingFundingId ? "Update" : "Add"}
                    </button>
                    {editingFundingId && (
                      <button type="button" onClick={resetFundingForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Budget</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fundingRequests.map((row) => (
                        <tr key={row.id} className="border-b">
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.title}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.submission_type}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">Rs. {row.budget_amount}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.contact_email}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button onClick={() => {
                                setEditingFundingId(row.id);
                                setFundingForm({
                                  title: row.title,
                                  submission_type: row.submission_type,
                                  description: row.description || "",
                                  budget_amount: String(row.budget_amount || ""),
                                  contact_email: row.contact_email || ""
                                });
                              }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                              <button onClick={() => deleteFunding(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "senior" && (
              <div className="space-y-8">
                <form onSubmit={submitSenior} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingSeniorId ? "Edit Senior Member" : "Add Senior Member"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={seniorForm.name}
                      onChange={(e) => setSeniorForm({ ...seniorForm, name: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="S.No"
                      value={seniorForm.s_no}
                      onChange={(e) => setSeniorForm({ ...seniorForm, s_no: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Current Role (e.g. Software Engineer)"
                      value={seniorForm.current_role}
                      onChange={(e) => setSeniorForm({ ...seniorForm, current_role: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="College"
                      value={seniorForm.college}
                      onChange={(e) => setSeniorForm({ ...seniorForm, college: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={seniorForm.linkedin_url}
                      onChange={(e) => setSeniorForm({ ...seniorForm, linkedin_url: e.target.value })}
                      className="rounded-lg border px-4 py-3 md:col-span-2"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={seniorForm.image_url}
                      onChange={(e) => setSeniorForm({ ...seniorForm, image_url: e.target.value })}
                      className="rounded-lg border px-4 py-3 md:col-span-2"
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingSeniorId ? "Update Member" : "Add Member"}
                    </button>
                    {editingSeniorId && (
                      <button
                        type="button"
                        onClick={resetSeniorForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">S.No</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">College</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seniorMembers.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-slate-50">
                          <td className="px-5 py-3.5 text-sm font-bold text-[#0b3b8f]">{row.s_no}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.name}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.current_role || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.college || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingSeniorId(row.id);
                                  setSeniorForm({
                                    name: row.name,
                                    s_no: row.s_no ? String(row.s_no) : "",
                                    current_role: row.current_role || "",
                                    college: row.college || "",
                                    linkedin_url: row.linkedin_url || "",
                                    image_url: row.image_url || "",
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm("Delete this senior member?")) deleteSenior(row.id);
                                }}
                                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;