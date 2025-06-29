'use client';

import React from 'react';

interface SearchFieldSelectProps {
  value: string;
  onChange: (value: string) => void;
  fields: { value: string; label: string }[];
}

export default function SearchFieldSelect({ value, onChange, fields }: SearchFieldSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-2 py-1 text-black"
    >
      <option value="all" className="text-black">すべて</option>
      {fields.map((field) => (
        <option key={field.value} value={field.value} className="text-black">
          {field.label}
        </option>
      ))}
    </select>
  );
} 