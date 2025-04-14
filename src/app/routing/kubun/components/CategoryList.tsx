'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import CategoryTable from './CategoryTable';
import CategoryButtons from './CategoryButtons';
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

interface Category {
  categoryid: number;
  categoryname: string;
}

export default function CategoryList() {
  const [data, setData] = useState<BusinessCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('businessCard')
          .select(`
            *,
            Category(CategoryName),
            Region(RegionName),
            Organization(OrganizationName),
            Representative(RepresentativeName)
          `);

        if (error) {
          console.error('Supabase Error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setError(`データの取得に失敗しました: ${error.message}`);
          return;
        }

        if (!data) {
          setError('データが存在しません');
          return;
        }

        setData(data || []);
        setError(null);
      } catch (err) {
        console.error('Unexpected Error:', err);
        setError('予期せぬエラーが発生しました');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('category')
          .select('*');

        if (error) {
          console.error('Supabase Error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setError(`カテゴリの取得に失敗しました: ${error.message}`);
          return;
        }

        if (!data) {
          setError('カテゴリが存在しません');
          return;
        }

        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Unexpected Error:', err);
        setError('予期せぬエラーが発生しました');
      }
    };

    fetchCategories();
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

  const filteredCategories = categories.filter(category => {
    const searchLower = searchQuery.toLowerCase();
    return category.categoryname.toLowerCase().includes(searchLower);
  });

  return (
    <div className="p-4 bg-green-100 min-h-screen">
      <Header />
      <CategoryButtons />
      <div className="flex justify-end mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <CategoryTable data={filteredData} />
    </div>
  );
} 