// app/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { useLogout } from '@/components/components/logout'
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
        router.push('/')  // ← 未ログインならloginページへ
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
      <header className="w-full flex justify-center items-center max-w-6xl">
        <div className="flex justify-center">
          <Image 
            src="/images/logo.png" 
            alt="ビズウェルロゴ" 
            width={200} 
            height={80}
            className="object-contain"
          />
        </div>
      </header>

      {/* 認証済みユーザー表示 */}
      <p className="mt-4 text-green-600">ようこそ {user?.email} さん！</p>

      {/* メイン */}
      <main className="mt-12 bg-purple-800 text-white p-8 rounded-xl max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="bg-purple-300 text-purple-900 rounded-xl p-6 sm:w-2/3 w-full">
          <p className="mb-4 text-center font-bold">ゴヨウケンヲドウゾ・・・</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/routing/shinkitouroku">①新規の名刺を登録したい（新規登録）</a></li>
            <li><a href="/routing/tanto">②担当者の名刺をみたい（担当者一覧）</a></li>
            <li><a href="/routing/kankei">③関係機関の名刺がみたい（関係機関一覧）</a></li>
            <li><a href="/routing/kubun">④区分分けした名刺をみたい（区分一覧）</a></li>
            <li><a href="/routing/area">⑤エリア分けした名刺をみたい（エリア一覧）</a></li>
            <li><a href="#">⑦おしゃべりに付き合ってほしい（暇つぶし）</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); logout() }}>
            ⑧ログアウト</a></li>
          </ul>
        </div>
        <div className="sm:w-1/3 w-full flex justify-center">
          <Image src="/images/robot.png" alt="ロボット" width={120} height={120} />
        </div>
      </main>
    </div>
  )
}
