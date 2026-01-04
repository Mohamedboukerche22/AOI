"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Plus, UserCog, LayoutDashboard, 
  Globe, Edit2, X, Settings 
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import StudentForm from "@/components/StudentForm";
import ProblemForm from "@/components/ProblemForm"; 
import StatsDashboard from "@/components/StatsDashboard"; 
import Sidebar from "@/components/Sidebar";
import Logistics from "@/components/Logistics";
import SettingsView from "@/components/SettingsView";
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "", 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AOIPortal() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [view, setView] = useState<string>("dashboard");
  const [data, setData] = useState({ students: [], problems: [], coaches: [] });
  const [modals, setModals] = useState({ student: false, problem: false });
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [newEmail, setNewEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("aoi_session");
    if (!saved) router.replace("/login");
    else {
      setCurrentUser(JSON.parse(saved));
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    try {
      const { data: st } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: pr } = await supabase
        .from("problems")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: co } = await supabase
        .from("profiles")
        .select("*")
        .eq('role', 'coach');
      
      setData({ 
        students: st || [], 
        problems: pr || [], 
        coaches: co || [] 
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch data");
    }
  };

  const handleAddCoach = async () => {
    if (!newEmail) return toast.error("Email is required");

    try {
      const { error } = await supabase.from("profiles").insert([{
        email: newEmail,
        role: "coach",
        full_name: "New Coach", 
        password: "AOI", 
      }]);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Registered! Password is: AOI");
        setNewEmail("");
        fetchAllData();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add coach");
    }
  };

  if (!currentUser) return null;
  const isAdmin = currentUser.role === "admin";

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white md:pl-64">
      {/* SIDEBAR */}
      <Sidebar 
        view={view} 
        setView={setView} 
        isAdmin={isAdmin} 
        onLogout={() => {localStorage.clear(); router.replace("/login")}} 
      />

      <main className="p-6 md:p-12 max-w-6xl mx-auto">
        {view === "dashboard" && (
          <>
            <h2 className="text-3xl font-black mb-8">Executive Overview</h2>
            <StatsDashboard 
              students={data.students} 
              problems={data.problems} 
              staffCount={data.coaches.length} 
            />
          </>
        )}

        {view === "problems" && (
          <div className="space-y-4">
            <button onClick={() => setModals({...modals, problem: true})} className="w-full bg-blue-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40">
              <Plus size={20}/> ADD NEW PROBLEM
            </button>
            {data.problems.map((p: any) => (
              <div key={p.id} className="bg-[#111827] p-6 rounded-[24px] border border-gray-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{p.title_en}</h4>
                  <p className="text-xs text-gray-500">{p.link}</p>
                </div>
                <div className="flex gap-2">
                  <div className={`w-3 h-3 rounded-full ${p.is_ar_done ? 'bg-emerald-500' : 'bg-red-500'}`} title="Arabic"/>
                  <div className={`w-3 h-3 rounded-full ${p.is_fr_done ? 'bg-emerald-500' : 'bg-red-500'}`} title="French"/>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "students" && (
          <div className="space-y-4">
            <button onClick={() => {setEditingStudent(null); setModals({...modals, student: true})}} className="w-full bg-blue-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
              <Plus size={20}/> ENROLL STUDENT
            </button>
            <div className="grid gap-4">
              {data.students.map((s: any) => (
                <div key={s.id} className="bg-[#111827] p-6 rounded-[24px] border border-gray-800 flex justify-between items-center group hover:border-blue-500/50 transition-all">
                  <div>
                    <span className="font-black text-xl block group-hover:text-blue-400">{s.full_name}</span>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.wilaya} • {s.grade}</span>
                  </div>
                  <button onClick={() => {setEditingStudent(s); setModals({...modals, student: true})}} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                    <Edit2 size={18} className="text-blue-400"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "staff" && isAdmin && (
          <div className="space-y-6">
            <div className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-900/20">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Plus/> Register Coach</h3>
              <p className="text-blue-100 text-sm mb-4 italic">Default password will be set to: AOI</p>
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Coach Email Address" 
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none text-white placeholder:text-blue-200" 
                />
                <button onClick={handleAddCoach} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-gray-100 transition-colors">
                  ADD COACH
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.coaches.map((c: any) => (
                <div key={c.id} className="bg-[#111827] border border-gray-800 p-5 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center font-black text-xl">
                    {c.full_name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="font-black text-white text-lg">{c.full_name || "Pending Coach"}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{c.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "settings" && (
          <SettingsView 
            user={currentUser} 
            onUpdate={(updatedUser) => {
              setCurrentUser(updatedUser);
              localStorage.setItem("aoi_session", JSON.stringify(updatedUser));
            }} 
          />
        )}
      </main>

      {(modals.student || modals.problem) && (
        <Modal 
          title={modals.student ? "Student Records" : "Problem Details"} 
          onClose={() => setModals({ student: false, problem: false })}
        >
          {modals.student ? (
            <StudentForm initialData={editingStudent} onSuccess={() => {setModals({...modals, student: false}); fetchAllData();}} />
          ) : (
            <ProblemForm supabase={supabase} onSuccess={() => {setModals({...modals, problem: false}); fetchAllData();}} />
          )}
        </Modal>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827]/95 backdrop-blur-md border-t border-gray-800 p-4 pb-8 flex justify-around z-50">
        <NavIcon active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<LayoutDashboard size={22}/>}/>
        <NavIcon active={view === "problems"} onClick={() => setView("problems")} icon={<Globe size={22}/>}/>
        <NavIcon active={view === "students"} onClick={() => setView("students")} icon={<Users size={22}/>}/>
        {isAdmin && <NavIcon active={view === "staff"} onClick={() => setView("staff")} icon={<UserCog size={22}/>}/>}
        <NavIcon active={view === "settings"} onClick={() => setView("settings")} icon={<Settings size={22}/>}/>
      </nav>
    </div>
  );
}

function NavIcon({ active, onClick, icon }: any) {
  return (
    <button onClick={onClick} className={`p-3 rounded-xl transition-colors ${active ? "text-blue-500 bg-blue-500/10" : "text-gray-500"}`}>
      {icon}
    </button>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-[#111827] w-full max-w-2xl rounded-[32px] p-8 border border-gray-800 relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-gray-800 rounded-full hover:bg-red-500 transition"><X size={20}/></button>
        <h3 className="text-2xl font-black mb-8">{title}</h3>
        {children}
      </div>
    </div>
  );
}
