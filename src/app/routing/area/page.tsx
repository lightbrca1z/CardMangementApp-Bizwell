"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from '@/lib/logout';
import Link from 'next/link';

export default function AreaListPage() {
  const data = [
    {
      category: "行政機関",
      area: "新宿区",
      organization: "新宿区役所",
      name: "青山 ◯◯（仮）",
      tel: "00-0000-0000",
      mobile: "00-0000-0000",
      email: "JJJJJJJ@gmail.com",
    },
  ];

  const { logout } = useLogout();
  

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
        <Button className="bg-purple-400 text-white">エリア一覧（全体）</Button>
        <input
          type="text"
          placeholder="検索"
          className="ml-4 px-2 py-1 border rounded"
        />
      </div>

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
            {data.map((item, index) => (
              <tr key={index} className="text-center border-t">
                <td>{item.category}</td>
                <td>{item.area}</td>
                <td>{item.organization}</td>
                <td>{item.name}</td>
                <td>{item.tel}</td>
                <td>{item.mobile}</td>
                <td>{item.email}</td>
                <td>
                  <Button className="bg-blue-500 text-white">確認・編集</Button>
                </td>
                <td>
                  <Button className="bg-red-500 text-white">削除</Button>
                </td>
              </tr>
            ))}
            {[...Array(4)].map((_, idx) => (
              <tr key={`empty-${idx}`} className="text-center border-t h-12">
                <td colSpan={9}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
