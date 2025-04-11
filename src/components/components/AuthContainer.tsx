'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AuthForm from './AuthForm';

export default function AuthContainer() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/routing/home');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) return <p>読み込み中...</p>;

  return <AuthForm />;
} 