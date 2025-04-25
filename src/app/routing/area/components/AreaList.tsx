'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import AreaTable from './AreaTable';
import SearchFieldSelect from '@/components/SearchFieldSelect';
import SearchBarWithButton from '@/components/SearchBarWithButton';
import ActionButtons from './ActionButtons';
import Header from '@/components/Header';
import { Area } from '../types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const searchFields = [
  { value: 'category', label: '区分' },
  { value: 'region', label: 'エリア' },
  { value: 'organization', label: '関係機関名' },
  { value: 'representative', label: '担当者' },
  { value: 'phone', label: 'TEL' },
  { value: 'mobile', label: '携帯' },
  { value: 'email', label: 'メール' }
];

export default function AreaList() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('businesscard')
        .select(`
          businesscardid,
          phone,
          mobile,
          email,
          imageurl,
          organization:organizationid!inner (
            organizationname
          ),
          region:regionid!inner (
            regionname
          ),
          category:categoryid!inner (
            categoryname
          ),
          representative:representativeid!inner (
            representativename
          )
        `);

      if (error) {
        throw error;
      }

      if (data) {
        const typedData = data.map(item => ({
          ...item,
          organization: item.organization || null,
          region: item.region || null,
          category: item.category || null,
          representative: item.representative || null
        })) as unknown as Area[];
        setAreas(typedData);
        setFilteredAreas(typedData);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
      setError('データの取得に失敗しました');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFieldChange = (field: string) => {
    setSearchField(field);
  };

  const handleSearchClick = () => {
    const searchLower = searchQuery.toLowerCase();
    const filtered = areas.filter((area) => {
      if (searchField === "all") {
        return (
          (area.representative?.representativename || '').toLowerCase().includes(searchLower) ||
          (area.region?.regionname || '').toLowerCase().includes(searchLower) ||
          (area.organization?.organizationname || '').toLowerCase().includes(searchLower) ||
          (area.category?.categoryname || '').toLowerCase().includes(searchLower) ||
          (area.phone || '').toLowerCase().includes(searchLower) ||
          (area.mobile || '').toLowerCase().includes(searchLower) ||
          (area.email || '').toLowerCase().includes(searchLower)
        );
      } else {
        switch (searchField) {
          case "category":
            return (area.category?.categoryname || '').toLowerCase().includes(searchLower);
          case "region":
            return (area.region?.regionname || '').toLowerCase().includes(searchLower);
          case "organization":
            return (area.organization?.organizationname || '').toLowerCase().includes(searchLower);
          case "representative":
            return (area.representative?.representativename || '').toLowerCase().includes(searchLower);
          case "phone":
            return (area.phone || '').toLowerCase().includes(searchLower);
          case "mobile":
            return (area.mobile || '').toLowerCase().includes(searchLower);
          case "email":
            return (area.email || '').toLowerCase().includes(searchLower);
          default:
            return true;
        }
      }
    });
    setFilteredAreas(filtered);
  };

  const handleDelete = () => {
    window.location.href = '/routing/area';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">エリア一覧</h1>
          
          {/* 検索セクション */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col items-end space-y-4">
              {/* 検索フィールド選択 */}
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-2">検索項目</label>
                <SearchFieldSelect
                  fields={searchFields}
                  value={searchField}
                  onChange={handleFieldChange}
                />
              </div>

              {/* 検索バー */}
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-2">検索キーワード</label>
                <div className="flex gap-2">
                  <SearchBarWithButton
                    searchQuery={searchQuery}
                    onSearchChange={handleSearch}
                    onSearchClick={handleSearchClick}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-start mb-4">
            <ActionButtons
              onAdd={() => window.location.href = '/routing/shinkitouroku'}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <AreaTable areas={filteredAreas} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
} 