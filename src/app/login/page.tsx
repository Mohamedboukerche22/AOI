'use client';

import AOILOGO from '../AOI_COLOR_NLOGO_WHITE.png';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function LoginPage() {
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', authEmail)
        .single();

      if (error || !user) throw new Error('User not found');

      const valid = await bcrypt.compare(authPass, user.password_hash);
      if (!valid) throw new Error('Wrong password');

      const session = {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      };

      localStorage.setItem('aoi_session', JSON.stringify(session));
      router.push('/portal');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 bg-[#111827] p-8 rounded-3xl border border-gray-800 shadow-2xl"
      >
        <div className="text-center mb-6">
          <img
            src={AOILOGO.src}
            alt="AOI Logo"
            className="w-45 h-45 mx-auto mb-1"
          />
          <h1 className="text-2xl font-black text-white">AOI LOGIN</h1>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={authPass}
          onChange={(e) => setAuthPass(e.target.value)}
          className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl">
          SIGN IN
        </button>
      </form>
    </div>
  );
}
