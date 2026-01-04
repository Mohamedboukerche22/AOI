"use client";

import { UserPlus, ShieldCheck } from "lucide-react";

export default function StaffManagement({
  coaches,
  onAddCoach,
  newEmail,
  setNewEmail,
}: {
  coaches: any[];
  onAddCoach: () => void;
  newEmail: string;
  setNewEmail: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Registration Box */}
      <div className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-900/20">
        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
          <UserPlus size={24} /> Register New Coach
        </h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter coach email address..."
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none placeholder:text-blue-200 text-white focus:bg-white/20 transition"
          />

          <button
            onClick={onAddCoach}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-gray-100 transition-colors"
          >
            ADD COACH
          </button>
        </div>
      </div>

      {/* Coaches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-[#111827] border border-gray-800 p-5 rounded-3xl flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-emerald-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-bold text-white">
                {coach.full_name || "Coach"}
              </p>
              <p className="text-xs text-gray-500">{coach.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
