'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient"; // ← 必ず supabaseClient を用意しておく

export interface Contact {
  id: number;
  kubun: string;
  area: string;
  kankei: string;
  tanto: string;
  tel: string;
  mobile: string;
  email: string;
}

export default function CategoryListPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // --- データ取得 ---
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, kubun, area, kankei, tanto, tel, mobile, email')
        .order('id', { ascending: true });

      if (error) {
        console.error("データ取得エラー", error);
      } else {
        setContacts(data || []);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-green-100 min-h-screen">
      {/* ヘッダー */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700">IT就労 ビズウェル</h1>
        <nav className="space-x-4 text-pink-600">
        <a href="/">ホーム</a>
        <a href="/routing/tanto">担当者一覧</a>
        <a href="/routing/kankei">関係機関一覧</a>
        <a href="/routing/kubun">区分一覧</a>
        <a href="/routing/area">エリア一覧</a>
        <a href="/routing/login">ログイン</a>
        <a href="/routing/shinkitouroku">新規登録</a>
        </nav>
      </header>

      {/* ボタン・検索 */}
      <div className="flex items-center justify-between mb-4">
        <Button className="bg-yellow-300 text-black">新規登録</Button>
        <Button className="bg-purple-400 text-white">担当者一覧（全体）</Button>
        <input type="text" placeholder="検索" className="ml-4 px-2 py-1 border rounded" />
      </div>

      {/* カテゴリボタン */}
      <div className="mb-2 space-x-2 flex flex-wrap items-center">
        <Button className="bg-blue-600 text-white">全体</Button>
        <Button className="bg-yellow-300 text-black">関係機関</Button>
        <Button className="bg-orange-300 text-black">行政</Button>
        <Button className="bg-orange-200 text-black">相談支援</Button>
        <Button className="bg-orange-100 text-black">就労支援</Button>
        <Button className="bg-red-500 text-white">企業</Button>
        <Button className="bg-red-400 text-white">就職先</Button>
        <Button className="bg-red-300 text-white">実習先</Button>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-collapse border-blue-300">
          <thead className="bg-blue-200">
            <tr>
              <th>区分</th>
              <th>エリア</th>
              <th>関係機関名</th>
              <th>担当者</th>
              <th>TEL</th>
              <th>携帯</th>
              <th>メール</th>
              <th>詳細・編集</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item.id} className="text-center border-t">
                <td>{item.kubun}</td>
                <td>{item.area}</td>
                <td>{item.kankei}</td>
                <td>{item.tanto}</td>
                <td>{item.tel}</td>
                <td>{item.mobile}</td>
                <td>{item.email}</td>
                <td><Button className="bg-blue-500 text-white">確認・編集</Button></td>
                <td><Button className="bg-red-500 text-white">削除</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
