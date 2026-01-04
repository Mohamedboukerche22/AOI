import { LayoutDashboard, Globe, Users, UserCog, LogOut } from "lucide-react";

export default function Sidebar({ view, setView, isAdmin,Package, onLogout }: any) {
  const NavBtn = ({ id, icon, label }: any) => (
    <button 
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
        view === id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-gray-500 hover:bg-white/5"
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#111827] border-r border-gray-800 p-6 flex-col">
      <div className="mb-10 text-blue-500 font-black text-xl flex items-center gap-3">
         <div className="w-9 h-9 bg-blue-600 rounded-lg text-white flex items-center justify-center font-black">A</div>
         <span className="tracking-tighter">AOI 2026</span>
      </div>
      
      <nav className="space-y-1 flex-1">
        <NavBtn id="dashboard" icon={<LayoutDashboard size={20}/>} label="Stats" />
        <NavBtn id="problems" icon={<Globe size={20}/>} label="Problems" />
        <NavBtn id="students" icon={<Users size={20}/>} label="Students" />
        {isAdmin && <NavBtn id="staff" icon={<UserCog size={20}/>} label="Staff" />}
      </nav>

      <button onClick={onLogout} className="flex items-center gap-3 p-4 text-gray-500 hover:text-red-400 font-bold mt-auto border-t border-gray-800 pt-6">
        <LogOut size={20}/> <span>Exit Portal</span>
      </button>
    </aside>
  );
}