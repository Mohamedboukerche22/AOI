
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { CampSession } from '../types';

const Logistics: React.FC = () => {
  // Use state to manage asynchronous data from storageService
  const [sessions, setSessions] = useState<CampSession[]>([]);
  const [loading, setLoading] = useState(true);
  const days = ['2024-07-15', '2024-07-16', '2024-07-17', '2024-07-18'];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await storageService.getSessions();
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
        <i className="fas fa-circle-notch fa-spin text-3xl text-emerald-600"></i>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Camp Timetable Builder</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Week View</button>
            <button className="px-4 py-2 bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-emerald-700/20">Day View</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-5 border-b border-slate-100">
            <div className="p-4 bg-slate-50 border-r border-slate-100"></div>
            {days.map(day => (
              <div key={day} className="p-4 bg-slate-50 text-center border-r border-slate-100 last:border-0">
                <p className="font-bold text-slate-800">{new Date(day).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p className="text-xs text-slate-400 mt-1">{day}</p>
              </div>
            ))}
          </div>
          
          <div className="min-w-[800px] grid grid-cols-5 min-h-[150px] border-b border-slate-100">
            <div className="p-4 flex items-center justify-center font-bold text-xs text-slate-400 uppercase tracking-widest border-r border-slate-100">Morning</div>
            {days.map(day => (
              <div key={`${day}-morning`} className="p-3 border-r border-slate-100 last:border-0 bg-white group hover:bg-slate-50/50 transition-colors">
                {sessions.filter(s => s.date === day && s.time_slot === 'Morning').map(session => (
                  <div key={session.id} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-2">
                    <p className="text-xs font-bold text-emerald-800 leading-tight">{session.title}</p>
                    <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                      <i className="fas fa-map-marker-alt"></i> {session.venue}
                    </p>
                  </div>
                ))}
                <button className="w-full py-2 border-2 border-dashed border-slate-100 text-slate-300 rounded-xl text-xs hover:border-emerald-200 hover:text-emerald-400 transition-all opacity-0 group-hover:opacity-100">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="min-w-[800px] grid grid-cols-5 min-h-[150px]">
            <div className="p-4 flex items-center justify-center font-bold text-xs text-slate-400 uppercase tracking-widest border-r border-slate-100">Afternoon</div>
            {days.map(day => (
              <div key={`${day}-afternoon`} className="p-3 border-r border-slate-100 last:border-0 bg-white group hover:bg-slate-50/50 transition-colors">
                {sessions.filter(s => s.date === day && s.time_slot === 'Afternoon').map(session => (
                  <div key={session.id} className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-2">
                    <p className="text-xs font-bold text-blue-800 leading-tight">{session.title}</p>
                    <p className="text-[10px] text-blue-600 mt-1 flex items-center gap-1">
                      <i className="fas fa-map-marker-alt"></i> {session.venue}
                    </p>
                  </div>
                ))}
                <button className="w-full py-2 border-2 border-dashed border-slate-100 text-slate-300 rounded-xl text-xs hover:border-emerald-200 hover:text-emerald-400 transition-all opacity-0 group-hover:opacity-100">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-boxes text-emerald-600"></i>
            Technical Resource Inventory
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Dell Laptops (XPS)', count: 35, type: 'PC' },
              { name: 'Epson Projectors', count: 4, type: 'AV' },
              { name: 'WiFi Routers (5G)', count: 2, type: 'Net' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                    <i className="fas fa-tools text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.type} Resource</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{item.count}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">Ready</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-map-pin text-rose-600"></i>
            Venue Management
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {['Salle Info 1', 'Salle Info 2', 'Salle Rouge', 'Auditorium'].map((venue, idx) => (
              <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-800 group-hover:text-emerald-700">{venue}</p>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <p className="text-xs text-slate-500">Capacity: {idx % 2 === 0 ? '40' : '25'} Students</p>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 w-[${(idx + 1) * 20}%]`}></div>
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