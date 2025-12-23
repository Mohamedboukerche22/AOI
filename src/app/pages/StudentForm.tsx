'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function StudentForm({ onSuccess }: { onSuccess: () => void }) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('students').insert([formData]);
    if (error) alert(error.message);
    else onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase">First Name (Arabic)</label>
          <input required placeholder="الاسم" className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-right" onChange={e => setFormData({...formData, first_name_ar: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase">Last Name (Arabic)</label>
          <input required placeholder="اللقب" className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-right" onChange={e => setFormData({...formData, last_name_ar: e.target.value})} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800 pt-6">
        <input required placeholder="First Name (English)" className="bg-gray-900 border border-gray-800 p-3 rounded-xl" onChange={e => setFormData({...formData, first_name_en: e.target.value})} />
        <input required placeholder="Last Name (English)" className="bg-gray-900 border border-gray-800 p-3 rounded-xl" onChange={e => setFormData({...formData, last_name_en: e.target.value})} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500">BIRTH DATE</label>
          <input required type="date" className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm" onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500">DIVISION</label>
          <select className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm" onChange={e => setFormData({...formData, division: e.target.value})}>
            <option>Div 1</option>
            <option>Div 2</option>
            <option>AOAI</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-800 pt-6">
        <h4 className="text-xs font-black text-blue-500">TECHNICAL HANDLES</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="Codeforces Username" className="bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm" onChange={e => setFormData({...formData, codeforces_username: e.target.value})} />
          <input placeholder="CSES Username" className="bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm" onChange={e => setFormData({...formData, cses_username: e.target.value})} />
          <input placeholder="Discord ID" className="bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm" onChange={e => setFormData({...formData, discord_id: e.target.value})} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-red-500">HEALTH FLAGS / ALLERGIES</label>
        <textarea placeholder="List any medical needs..." className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm h-20" onChange={e => setFormData({...formData, health_flags: e.target.value})} />
      </div>

      <button disabled={loading} className="w-full bg-blue-600 py-4 rounded-2xl font-black shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
        {loading ? 'PUSHING TO DATABASE...' : 'SAVE STUDENT RECORD'}
      </button>
    </form>
  );
}