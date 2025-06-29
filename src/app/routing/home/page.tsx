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
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6 md:p-12 font-sans">
      {/* ヘッダー */}
      <header className="w-full flex justify-center items-center max-w-6xl relative mb-4 sm:mb-8">
        <div className="flex justify-center relative z-10">
          <Image 
            src="/images/Logo1.png" 
            alt="ビズウェルロゴ" 
            width={200} 
            height={40}
            className="object-contain w-[150px] sm:w-[200px]"
          />
        </div>
      </header>

      {/* 認証済みユーザー表示 */}
      <p className="mt-2 sm:mt-4 text-green-600 text-sm sm:text-base text-center px-4">
        ようこそ {user?.email} さん！
      </p>

      {/* メイン */}
      <main className="mt-6 sm:mt-12 bg-purple-800 text-white p-4 sm:p-6 md:p-8 rounded-xl max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="bg-purple-300 text-purple-900 rounded-xl p-4 sm:p-6 w-full sm:w-2/3">
          <p className="mb-3 sm:mb-4 text-center font-bold text-sm sm:text-base">
            ご用件をどうぞ・・・
          </p>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="group">
              <a 
                href="/routing/shinkitouroku" 
                className="block p-2 rounded-lg transition-all duration-200 bg-purple-300 group-hover:bg-purple-400 group-hover:shadow-md group-hover:scale-[1.02] text-purple-900 hover:text-purple-800"
              >
                ①新規の名刺を登録したい（新規登録）
              </a>
            </li>
            <li className="group">
              <a 
                href="/routing/tanto" 
                className="block p-2 rounded-lg transition-all duration-200 bg-purple-300 group-hover:bg-purple-400 group-hover:shadow-md group-hover:scale-[1.02] text-purple-900 hover:text-purple-800"
              >
                ②担当者の名刺をみたい（担当者一覧）
              </a>
            </li>
            <li className="group">
              <a 
                href="/routing/kankei" 
                className="block p-2 rounded-lg transition-all duration-200 bg-purple-300 group-hover:bg-purple-400 group-hover:shadow-md group-hover:scale-[1.02] text-purple-900 hover:text-purple-800"
              >
                ③関係機関の名刺がみたい（関係機関一覧）
              </a>
            </li>
            <li className="group">
              <a 
                href="/routing/kubun" 
                className="block p-2 rounded-lg transition-all duration-200 bg-purple-300 group-hover:bg-purple-400 group-hover:shadow-md group-hover:scale-[1.02] text-purple-900 hover:text-purple-800"
              >
                ④区分分けした名刺をみたい（区分一覧）
              </a>
            </li>
            <li className="group">
              <a 
                href="/routing/area" 
                className="block p-2 rounded-lg transition-all duration-200 bg-purple-300 group-hover:bg-purple-400 group-hover:shadow-md group-hover:scale-[1.02] text-purple-900 hover:text-purple-800"
              >
                ⑤エリア分けした名刺をみたい（エリア一覧）
              </a>
            </li>
            <li className="group">
              <a 
                href="#" 
                className="block p-2 rounded-lg transition-all duration-200 bg-purple-300 group-hover:bg-purple-400 group-hover:shadow-md group-hover:scale-[1.02] text-purple-900 hover:text-purple-800"
              >
                ⑦おしゃべりに付き合ってほしい（暇つぶし）
              </a>
            </li>
            <li className="group">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); logout() }} 
                className="block p-2 rounded-lg transition-all duration-200 bg-purple-300 group-hover:bg-purple-400 group-hover:shadow-md group-hover:scale-[1.02] text-purple-900 hover:text-purple-800"
              >
                ⑧ログアウト
              </a>
            </li>
          </ul>
        </div>
        <div className="sm:w-1/3 w-full flex justify-center relative mt-4 sm:mt-0">
          <div className="relative z-10">
            <Image 
              src="/images/robot.png" 
              alt="ロボット" 
              width={120} 
              height={120}
              className="w-[80px] sm:w-[120px]"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
