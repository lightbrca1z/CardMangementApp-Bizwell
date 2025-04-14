'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CategoryButtons() {
  return (
    <>
      {/* 機能ボタン */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/routing/shinkitouroku">
          <Button type="button" className="bg-yellow-300 text-black">新規登録</Button>
        </Link>
        <Button type="button" className="bg-purple-400 text-white">区分一覧（全体）</Button>
      </div>

      {/* フィルターボタン */}
      <div className="mb-2 space-x-2 flex flex-wrap items-center">
        <Button type="button" className="bg-blue-600 text-white">全体</Button>
        <Button type="button" className="bg-yellow-300 text-black">関係機関</Button>
        <Button type="button" className="bg-orange-300 text-black">行政</Button>
        <Button type="button" className="bg-orange-200 text-black">相談支援</Button>
        <Button type="button" className="bg-orange-100 text-black">就労支援</Button>
        <Button type="button" className="bg-red-500 text-white">企業</Button>
        <Button type="button" className="bg-red-400 text-white">就職先</Button>
        <Button type="button" className="bg-red-300 text-white">実習先</Button>
      </div>
    </>
  );
} 