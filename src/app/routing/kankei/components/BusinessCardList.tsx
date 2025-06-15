'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import BusinessCardTable from './BusinessCardTable';
import ActionButtons from './ActionButtons';
import Header from '@/components/Header';
import SearchFieldSelect from '@/components/SearchFieldSelect';
import SearchBarWithButton from '@/components/SearchBarWithButton';
import { BusinessCard } from '../types';

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

export default function BusinessCardList() {
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [filteredBusinessCards, setFilteredBusinessCards] = useState<BusinessCard[]>([]);

  useEffect(() => {
    fetchBusinessCards();
  }, []);

  const fetchBusinessCards = async () => {
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
        })) as unknown as BusinessCard[];
        setBusinessCards(typedData);
        setFilteredBusinessCards(typedData);
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
    const filtered = businessCards.filter((card) => {
      if (searchField === "all") {
        return (
          (card.representative?.representativename || '').toLowerCase().includes(searchLower) ||
          (card.region?.regionname || '').toLowerCase().includes(searchLower) ||
          (card.organization?.organizationname || '').toLowerCase().includes(searchLower) ||
          (card.category?.categoryname || '').toLowerCase().includes(searchLower) ||
          (card.phone || '').toLowerCase().includes(searchLower) ||
          (card.mobile || '').toLowerCase().includes(searchLower) ||
          (card.email || '').toLowerCase().includes(searchLower)
        );
      } else {
        switch (searchField) {
          case "category":
            return (card.category?.categoryname || '').toLowerCase().includes(searchLower);
          case "region":
            return (card.region?.regionname || '').toLowerCase().includes(searchLower);
          case "organization":
            return (card.organization?.organizationname || '').toLowerCase().includes(searchLower);
          case "representative":
            return (card.representative?.representativename || '').toLowerCase().includes(searchLower);
          case "phone":
            return (card.phone || '').toLowerCase().includes(searchLower);
          case "mobile":
            return (card.mobile || '').toLowerCase().includes(searchLower);
          case "email":
            return (card.email || '').toLowerCase().includes(searchLower);
          default:
            return true;
        }
      }
    });
    setFilteredBusinessCards(filtered);
  };

  const handleDelete = () => {
    fetchBusinessCards();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">関係機関一覧</h1>
          
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
              onAdd={() => {
                window.location.href = '/routing/shinkitouroku';
              }}
              onDelete={() => {
                window.location.href = '/routing/kankei';
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <BusinessCardTable businessCards={filteredBusinessCards} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
} 