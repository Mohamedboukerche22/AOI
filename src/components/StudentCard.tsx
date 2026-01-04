import { User, MapPin, Edit2 } from "lucide-react";

export default function StudentCard({ student, onEdit }: any) {
  return (
    <div className="bg-[#111827] p-6 rounded-[28px] border border-gray-800 flex justify-between items-center hover:border-blue-500/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
          <User size={24} />
        </div>
        <div>
          {/* Displaying the Full Name here */}
          <h4 className="text-lg font-black text-white tracking-tight leading-none mb-1 group-hover:text-blue-400 transition-colors">
            {student.full_name}
          </h4>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
            <MapPin size={12} className="text-gray-600" />
            <span>{student.wilaya}</span>
            <span className="text-gray-800">•</span>
            <span className="text-blue-400/80">{student.grade}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => onEdit(student)}
        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
      >
        <Edit2 size={18} className="text-gray-300" />
      </button>
    </div>
  );
}