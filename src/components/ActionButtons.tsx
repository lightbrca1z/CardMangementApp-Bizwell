'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ActionButtons() {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/routing/shinkitouroku">
        <Button className="bg-yellow-300 text-black hover:bg-yellow-400">
          新規登録
        </Button>
      </Link>
      <Link href="/routing/tanto">
        <Button className="bg-purple-400 text-white hover:bg-purple-500">
          担当者一覧（全体）
        </Button>
      </Link>
    </div>
  );
} 