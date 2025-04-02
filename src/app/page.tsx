// app/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { useLogout } from '@/lib/logout'
import Link from 'next/link'


export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/routing/login')  // ← 未ログインならloginページへ
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const { logout } = useLogout()
  


  if (loading) return <p>読み込み中...</p>

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 sm:p-12 font-sans">
      {/* ヘッダー */}
      <header className="w-full flex justify-between items-center max-w-6xl">
        <div className="text-3xl font-bold text-purple-600">IT就労 ビズウェル</div>
        <nav className="flex space-x-4 text-pink-700 text-sm sm:text-base">
          <Link href="/" className="text-pink-700 hover:text-pink-900">
            ホーム
          </Link>
          <a href="/routing/tanto">担当者一覧</a>
          <a href="/routing/kankei">関係機関一覧</a>
          <a href="/routing/kubun">区分一覧</a>
          <a href="/routing/area">エリア一覧</a>
          <a href="#" onClick={(e) => { e.preventDefault(); logout() }}>
    ログアウト
  </a>
          <a href="/routing/shinkitouroku">新規登録</a>
        </nav>
      </header>

      {/* 認証済みユーザー表示 */}
      <p className="mt-4 text-green-600">ようこそ {user?.email} さん！</p>

      {/* 検索と新規登録 */}
      <div className="mt-6 flex items-center space-x-4">
        <button className="bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow-sm">
          新規登録
        </button>
        <input
          type="text"
          placeholder="検索"
          className="border rounded-full px-4 py-2 focus:outline-none"
        />
      </div>

      {/* メイン */}
      <main className="mt-12 bg-purple-800 text-white p-8 rounded-xl max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="bg-purple-300 text-purple-900 rounded-xl p-6 sm:w-2/3 w-full">
          <p className="mb-4 text-center font-bold">ゴヨウケンヲドウゾ・・・</p>
          <ul className="space-y-2 text-sm">
            <li>① 新規の名刺を登録したい（新規登録）</li>
            <li>② 担当者の名刺をみたい（名刺）</li>
            <li>③ 関係機関の名刺がみたい（関係機関）</li>
            <li>④ 区分分けした名刺をみたい（区分）</li>
            <li>⑤ エリア分けした名刺をみたい（エリア）</li>
            <li>⑥ おしゃべりに付き合ってほしい（暇つぶし）</li>
          </ul>
        </div>
        <div className="sm:w-1/3 w-full flex justify-center">
          <Image src="/robot.png" alt="ロボット" width={120} height={120} />
        </div>
      </main>
    </div>
  )
}
