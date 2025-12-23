'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Calendar, MapPin, Package, Plus, 
  LayoutGrid, List, Monitor, Radio, Tv 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface CampSession {
  id: string;
  title: string;
  venue: string;
  date: string;
  time_slot: 'Morning' | 'Afternoon';
}

const Logistics: React.FC = () => {
  const [sessions, setSessions] = useState<CampSession[]>([]);
  const [loading, setLoading] = useState(true);
  const days = ['2024-07-15', '2024-07-16', '2024-07-17', '2024-07-18'];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await supabase.from('camp_sessions').select('*');
        setSessions(data || []);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Timetable Section */}
      <div className="bg-[#111827] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Camp Timetable Builder</h3>
            <p className="text-xs text-gray-500 font-bold uppercase mt-1">Logistics & Venue Planning</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 text-xs font-black text-gray-400 hover:bg-white/5 rounded-xl transition">WEEK VIEW</button>
            <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-900/20">DAY VIEW</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-5 border-b border-gray-800">
            <div className="p-4 bg-gray-900/30 border-r border-gray-800"></div>
            {days.map(day => (
              <div key={day} className="p-4 bg-gray-900/30 text-center border-r border-gray-800 last:border-0">
                <p className="font-black text-blue-500 text-sm uppercase">{new Date(day).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p className="text-[10px] text-gray-500 font-bold mt-1">{day}</p>
              </div>
            ))}
          </div>
          
          {/* Morning Slot */}
          <div className="min-w-[800px] grid grid-cols-5 min-h-[160px] border-b border-gray-800">
            <div className="p-4 flex items-center justify-center font-black text-[10px] text-gray-500 uppercase tracking-widest border-r border-gray-800 bg-gray-900/10">Morning</div>
            {days.map(day => (
              <div key={`${day}-morning`} className="p-3 border-r border-gray-800 last:border-0 group hover:bg-white/5 transition-colors">
                {sessions.filter(s => s.date === day && s.time_slot === 'Morning').map(session => (
                  <div key={session.id} className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl mb-2 group/item hover:border-blue-500 transition-all">
                    <p className="text-xs font-black text-blue-400 leading-tight mb-2 uppercase">{session.title}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                      <MapPin size={12} className="text-blue-500" /> {session.venue}
                    </p>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-gray-800 text-gray-700 rounded-2xl text-xs hover:border-blue-500/50 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Afternoon Slot */}
          <div className="min-w-[800px] grid grid-cols-5 min-h-[160px]">
            <div className="p-4 flex items-center justify-center font-black text-[10px] text-gray-500 uppercase tracking-widest border-r border-gray-800 bg-gray-900/10">Afternoon</div>
            {days.map(day => (
              <div key={`${day}-afternoon`} className="p-3 border-r border-gray-800 last:border-0 group hover:bg-white/5 transition-colors">
                {sessions.filter(s => s.date === day && s.time_slot === 'Afternoon').map(session => (
                  <div key={session.id} className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-2xl mb-2 hover:border-purple-500 transition-all">
                    <p className="text-xs font-black text-purple-400 leading-tight mb-2 uppercase">{session.title}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                      <MapPin size={12} className="text-purple-500" /> {session.venue}
                    </p>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-gray-800 text-gray-700 rounded-2xl text-xs hover:border-blue-500/50 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resources Card */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
              <Package size={20} />
            </div>
            <h3 className="text-lg font-black text-white">Technical Resources</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Dell Laptops (XPS)', count: 35, icon: <Monitor size={16}/> },
              { name: 'Epson Projectors', count: 4, icon: <Tv size={16}/> },
              { name: 'WiFi Routers (5G)', count: 2, icon: <Radio size={16}/> },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-5 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all group">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#0a0f1a] border border-gray-800 flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Inventory Ready</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{item.count}</p>
                  <p className="text-[9px] text-blue-500 font-black uppercase">Syncing</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Card */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-rose-600/20 rounded-xl flex items-center justify-center text-rose-500">
              <MapPin size={20} />
            </div>
            <h3 className="text-lg font-black text-white">Venue Status</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Salle Info 1', 'Salle Info 2', 'Salle Rouge', 'Auditorium'].map((venue, idx) => (
              <div key={idx} className="p-5 border border-gray-800 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-black text-sm text-white group-hover:text-blue-500 transition-colors">{venue}</p>
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
                <p className="text-[10px] text-gray-500 font-bold">Capacity: {idx % 2 === 0 ? '40' : '25'} Students</p>
                <div className="mt-4 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000" 
                    style={{ width: `${(idx + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logistics;