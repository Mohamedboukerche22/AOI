'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('aoi_session');
    router.replace(session ? '/portal' : '/login');
  }, []);

  return null;
}
