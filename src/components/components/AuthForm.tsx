'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('Email rate limit exceeded')) {
          setErrorMsg('メール送信の制限に達しました。しばらく待ってから再試行してください。');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setErrorMsg('パスワードは6文字以上である必要があります。');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setSuccessMsg('確認メールを送信しました。メールをご確認ください。');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setErrorMsg('予期せぬエラーが発生しました。');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('メールアドレスまたはパスワードが正しくありません。');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('メールアドレスが確認されていません。確認メールをご確認ください。');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setSuccessMsg('ログインしました！');
        router.push('/routing/home');
      }
    } catch (error) {
      setErrorMsg('予期せぬエラーが発生しました。');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 font-sans">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">ビズウェル ログイン</h1>

      <form className="bg-purple-100 p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <div>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="bg-pink-300 text-purple-900 px-4 py-2 rounded-full shadow-sm hover:bg-pink-400 transition disabled:opacity-50"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow-sm hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {isLoading ? '登録中...' : '新規登録'}
          </button>
        </div>
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
            {successMsg}
          </div>
        )}
      </form>
    </div>
  );
} 