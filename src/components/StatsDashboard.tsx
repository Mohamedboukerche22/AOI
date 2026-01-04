// components/StatsDashboard.tsx
import { Users, UserCog, Globe, CheckCircle } from "lucide-react";

export default function StatsDashboard({ students, problems, staffCount }: any) {
  // Calculate translated problems (where all 3 languages are done)
  const fullyTranslated = problems.filter((p: any) => p.is_en_done && p.is_fr_done && p.is_ar_done).length;

  const stats = [
    { label: "Students", value: students.length, icon: <Users />, color: "text-blue-500" },
    { label: "Coaches", value: staffCount, icon: <UserCog />, color: "text-purple-500" },
    { label: "Total Problems", value: problems.length, icon: <Globe />, color: "text-emerald-500" },
    { label: "Fully Translated", value: fullyTranslated, icon: <CheckCircle />, color: "text-orange-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#111827] border border-gray-800 p-6 rounded-[24px]">
          <div className={`${stat.color} mb-3`}>{stat.icon}</div>
          <div className="text-2xl font-black">{stat.value}</div>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}