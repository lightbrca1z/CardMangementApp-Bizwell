// app/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const router = useRouter()

  // ✅ セッション確認して、自動遷移 or ログインフォーム
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // すでにログインしてたら /home にリダイレクト
        router.push('/')
      } else {
        // 未ログインならフォームを表示する
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  // サインアップ
  const handleSignUp = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setErrorMsg(error.message)
      setSuccessMsg('')
    } else {
      setUser(data.user)
      setSuccessMsg('アカウント作成が完了しました！')
      setErrorMsg('')
    }
  }

  // サインイン
  const handleSignIn = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
      setSuccessMsg('')
    } else {
      setUser(data.user)
      setSuccessMsg('ログインできました！')
      setErrorMsg('')
      router.push('/') // ← サインイン成功時に /home に遷移
    }
  }

  // ローディング中
  if (loading) return <p>読み込み中...</p>

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
  )
}
