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
            src="/images/logo.png" 
            alt="ビズウェルロゴ" 
            width={200} 
            height={80}
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
            <li className="hover:bg-purple-400 rounded p-1 transition-colors">
              <a href="/routing/shinkitouroku" className="block">
                ①新規の名刺を登録したい（新規登録）
              </a>
            </li>
            <li className="hover:bg-purple-400 rounded p-1 transition-colors">
              <a href="/routing/tanto" className="block">
                ②担当者の名刺をみたい（担当者一覧）
              </a>
            </li>
            <li className="hover:bg-purple-400 rounded p-1 transition-colors">
              <a href="/routing/kankei" className="block">
                ③関係機関の名刺がみたい（関係機関一覧）
              </a>
            </li>
            <li className="hover:bg-purple-400 rounded p-1 transition-colors">
              <a href="/routing/kubun" className="block">
                ④区分分けした名刺をみたい（区分一覧）
              </a>
            </li>
            <li className="hover:bg-purple-400 rounded p-1 transition-colors">
              <a href="/routing/area" className="block">
                ⑤エリア分けした名刺をみたい（エリア一覧）
              </a>
            </li>
            <li className="hover:bg-purple-400 rounded p-1 transition-colors">
              <a href="#" className="block">
                ⑦おしゃべりに付き合ってほしい（暇つぶし）
              </a>
            </li>
            <li className="hover:bg-purple-400 rounded p-1 transition-colors">
              <a href="#" onClick={(e) => { e.preventDefault(); logout() }} className="block">
                ⑧ログアウト
              </a>
            </li>
          </ul>
        </div>
        <div className="sm:w-1/3 w-full flex justify-center relative mt-4 sm:mt-0">
          <div className="absolute z-0 -top-[20%] left-0 w-full h-full">
            <Image 
              src="/images/吹き出し画像.png" 
              alt="吹き出し背景" 
              width={1000} 
              height={1000}
              className="object-contain w-full h-full"
            />
          </div>
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
