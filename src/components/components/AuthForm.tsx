'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setSuccessMsg('');
    } else {
      setSuccessMsg('アカウント作成が完了しました！');
      setErrorMsg('');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setSuccessMsg('');
    } else {
      setSuccessMsg('ログインできました！');
      setErrorMsg('');
      router.push('/routing/home');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 font-sans">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Supabase Auth サンプル</h1>

      <form className="bg-purple-100 p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <div>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleSignIn}
            className="bg-pink-300 text-purple-900 px-4 py-2 rounded-full shadow-sm hover:bg-pink-400 transition"
          >
            サインイン
          </button>
          <button
            onClick={handleSignUp}
            className="bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow-sm hover:bg-yellow-300 transition"
          >
            サインアップ
          </button>
        </div>
        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
      </form>
    </div>
  );
} 