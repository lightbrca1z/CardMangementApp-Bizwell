'use client';

import React from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="検索"
      className="ml-4 px-2 py-1 border rounded"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
} 