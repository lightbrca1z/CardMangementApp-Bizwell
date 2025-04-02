'use client'

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from '@/lib/logout';

interface Contact {
  BusinessCardID: number;
  Representative?: { RepresentativeName?: string | null } | null;
  Region?: { RegionName?: string | null } | null;
  Organization?: { OrganizationName?: string | null } | null;
  Category?: { CategoryName?: string | null } | null;
  Phone?: string | null;
  Mobile?: string | null;
  Email?: string | null;
  ImageURL?: string | null; // 画像のURLを追加
}

export default function CategoryListPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { logout } = useLogout();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/contact');
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        console.log(contacts)
        setContacts(data);
      } catch (err) {
        console.error("データ取得エラー", err);
        alert('データの取得に失敗しました');
      }
    })();
  }, []);

  // ★ ポップアップ関数
  const openImagePopup = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      alert(`画像が登録されていません\nimageUrl: ${imageUrl}`);
      return;
    }

    const fixedUrl = imageUrl.startsWith('http') || imageUrl.startsWith('/uploads/')
  ? imageUrl
  : `/uploads/${imageUrl}`;

    console.log("URL:" + fixedUrl);

    const popup = window.open(
      '',
      '_blank',
      'width=600,height=800,scrollbars=yes,resizable=yes'
    );
    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>名刺画像</title>
          </head>
          <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;">
            <img src="${fixedUrl}" alt="名刺画像" style="max-width:100%;max-height:100%;" />
          </body>
        </html>
      `);
      popup.document.close();
    }
};

  return (
    <div className="p-4 bg-green-100 min-h-screen">

      {/* ヘッダー */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700">IT就労 ビズウェル</h1>
        <nav className="flex space-x-4 text-pink-700 text-sm sm:text-base">
          <a href="/">ホーム</a>
          <a href="/routing/tanto">担当者一覧</a>
          <a href="/routing/kankei">関係機関一覧</a>
          <a href="/routing/kubun">区分一覧</a>
          <a href="/routing/area">エリア一覧</a>
          <a href="#" onClick={(e) => { e.preventDefault(); logout() }}>ログアウト</a>
          <a href="/routing/shinkitouroku">新規登録</a>
        </nav>
      </header>

      {/* 新規登録 */}
      <div className="flex items-center justify-between mb-4">
        <Button className="bg-yellow-300 text-black">新規登録</Button>
        <Button className="bg-purple-400 text-white">担当者一覧（全体）</Button>
        <input type="text" placeholder="検索" className="ml-4 px-2 py-1 border rounded" />
      </div>

      {/* テーブル */}
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
            {contacts.map((item) => (
              <tr key={item.BusinessCardID} className="text-center border-t">
                <td>{item.Representative?.RepresentativeName || ''}</td>
                <td>{item.Region?.RegionName || ''}</td>
                <td>{item.Organization?.OrganizationName || ''}</td>
                <td>{item.Category?.CategoryName || ''}</td>
                <td>{item.Phone || ''}</td>
                <td>{item.Mobile || ''}</td>
                <td>{item.Email || ''}</td>
                <td>
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={() => openImagePopup(item.ImageURL)}
                  >
                    確認・編集
                  </Button>
                </td>
                <td>
                  <Button className="bg-red-500 text-white">
                    削除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
