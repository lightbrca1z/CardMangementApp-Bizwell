'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface SearchBarWithButtonProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClick: () => void;
}

export default function SearchBarWithButton({ searchQuery, onSearchChange, onSearchClick }: SearchBarWithButtonProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="検索..."
        className="border rounded px-2 py-1"
      />
      <Button onClick={onSearchClick} className="bg-blue-500 text-white hover:bg-blue-600">
        検索
      </Button>
    </div>
  );
} 