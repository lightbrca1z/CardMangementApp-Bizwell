"use client";

import React from "react";
import Header from '@/components/Header';
import CategoryList from './components/CategoryList';

export default function KubunPage() {
  return (
    <div className="p-4 min-h-screen">
      <Header />
      <CategoryList />
    </div>
  );
}
