'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, UserPlus } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'pending', // or 'staff'
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Account created. Await admin approval.');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm space-y-4 bg-[#111827] p-8 rounded-3xl border border-gray-800 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-green-900/20">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white">STAFF REGISTER</h1>
          <p className="text-xs text-gray-400 mt-2">
            AOI Internal Registration
          </p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="email"
          placeholder="Work Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/20 transition active:scale-95 disabled:opacity-50"
        >
          {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
        </button>
      </form>
    </div>
  );
}
