'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {Users,Home,LogOut,X,MapPin,Plus,UserCog,LayoutDashboard,} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import StudentForm from '../pages/StudentForm';

/*
// Declaring 
*/
type Student = {
  id: string;
  first_name_ar: string;
  last_name_ar: string;
  first_name_en: string;
  last_name_en: string;
  wilaya: string;
  health_flags?: string;
  created_at?: string;
};

//const [students, setStudents] = useState<Student[]>([]);


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AOIPortal() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'students' | 'staff'>('dashboard');
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const router = useRouter();

  // Check session
  useEffect(() => {
    const saved = localStorage.getItem('aoi_session');
    if (!saved) router.replace('/login');
    else setCurrentUser(JSON.parse(saved));
  }, []);

  // Fetch students when view is 'students'
  /*const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    setStudents(data || []);
  };*/
  const fetchStudents = async () => {
  const { data } = await supabase
    .from<Student>('students')
    .select('*')
    .order('created_at', { ascending: false });

  setStudents(data || []);
};

  useEffect(() => {
    if (view === 'students') fetchStudents();
  }, [view]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white pb-24 md:pb-0 md:pl-64">

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#111827] border-r border-gray-800 p-6 flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">A</div>
          <span className="font-black text-xl tracking-tight">AOI PORTAL</span>
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition ${view==='dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 text-gray-400'}`}>
            <LayoutDashboard size={20} />
            <span className="font-bold">Dashboard</span>
          </button>
          <button onClick={() => setView('students')} className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition ${view==='students' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 text-gray-400'}`}>
            <Users size={20} />
            <span className="font-bold">Students</span>
          </button>
          {currentUser?.role === 'admin' && (
            <button onClick={() => setView('staff')} className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition ${view==='staff' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 text-gray-400'}`}>
              <UserCog size={20} />
              <span className="font-bold">Staff Management</span>
            </button>
          )}
        </nav>
        <button onClick={() => { localStorage.clear(); router.replace('/login'); }} className="flex items-center space-x-3 p-4 text-gray-500 hover:text-red-400 font-bold transition">
          <LogOut size={20}/>
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4">
        <h2 className="text-xl font-black capitalize">{view}</h2>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-black">
          {currentUser?.full_name?.charAt(0)}
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6 md:p-12 max-w-6xl mx-auto">
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black capitalize tracking-tight">{view}</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold leading-none">{currentUser?.full_name}</p>
              <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest mt-1">{currentUser?.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black shadow-lg">
              {currentUser?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Students View */}
        {view === 'students' && (
          <div className="space-y-6">
            <button onClick={() => setShowStudentModal(true)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-black flex items-center justify-center shadow-xl shadow-blue-900/20 transition-all active:scale-95">
              <Plus size={22} className="mr-2"/>
              ADD NEW STUDENT
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((s: any) => (
                <div key={s.id} className="bg-[#111827] p-6 rounded-3xl border border-gray-800 flex justify-between items-start hover:border-blue-500/50 transition-all group">
                  <div>
                    <h4 className="font-bold text-lg">{s.first_name_ar} {s.last_name_ar}</h4>
                    <p className="text-xs text-gray-500 mt-1">{s.first_name_en} {s.last_name_en}</p>
                    <div className="flex items-center space-x-2 mt-4 text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md w-fit">
                      <MapPin size={10} />
                      <span>{s.wilaya}</span>
                    </div>
                  </div>
                  {s.health_flags && s.health_flags !== 'None' && (
                    <div className="bg-red-500/20 p-2 rounded-xl text-red-500">
                      <Heart size={22} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
          <div className="bg-[#111827] w-full md:max-w-3xl h-[95vh] md:h-auto rounded-t-3xl md:rounded-3xl p-6 md:p-8 overflow-y-auto relative">
            <button onClick={() => setShowStudentModal(false)} className="absolute right-6 top-6">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black mb-6">Enrollment Form</h3>
            <StudentForm onSuccess={() => { setShowStudentModal(false); fetchStudents(); }} />
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827]/80 backdrop-blur-xl border-t border-gray-800 p-4 flex justify-around items-center z-40">
        <Home onClick={() => setView('dashboard')} className={`${view==='dashboard' ? 'text-blue-500 scale-110' : 'text-gray-500'} transition`} />
        <Users onClick={() => setView('students')} className={`${view==='students' ? 'text-blue-500 scale-110' : 'text-gray-500'} transition`} />
        <LogOut onClick={() => { localStorage.clear(); router.replace('/login'); }} className="text-gray-500" />
      </nav>
    </div>
  );
}
