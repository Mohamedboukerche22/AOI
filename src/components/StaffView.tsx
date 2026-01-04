// components/StaffView.tsx
import { UserPlus, ShieldCheck, Trash2 } from "lucide-react";

export default function StaffView({ coaches, onAdd, email, setEmail }: any) {
  return (
    <div className="space-y-6">
      {/* 1. The "Add Coach" Card */}
      <div className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-900/20">
        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
          <UserPlus size={24} /> Add New Coach
        </h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="coach-email@example.com" 
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none text-white placeholder:text-blue-200 focus:bg-white/20 transition" 
          />
          <button 
            onClick={onAdd}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-gray-100 transition-colors"
          >
            REGISTER
          </button>
        </div>
      </div>

      {/* 2. The "Coach List" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coaches.map((coach: any) => (
          <div key={coach.id} className="bg-[#111827] border border-gray-800 p-5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-white">{coach.full_name}</p>
                <p className="text-xs text-gray-500">{coach.email}</p>
              </div>
            </div>
            {/* Optional: Delete button */}
            <button className="text-gray-600 hover:text-red-500 p-2 transition">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}