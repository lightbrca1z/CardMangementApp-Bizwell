'use client';

import React from "react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="検索"
        className="ml-4 px-2 py-1 border rounded"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button className="bg-blue-500 text-white ml-2">検索</Button>
    </div>
  );
} 