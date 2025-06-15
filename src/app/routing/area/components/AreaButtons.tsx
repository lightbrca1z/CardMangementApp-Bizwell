'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AreaButtons() {
  return (
    <div className="flex items-center justify-between mb-4">
    <Link href="/routing/shinkitouroku">
      <Button type="button" className="bg-yellow-300 text-black">新規登録</Button>
    </Link>
    <Button type="button" className="bg-purple-400 text-white">エリア一覧（全体）</Button>
  </div>
  );
} 