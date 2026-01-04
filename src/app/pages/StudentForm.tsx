'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Loader2, User, Phone, Trophy, Heart } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function StudentForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name_ar: '', last_name_ar: '',
    first_name_en: '', last_name_en: '',
    date_of_birth: '', grade: 10,
    wilaya: 'Algiers', email: '',
    student_phone: '', parent_phone: '',
    discord_id: '', codeforces_username: '', cses_username: '',
    division: 'Div 2', health_flags: 'None'
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('students').upsert([
      initialData ? { ...formData, id: initialData.id } : formData
    ]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(initialData ? "Student updated" : "Student enrolled!");
      onSuccess();
    }
    setLoading(false);
  };

  return (
    // Added pb-32 so the keyboard doesn't hide the submit button on small screens
    <form onSubmit={handleSubmit} className="space-y-6 pb-32 md:pb-10">
      
      {/* Arabic Names Section - Right to Left friendly */}
      <div className="bg-gray-900/50 p-4 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Basic Information (AR)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required dir="rtl" value={formData.first_name_ar} placeholder="الاسم الأول" className="w-full bg-[#0a0f1a] border border-gray-800 p-4 rounded-2xl text-right text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, first_name_ar: e.target.value})} />
          <input required dir="rtl" value={formData.last_name_ar} placeholder="اللقب" className="w-full bg-[#0a0f1a] border border-gray-800 p-4 rounded-2xl text-right text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, last_name_ar: e.target.value})} />
        </div>
      </div>

      {/* English Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input required value={formData.first_name_en} placeholder="First Name (EN)" className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500" onChange={e => setFormData({...formData, first_name_en: e.target.value})} />
        <input required value={formData.last_name_en} placeholder="Last Name (EN)" className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500" onChange={e => setFormData({...formData, last_name_en: e.target.value})} />
      </div>

      {/* Critical Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 ml-2">BIRTH DATE</label>
          <input required value={formData.date_of_birth} type="date" className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl text-white color-scheme-dark" onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 ml-2">DIVISION</label>
          <select value={formData.division} className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl text-white outline-none" onChange={e => setFormData({...formData, division: e.target.value})}>
            <option>Div 1</option>
            <option>Div 2</option>
            <option>AOAI</option>
          </select>
        </div>
      </div>

      {/* Handles - Grid changes from 1 to 3 cols based on screen */}
      <div className="space-y-4 bg-gray-900/50 p-4 rounded-3xl border border-gray-800">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-yellow-500" />
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Technical Handles</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <input value={formData.codeforces_username} placeholder="Codeforces Username" className="bg-[#0a0f1a] border border-gray-800 p-4 rounded-2xl text-sm text-white" onChange={e => setFormData({...formData, codeforces_username: e.target.value})} />
          <input value={formData.discord_id} placeholder="Discord ID" className="bg-[#0a0f1a] border border-gray-800 p-4 rounded-2xl text-sm text-white" onChange={e => setFormData({...formData, discord_id: e.target.value})} />
        </div>
      </div>

      {/* Health - TextArea needs more height on mobile for thumbs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 ml-2">
           <Heart size={14} className="text-red-500" />
           <label className="text-[10px] font-bold text-red-500 uppercase">Health Flags / Allergies</label>
        </div>
        <textarea value={formData.health_flags} placeholder="Any medical conditions..." className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl text-sm h-28 text-white outline-none focus:border-red-500/50" onChange={e => setFormData({...formData, health_flags: e.target.value})} />
      </div>

      {/* Fixed-ish button for mobile */}
      <div className="fixed md:relative bottom-0 left-0 right-0 p-4 md:p-0 bg-[#111827] md:bg-transparent border-t border-gray-800 md:border-0 z-10">
        <button 
          disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-white shadow-xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : initialData ? 'UPDATE RECORD' : 'ENROLL STUDENT'}
        </button>
      </div>
    </form>
  );
}