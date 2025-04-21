'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ActionButtonsProps {
  onAdd: () => void;
  onDelete: () => void;
}

export default function ActionButtons({ onAdd, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button onClick={onAdd} className="bg-yellow-300 text-black hover:bg-yellow-400">
        新規登録
      </Button>
      <Button onClick={onDelete} className="bg-purple-400 text-white hover:bg-purple-500">
        担当者一覧（全体）
      </Button>
    </div>
  );
} 