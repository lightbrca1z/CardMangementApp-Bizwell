"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from '@/lib/logout';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// ------------------
// Supabase初期化
// ------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ------------------
// 型定義
// ------------------
interface BusinessCard {
  businesscardid: number;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  address: string | null;
  organization: string | null;
  region: string | null;
  category: string | null;
  representative: string | null;
}

export default function BusinessCardListPage() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const { logout } = useLogout();

  useEffect(() => {
    const fetchBusinessCards = async () => {
      try {
        const { data, error } = await supabase
          .from('businesscard')
          .select(`
            businesscardid,
            phone,
            mobile,
            email,
            address,
            organization:organizationid(organizationname),
            region:regionid(regionname),
            category:categoryid(categoryname),
            representative:representativeid(representativename)
          `);
  
        if (error) throw error;
  
        const transformedData = data?.map(item => ({
          businesscardid: item.businesscardid,
          phone: item.phone,
          mobile: item.mobile,
          email: item.email,
          address: item.address,
          organization: item.organization?.organizationname || null,   // ← ★ 修正
          region: item.region?.regionname || null,                     // ← ★ 修正
          category: item.category?.categoryname || null,               // ← ★ 修正
          representative: item.representative?.representativename || null // ← ★ 修正
        })) || [];
  
        setCards(transformedData);
      } catch (err) {
        console.error("データ取得エラー", err);
        alert('データの取得に失敗しました');
      }
    };
  
    fetchBusinessCards();
  }, []);
  
  return (
    <div className="p-4 bg-green-100 min-h-screen">

      {/* ヘッダー */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700">IT就労 ビズウェル</h1>
        <nav className="flex space-x-4 text-pink-700 text-sm sm:text-base">
          <Link href="/">ホーム</Link>
          <Link href="/routing/tanto">担当者一覧</Link>
          <Link href="/routing/kankei">関係機関一覧</Link>
          <Link href="/routing/kubun">区分一覧</Link>
          <Link href="/routing/area">エリア一覧</Link>
          <Link href="#" onClick={(e) => { e.preventDefault(); logout() }}>ログアウト</Link>
          <Link href="/routing/shinkitouroku">新規登録</Link>
        </nav>
      </header>

      {/* 新規登録 */}
      <div className="flex items-center justify-between mb-4">
        <Button className="bg-yellow-300 text-black">新規登録</Button>
        <Button className="bg-purple-400 text-white">関係機関一覧（全体）</Button>
        <input type="text" placeholder="検索" className="ml-4 px-2 py-1 border rounded" />
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-collapse border-blue-300">
          <thead className="bg-blue-200">
            <tr>
              <th>関係機関名</th>
              <th>担当者名</th>
              <th>エリア</th>
              <th>区分</th>
              <th>TEL</th>
              <th>携帯</th>
              <th>メール</th>
              <th>住所</th>
              <th>詳細・編集</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((item) => (
              <tr key={item.businesscardid} className="text-center border-t">
                <td>{item.organization ?? "-"}</td>
                <td>{item.representative ?? "-"}</td>
                <td>{item.region ?? "-"}</td>
                <td>{item.category ?? "-"}</td>
                <td>{item.phone ?? "-"}</td>
                <td>{item.mobile ?? "-"}</td>
                <td>{item.email ?? "-"}</td>
                <td>{item.address ?? "-"}</td>
                <td>
                  <Button className="bg-blue-500 text-white">確認・編集</Button>
                </td>
                <td>
                  <Button className="bg-red-500 text-white">削除</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
