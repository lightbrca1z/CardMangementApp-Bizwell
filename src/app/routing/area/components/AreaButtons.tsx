'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AreaButtons() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex space-x-2">
        <Button className="bg-blue-500 text-white">全件</Button>
        <Button className="bg-green-500 text-white">医療機関</Button>
        <Button className="bg-yellow-500 text-white">福祉施設</Button>
        <Button className="bg-purple-500 text-white">行政機関</Button>
      </div>
      <Link href="/routing/shinkitouroku">
        <Button className="bg-yellow-300 text-black">新規登録</Button>
      </Link>
    </div>
  );
} 