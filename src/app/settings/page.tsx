'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {toast} from "sonner";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load user session on mount
  useEffect(() => {
    const session = localStorage.getItem('aoi_session');
    if (!session) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      setFullName(parsedUser.full_name || '');
    }
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
      if (!res.ok) throw new Error(result.error);

      // Update local storage with new info
      localStorage.setItem('aoi_session', JSON.stringify(result.user));
      toast.success('Settings saved successfully!');
      setPassword(''); 
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-[#0a0f1a] text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-8">
      <div className="max-w-2xl mx-auto bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black mb-6">ACCOUNT SETTINGS</h1>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address (Cannot change)</label>
            <input 
              type="text" 
              disabled 
              value={user.email} 
              className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">New Password (Leave blank to keep current)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
            
            <button 
              type="button"
              onClick={() => router.push('/portal')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 py-4 rounded-2xl font-bold transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}