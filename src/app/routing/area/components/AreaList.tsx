'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import AreaTable from './AreaTable';
import AreaButtons from './AreaButtons';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';
import Header from '@/components/Header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BusinessCard {
  id: number;
  Category?: { CategoryName: string };
  Region?: { RegionName: string };
  Organization?: { OrganizationName: string };
  Representative?: { RepresentativeName: string };
  Phone: string;
  Mobile: string;
  Email: string;
}

export default function AreaList() {
  const [data, setData] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('businessCard')
        .select(`
          *,
          Category(*),
          Region(*),
          Organization(*),
          Representative(*)
        `);

      if (error) {
        console.error('取得エラー', error);
        return;
      }

      setData(data || []);
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredData = data.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.Category?.CategoryName.toLowerCase().includes(searchLower) ||
      item.Region?.RegionName.toLowerCase().includes(searchLower) ||
      item.Organization?.OrganizationName.toLowerCase().includes(searchLower) ||
      item.Representative?.RepresentativeName.toLowerCase().includes(searchLower) ||
      item.Phone.toLowerCase().includes(searchLower) ||
      item.Mobile.toLowerCase().includes(searchLower) ||
      item.Email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 min-h-screen">
      <Header />
      <AreaButtons />
      <div className="flex items-center justify-end mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      <AreaTable data={filteredData} />
    </div>
  );
} 