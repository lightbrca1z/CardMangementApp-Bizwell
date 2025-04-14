'use client';

import React from "react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="検索..."
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button 
        className="bg-blue-500 text-white ml-2 hover:bg-blue-600"
        onClick={() => onSearchChange(searchQuery)}
      >
        検索
      </Button>
    </div>
  );
} 