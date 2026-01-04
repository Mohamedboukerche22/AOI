'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from 'sonner';
import {
  MapPin, Plus, Package, Monitor, Tv, Radio,
  StickyNote, X, Loader2, Save, Calendar, 
  Trash2, ChevronRight, Layout
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const IconRenderer = ({ iconName, size = 18 }: { iconName: string; size?: number }) => {
  const icons: Record<string, React.ReactNode> = {
    Monitor: <Monitor size={size} />,
    Tv: <Tv size={size} />,
    Radio: <Radio size={size} />,
    StickyNote: <StickyNote size={size} />,
    Package: <Package size={size} />,
    MapPin: <MapPin size={size} />,
  };
  const lookup = Object.keys(icons).find(k => k.toLowerCase() === iconName?.toLowerCase());
  return lookup ? icons[lookup] : <Package size={size} />;
};

export default function Logistics() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // States for Editing
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [tempCount, setTempCount] = useState<string>("");
  const [newVenueName, setNewVenueName] = useState("");

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({ title: "", venue: "", date: "", time_slot: "" });

  const today = new Date();
  const days = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    const saved = localStorage.getItem("aoi_session");
    if (saved) setCurrentUser(JSON.parse(saved));
    
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchSessions(), fetchResources(), fetchVenues()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchResources = async () => {
    const { data } = await supabase.from("technical_resources").select("*").order("name");
    setResources(data || []);
  };

  const fetchSessions = async () => {
    const { data } = await supabase.from("camp_sessions").select("*").order("created_at", { ascending: true });
    setSessions(data || []);
  };

  const fetchVenues = async () => {
    const { data } = await supabase.from("venues").select("*").order("name");
    setVenues(data || []);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data, error } = await supabase.from("camp_sessions").insert([newSession]).select();
    
    if (error) {
      toast.error(error.message);
    } else {
      setSessions([...sessions, ...data]);
      setIsModalOpen(false);
      toast.success("Session added to timetable");
    }
    setIsSubmitting(false);
  };

  const saveNewCount = async (id: string) => {
    const countVal = parseInt(tempCount);
    if (isNaN(countVal)) return toast.error("Enter a valid number");
    const { error } = await supabase.from('technical_resources').update({ count: countVal }).eq('id', id);
    if (!error) {
      toast.success("Quantity updated");
      setEditingResourceId(null);
      fetchResources();
    } else toast.error("Update failed");
  };

  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim()) return;
    const { error } = await supabase.from("venues").insert([{ name: newVenueName }]);
    if (error) toast.error("Venue already exists");
    else {
      toast.success("Venue added");
      setNewVenueName("");
      fetchVenues();
    }
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase.from('camp_sessions').delete().eq('id', id);
    if (!error) {
      setSessions(sessions.filter(s => s.id !== id));
      toast.success("Session removed");
    }
  };

  const deleteVenue = async (id: string) => {
    const { error } = await supabase.from('venues').delete().eq('id', id);
    if (!error) {
      toast.success("Venue removed");
      fetchVenues();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <Loader2 className="animate-spin text-blue-500" size={40} />
      <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em]">Synchronizing Portal...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. TIMETABLE BUILDER */}
      <section className="bg-[#111827] rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/20">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <Calendar className="text-blue-500" /> TIMETABLE
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-5 bg-gray-900/40 border-b border-gray-800">
              <div className="p-6"></div>
              {days.map(day => (
                <div key={day} className="p-6 text-center border-l border-gray-800">
                  <span className="block text-blue-500 font-black text-xs uppercase tracking-widest">
                    {new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-white font-bold text-lg">{new Date(day).getDate()}</span>
                </div>
              ))}
            </div>

            {["Morning", "Afternoon"].map((slot) => (
              <div key={slot} className="grid grid-cols-5 border-b border-gray-800 last:border-0">
                <div className="p-6 bg-gray-900/10 flex items-center justify-center border-r border-gray-800">
                  <span className="font-black text-[10px] text-gray-600 uppercase tracking-widest">{slot}</span>
                </div>
                {days.map((day) => (
                  <div key={`${day}-${slot}`} className="p-4 border-r border-gray-800 last:border-0 min-h-[180px] hover:bg-white/[0.01] transition-colors group/cell">
                    {sessions.filter(s => s.date === day && s.time_slot === slot).map(session => (
                      <div key={session.id} className="relative group/item mb-3 last:mb-0 animate-in zoom-in-95 duration-200">
                        <div className={`p-4 rounded-2xl border ${slot === 'Morning' ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-purple-500/5 border-purple-500/20 text-purple-400'}`}>
                          <p className="text-[11px] font-black uppercase mb-1">{session.title}</p>
                          <div className="flex items-center gap-1 text-[10px] opacity-70 font-bold">
                            <MapPin size={10} /> {session.venue}
                          </div>
                        </div>
                        {currentUser?.role === 'admin' && (
                          <button onClick={() => deleteSession(session.id)} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/item:opacity-100 transition-all shadow-lg"><X size={10} /></button>
                        )}
                      </div>
                    ))}
                    {currentUser?.role === "admin" && (
                      <button 
                        onClick={() => {setNewSession({ ...newSession, date: day, time_slot: slot }); setIsModalOpen(true);}}
                        className="w-full py-4 border-2 border-dashed border-gray-800 text-gray-700 rounded-2xl hover:border-blue-500/50 hover:text-blue-500 opacity-0 group-hover/cell:opacity-100 transition-all flex items-center justify-center"
                      >
                        <Plus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INVENTORY */}
        <section className="bg-[#111827] rounded-[2rem] border border-gray-800 p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500"><Package size={24} /></div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Technical Resources</h3>
          </div>
          <div className="space-y-3">
            {resources.map((item) => (
              <div key={item.id} className={`group flex justify-between items-center p-4 bg-gray-900/30 rounded-3xl border transition-all duration-300 ${editingResourceId === item.id ? "border-blue-500 bg-blue-500/5" : "border-gray-800"}`}>
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${editingResourceId === item.id ? "bg-blue-600 text-white" : "bg-[#0a0f1a] text-gray-500"}`}><IconRenderer iconName={item.icon_name} /></div>
                  <div>
                    <p className="text-sm font-black text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.category}</p>
                  </div>
                </div>
                {editingResourceId === item.id ? (
                  <div className="flex items-center gap-2">
                    <input autoFocus type="number" className="w-16 bg-[#0a0f1a] border border-blue-500 rounded-xl px-2 py-1.5 text-right text-white font-black outline-none" value={tempCount} onChange={(e) => setTempCount(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveNewCount(item.id)} />
                    <button onClick={() => saveNewCount(item.id)} className="p-2 bg-blue-600 text-white rounded-xl"><Save size={16} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <p className="text-2xl font-black text-white tabular-nums">{item.count}</p>
                    {currentUser?.role === 'admin' && (
                      <button onClick={() => {setEditingResourceId(item.id); setTempCount(item.count.toString());}} className="p-2 bg-gray-800 text-gray-500 hover:text-white rounded-xl"><ChevronRight size={16} /></button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* VENUE STATUS (DYNAMIZED) */}
        <section className="bg-[#111827] rounded-[2rem] border border-gray-800 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-500"><MapPin size={24} /></div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Venue Allocation</h3>
            </div>
          </div>

          <div className="space-y-4">
            {currentUser?.role === 'admin' && (
              <form onSubmit={handleAddVenue} className="flex gap-2 mb-6 p-2 bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl">
                <input className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none" placeholder="Add Venue (e.g. Lab 04)..." value={newVenueName} onChange={(e) => setNewVenueName(e.target.value)} />
                <button type="submit" className="bg-rose-600 hover:bg-rose-700 p-3 rounded-2xl text-white transition-all"><Plus size={18} /></button>
              </form>
            )}

            {venues.map((venue) => {
              const count = sessions.filter(s => s.venue === venue.name).length;
              const percent = Math.min(count * 25, 100);
              return (
                <div key={venue.id} className="group p-5 bg-gray-900/30 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-sm text-white">{venue.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-rose-500 uppercase">{percent}% Busy</span>
                      {currentUser?.role === 'admin' && (
                        <button onClick={() => deleteVenue(venue.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${percent > 75 ? 'bg-rose-600' : 'bg-blue-600'}`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. SESSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Schedule Session</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddSession} className="space-y-5">
              <input required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none" value={newSession.title} onChange={(e) => setNewSession({ ...newSession, title: e.target.value })} placeholder="Session Title" />
              
              <select 
                required 
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none appearance-none"
                value={newSession.venue}
                onChange={(e) => setNewSession({ ...newSession, venue: e.target.value })}
              >
                <option value="">Select Venue</option>
                {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>

              <div className="flex gap-4 p-4 bg-blue-600/5 rounded-2xl border border-blue-500/20 text-[10px] text-blue-400 font-black uppercase tracking-widest justify-center">
                {newSession.date} | {newSession.time_slot}
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "CREATE SESSION"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}