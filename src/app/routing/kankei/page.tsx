// src/app/routing/kankei/page.tsx]
"use client"; // ← Client Component化

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from '@/lib/logout';
import Link from 'next/link';

interface Organization {
  OrganizationID: number;
  OrganizationName: string;
  Region?: { RegionName: string };
  Category?: { CategoryName: string };
  Phone: string;
  Mobile: string;
  Email: string;
}

export default function OrganizationListPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { logout } = useLogout();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch('/api/organization');
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        setOrganizations(data);
      } catch (err) {
        console.error("データ取得エラー", err);
        alert('データの取得に失敗しました');
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="p-4 bg-green-100 min-h-screen">
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

      <div className="flex items-center justify-between mb-4">
        <Button className="bg-yellow-300 text-black">新規登録</Button>
        <Button className="bg-purple-400 text-white">関係者一覧（全体）</Button>
        <input type="text" placeholder="検索" className="ml-4 px-2 py-1 border rounded" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-collapse border-blue-300">
          <thead className="bg-blue-200">
            <tr>
              <th>担当者名</th>
              <th>エリア</th>
              <th>関係機関名</th>
              <th>区分</th>
              <th>TEL</th>
              <th>携帯</th>
              <th>メール</th>
              <th>詳細・編集</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((item) => (
              <tr key={item.OrganizationID} className="text-center border-t">
                <td>{item.OrganizationName}</td>
                <td>{item.Region?.RegionName ?? "-"}</td>
                <td>{item.OrganizationName}</td>
                <td>{item.Category?.CategoryName ?? "-"}</td>
                <td>{item.Phone}</td>
                <td>{item.Mobile}</td>
                <td>{item.Email}</td>
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
