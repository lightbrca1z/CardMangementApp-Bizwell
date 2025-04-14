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
    <div className="p-4 bg-green-100 min-h-screen">
      <Header />
      <div className="flex items-center justify-between mb-4">
        <ActionButtons />
        <div className="flex items-center space-x-4">
          <SearchFieldSelect 
            value={searchField} 
            onChange={handleFieldChange} 
            fields={searchFields}
          />
          <SearchBarWithButton 
            searchQuery={searchQuery} 
            onSearchChange={handleSearch} 
            onSearchClick={handleSearchClick}
          />
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <BusinessCardTable businessCards={filteredBusinessCards} onDelete={handleDelete} />
    </div>
  );
} 