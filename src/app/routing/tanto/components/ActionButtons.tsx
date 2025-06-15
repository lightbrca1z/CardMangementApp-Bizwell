'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ActionButtons() {
  return (
    <div className="flex items-center justify-between mb-4">
      <Link href="/routing/shinkitouroku">
        <Button className="bg-yellow-300 text-black">新規登録</Button>
      </Link>
      <Button className="bg-purple-400 text-white">担当者一覧（全体）</Button>
    </div>
  );
} 