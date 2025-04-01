'use client'

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from '@/lib/logout'
import Link from 'next/link';

interface Contact {
  BusinessCardID: number;
  Category?: { CategoryName?: string | null } | null;
  Region?: { RegionName?: string | null } | null;
  Organization?: { OrganizationName?: string | null } | null;
  Representative?: { RepresentativeName?: string | null } | null;
  Phone?: string | null;
  Mobile?: string | null;
  Email?: string | null;
}

export default function CategoryListPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/contact');
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        console.error("データ取得エラー", err);
        alert('データの取得に失敗しました');
      }
    })();
  }, []);

  const { logout } = useLogout()

  return (
    <div className="p-4 bg-green-100 min-h-screen">
      {/* ヘッダー */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700">IT就労 ビズウェル</h1>
        <nav className="space-x-4 text-pink-600">
          <Link href="/">ホーム</Link>
          <Link href="/routing/tanto">担当者一覧</Link>
          <Link href="/routing/kankei">関係機関一覧</Link>
          <Link href="/routing/kubun">区分一覧</Link>
          <Link href="/routing/area">エリア一覧</Link>
          <Link href="#" onClick={(e) => { e.preventDefault(); logout() }}>ログアウト</Link>
          <Link href="/routing/shinkitouroku">新規登録</Link>
        </nav>
      </header>

      {/* ボタン・検索 */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/routing/shinkitouroku">
          <Button className="bg-yellow-300 text-black">新規登録</Button>
        </Link>
        <Link href="/routing/tanto">
          <Button className="bg-purple-400 text-white">担当者一覧（全体）</Button>
        </Link>
        <input type="text" placeholder="検索" className="ml-4 px-2 py-1 border rounded" />
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
              <tr key={item.BusinessCardID} className="text-center border-t">
                <td>{item.Category?.CategoryName || ''}</td>
                <td>{item.Region?.RegionName || ''}</td>
                <td>{item.Organization?.OrganizationName || ''}</td>
                <td>{item.Representative?.RepresentativeName || ''}</td>
                <td>{item.Phone || ''}</td>
                <td>{item.Mobile || ''}</td>
                <td>{item.Email || ''}</td>
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
