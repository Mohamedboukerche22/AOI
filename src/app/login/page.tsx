'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AOILOGO from '../AOI_COLOR_NLOGO_WHITE.png';
import { toast } from 'sonner';


export default function LoginPage() {
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPass }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error);

      localStorage.setItem('aoi_session', JSON.stringify(result));
      router.push('/portal');
    } catch (err: any) {
      toast.error( err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 bg-[#111827] p-8 rounded-3xl border border-gray-800 shadow-2xl"
      >
        <div className="text-center mb-6">
          <img src={AOILOGO.src} alt="AOI Logo" className="w-45 h-45 mx-auto mb-1" />
          <h1 className="text-2xl font-black text-white">AOI LOGIN</h1>
        </div>

        <input
          type="email"
          required
          placeholder="Email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={authPass}
          onChange={(e) => setAuthPass(e.target.value)}
          className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
        </button>
      </form>
    </div>
  );
}