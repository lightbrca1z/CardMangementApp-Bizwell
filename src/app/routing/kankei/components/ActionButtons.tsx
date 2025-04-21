'use client';

import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAdd?: () => void;
  onDelete?: () => void;
}

export default function ActionButtons({ onAdd, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button 
        onClick={onAdd}
        className="bg-green-500 text-white hover:bg-green-600"
      >
        新規登録
      </Button>
      <Button 
        onClick={onDelete}
        className="bg-purple-400 text-white hover:bg-purple-500"
      >
        エリア一覧（全体）
      </Button>
    </div>
  );
} 