import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user data (excluding the password hash)
    const session = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    };

    return NextResponse.json(session);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}