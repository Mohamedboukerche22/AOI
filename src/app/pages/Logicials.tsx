"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
// Added StickyNote to the imports as requested
import {
  MapPin,
  Plus,
  Package,
  Monitor,
  Tv,
  Radio,
  StickyNote,
  X,
  Loader2,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Helper to map string names from DB to Lucide Components
const IconRenderer = ({
  iconName,
  size = 16,
}: {
  iconName: string;
  size?: number;
}) => {
  const icons: Record<string, React.ReactNode> = {
    Monitor: <Monitor size={size} />,
    Tv: <Tv size={size} />,
    Radio: <Radio size={size} />,
    StickyNote: <StickyNote size={size} />,
    Package: <Package size={size} />,
    MapPin: <MapPin size={size} />,
  };

  // This handles case-sensitivity issues (e.g., "monitor" vs "Monitor")
  const lookup = Object.keys(icons).find(
    (key) => key.toLowerCase() === iconName?.toLowerCase()
  );
  return lookup ? icons[lookup] : <Package size={size} />; // Default to Package if not found
};

interface CampSession {
  id: string;
  title: string;
  venue: string;
  date: string;
  time_slot: "Morning" | "Afternoon";
}

const Logistics: React.FC = () => {
  const [sessions, setSessions] = useState<CampSession[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    venue: "",
    date: "",
    time_slot: "",
  });

  var today = new Date();
  console.log(today.toISOString());
  const days = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const fetchResources = async () => {
    const { data } = await supabase
      .from("technical_resources")
      .select("*")
      .order("name");
    setResources(data || []);
  };

  const fetchSessions = async () => {
    try {
      const { data } = await supabase
        .from("camp_sessions")
        .select("*")
        .order("created_at", { ascending: true });
      setSessions(data || []);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("aoi_session");
    if (saved) setCurrentUser(JSON.parse(saved));

    fetchSessions();
    fetchResources();
  }, []);

  const handleOpenModal = (day: string, slot: string) => {
    setNewSession({ title: "", venue: "", date: day, time_slot: slot });
    setIsModalOpen(true);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("camp_sessions")
      .insert([newSession])
      .select();
    if (error) {
      alert("Database Error: " + error.message);
    } else {
      setSessions([...sessions, ...data]);
      setIsModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const updateResourceCount = async (id: string, currentCount: number) => {
    if (currentUser?.role !== "admin") return;
    const newCount = prompt("Enter new quantity:", currentCount.toString());
    if (newCount === null || isNaN(parseInt(newCount))) return;

    const { error } = await supabase
      .from("technical_resources")
      .update({ count: parseInt(newCount) })
      .eq("id", id);

    if (!error) fetchResources();
    else alert("Update failed: " + error.message);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 relative">
      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">Add New Session</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSession} className="space-y-4">
              <input
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                value={newSession.title}
                onChange={(e) =>
                  setNewSession({ ...newSession, title: e.target.value })
                }
                placeholder="Session Title"
              />
              <input
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                value={newSession.venue}
                onChange={(e) =>
                  setNewSession({ ...newSession, venue: e.target.value })
                }
                placeholder="Venue Name"
              />
              <div className="flex gap-4 p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 text-xs text-blue-400 font-bold uppercase">
                {newSession.date} • {newSession.time_slot}
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  "CREATE SESSION"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TIMETABLE */}
      <div className="bg-[#111827] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50">
          <h3 className="text-xl font-black text-white">
            Camp Timetable Builder
          </h3>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-5 border-b border-gray-800 bg-gray-900/30">
            <div className="p-4 border-r border-gray-800"></div>
            {days.map((day) => (
              <div
                key={day}
                className="p-4 text-center border-r border-gray-800"
              >
                <p className="font-black text-blue-500 text-sm uppercase">
                  {new Date(day).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </p>
                <p className="text-[10px] text-gray-500 font-bold">{day}</p>
              </div>
            ))}
          </div>

          {["Morning", "Afternoon"].map((slot) => (
            <div
              key={slot}
              className="min-w-[800px] grid grid-cols-5 min-h-[180px] border-b border-gray-800 last:border-0"
            >
              <div className="p-4 flex items-center justify-center font-black text-[10px] text-gray-500 uppercase tracking-widest border-r border-gray-800 bg-gray-900/10">
                {slot}
              </div>
              {days.map((day) => (
                <div
                  key={`${day}-${slot}`}
                  className="p-3 border-r border-gray-800 last:border-0 group hover:bg-white/5 transition-colors"
                >
                  {sessions
                    .filter((s) => s.date === day && s.time_slot === slot)
                    .map((session) => (
                      <div
                        key={session.id}
                        className={`p-4 ${
                          slot === "Morning"
                            ? "bg-blue-600/10 border-blue-500/20 text-blue-400"
                            : "bg-purple-600/10 border-purple-500/20 text-purple-400"
                        } border rounded-2xl mb-2`}
                      >
                        <p className="text-xs font-black uppercase mb-2">
                          {session.title}
                        </p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                          <MapPin size={12} /> {session.venue}
                        </p>
                      </div>
                    ))}
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={() => handleOpenModal(day, slot as any)}
                      className="w-full py-4 border-2 border-dashed border-gray-800 text-gray-700 rounded-2xl hover:border-blue-500/50 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RESOURCES CARD */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
              <Package size={20} />
            </div>
            <h3 className="text-lg font-black text-white">
              Technical Resources
            </h3>
          </div>
          <div className="space-y-4">
            {resources.map((item) => (
              <div
                key={item.id}
                onClick={() => updateResourceCount(item.id, item.count)}
                className={`flex justify-between items-center p-5 bg-gray-900/50 rounded-2xl border border-gray-800 transition-all group ${
                  currentUser?.role === "admin"
                    ? "cursor-pointer hover:border-blue-500"
                    : ""
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#0a0f1a] flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition-colors">
                    {/* Using the Helper Component here */}
                    <IconRenderer iconName={item.icon_name} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{item.count}</p>
                  <p className="text-[9px] text-blue-500 font-black uppercase">
                    {currentUser?.role === "admin" ? "Edit" : "Syncing"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VENUE STATUS */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-rose-600/20 rounded-xl flex items-center justify-center text-rose-500">
              <MapPin size={20} />
            </div>
            <h3 className="text-lg font-black text-white">Venue Status</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Salle Info 1", "Salle Info 2"].map((venue, idx) => (
              <div key={idx} className="p-5 border border-gray-800 rounded-2xl">
                <p className="font-black text-sm text-white mb-2">{venue}</p>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: "70%" }}
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
