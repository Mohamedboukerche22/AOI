'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsView({ user, onUpdate }: { user: any, onUpdate: (newUser: any) => void }) {
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: This matches your requested fetch structure
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          full_name: fullName,
          newPassword: password || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update');

      // 1. Update local storage
      localStorage.setItem('aoi_session', JSON.stringify(result.user));
      
      // 2. Update the parent state (currentUser) so the Sidebar updates
      onUpdate(result.user);
      
      alert('Settings saved successfully!');
      setPassword(''); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#111827] border border-gray-800 rounded-[32px] p-8 shadow-2xl">
        <h1 className="text-3xl font-black mb-8 tracking-tight">ACCOUNT SETTINGS</h1>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">Email Address (Read Only)</label>
            <input 
              type="text" 
              disabled 
              value={user?.email} 
              className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-gray-600 cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">New Password</label>
            <input 
              type="password" 
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
            >
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
            
            <button 
              type="button"
              onClick={() => window.location.reload()} // Quick way to reset or go back to Dashboard
              className="flex-1 bg-gray-800 hover:bg-gray-700 py-4 rounded-2xl font-black transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}