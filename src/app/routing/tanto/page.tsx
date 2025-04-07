'use client'

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from '@/lib/logout';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// -----------------
// Supabase 初期化
// -----------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// -----------------
// 型定義
// -----------------
interface Contact {
  businesscardid: number;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
  representative?: { representativename: string } | null;
  region?: { regionname: string } | null;
  organization?: { organizationname: string } | null;
  category?: { categoryname: string } | null;
}

export default function CategoryListPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { logout } = useLogout();

  // ---------------------
  // データ取得
  // ---------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
        .from('businesscard')
        .select(`
          businesscardid,
          phone,
          mobile,
          email,
          imageurl,
          representative:representativeid ( representativename ),
          region:regionid ( regionname ),
          organization:organizationid ( organizationname ),
          category:categoryid ( categoryname )
        `);
          

        if (error) throw error;
        if (!data) throw new Error('データが取得できませんでした');

        setContacts(data);
      } catch (err) {
        console.error("データ取得エラー", err);
        alert('データの取得に失敗しました');
      }
    };

    fetchData();
  }, []);

  // ---------------------
  // ポップアップ
  // ---------------------
  const openImagePopup = async (imageurl: string | null | undefined) => {
    if (!imageurl) {
      alert('画像が登録されていません');
      return;
    }

    const publicUrlPrefix = "https://zfvgwjtrdozgdxugkxtt.supabase.co/storage/v1/object/public/images/";
    if (!imageurl.startsWith(publicUrlPrefix)) {
      alert('imageurlの形式が不正です');
      return;
    }

    const path = imageurl.replace(publicUrlPrefix, "");
    const { data, error } = await supabase.storage.from('images').createSignedUrl(path, 60 * 60);
    if (error || !data?.signedUrl) {
      alert('署名付きURLの取得に失敗しました');
      return;
    }

    const popup = window.open('', '_blank', 'width=600,height=800,scrollbars=yes,resizable=yes');
    if (popup) {
      popup.document.write(`
        <html>
          <head><title>名刺画像</title></head>
          <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;">
            <img src="${data.signedUrl}" alt="名刺画像" style="max-width:100%;max-height:100%;" />
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
          <Link href="/">ホーム</Link>
          <Link href="/routing/tanto">担当者一覧</Link>
          <Link href="/routing/kankei">関係機関一覧</Link>
          <Link href="/routing/kubun">区分一覧</Link>
          <Link href="/routing/area">エリア一覧</Link>
          <Link href="#" onClick={(e) => { e.preventDefault(); logout(); }}>ログアウト</Link>
          <Link href="/routing/shinkitouroku">新規登録</Link>
        </nav>
      </header>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-collapse border-blue-300">
          <thead className="bg-blue-200">
            <tr>
              <th>担当者名</th>
              <th>エリア名</th>
              <th>関係機関名</th>
              <th>区分名</th>
              <th>TEL</th>
              <th>携帯</th>
              <th>メール</th>
              <th>詳細・編集</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item.businesscardid} className="text-center border-t">
                <td>{item.representative?.representativename ?? "-"}</td>
                <td>{item.region?.regionname ?? "-"}</td>
                <td>{item.organization?.organizationname ?? "-"}</td>
                <td>{item.category?.categoryname ?? "-"}</td>

                <td>{item.phone ?? "-"}</td>
                <td>{item.mobile ?? "-"}</td>
                <td>{item.email ?? "-"}</td>
                <td>
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={() => openImagePopup(item.imageurl)}
                  >
                    確認・編集
                  </Button>
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
