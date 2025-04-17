'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ActionButtons() {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/routing/shinkitouroku">
        <Button className="bg-green-500 text-white hover:bg-green-600">
          新規登録
        </Button>
      </Link>
      <Link href="/routing/kankei">
        <Button className="bg-purple-400 text-white hover:bg-purple-500">
          関係機関一覧（全体）
        </Button>
      </Link>
    </div>
  );
} 