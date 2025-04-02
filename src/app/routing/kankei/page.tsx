// src/app/routing/kankei/page.tsx]
"use client"; // ← Client Component化

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogout } from "@/lib/logout";

// ---------------------------
// ▼ 型定義
// ---------------------------
interface BusinessCardData {
  BusinessCardID: number;
  Representative?: { RepresentativeName: string };
  Region?: { RegionName: string };
  Organization?: { OrganizationName: string };
  Category?: { CategoryName: string };
  Phone: string;
  Mobile: string;
  Email: string;
}

// ---------------------------
// ▼ Server Component
// ---------------------------
export default async function CategoryListPage() {
  const data = await prisma.businessCard.findMany({
    include: {
      Category: true,
      Region: true,
      Organization: true,
      Representative: true,
    },
  });

  return <ClientComponent data={data} />;
}

// ---------------------------
// ▼ Client Component
// ---------------------------
function ClientComponent({ data }: { data: BusinessCardData[] }) {

  const { logout } = useLogout();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="p-4 bg-green-100 min-h-screen">
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
            {data.map((item) => (
              <tr key={item.BusinessCardID} className="text-center border-t">
                <td>{item.Representative?.RepresentativeName ?? "-"}</td>
                <td>{item.Region?.RegionName ?? "-"}</td>
                <td>{item.Organization?.OrganizationName ?? "-"}</td>
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
