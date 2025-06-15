'use client';

import React from 'react';

interface SearchFieldSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchFieldSelect({ value, onChange }: SearchFieldSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="all">すべて</option>
      <option value="category">区分</option>
      <option value="region">エリア</option>
      <option value="organization">関係機関名</option>
      <option value="representative">担当者</option>
      <option value="phone">TEL</option>
      <option value="mobile">携帯</option>
      <option value="email">メール</option>
    </select>
  );
} 