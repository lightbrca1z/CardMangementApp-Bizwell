'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import BusinessCardTable from "./BusinessCardTable";
import SearchBar from "./SearchBar";
import ActionButtons from "./ActionButtons";
import Header from '@/components/Header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BusinessCard {
  businesscardid: number;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  organization: { organizationname: string } | null;
  region: { regionname: string } | null;
  category: { categoryname: string } | null;
  representative: { representativename: string } | null;
}

export default function BusinessCardList() {
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessCards = async () => {
      try {
        const { data, error } = await supabase
          .from('businesscard')
          .select(`
            businesscardid,
            phone,
            mobile,
            email,
            address,
            organization:organizationid (
              organizationname
            ),
            region:regionid (
              regionname
            ),
            category:categoryid (
              categoryname
            ),
            representative:representativeid (
              representativename
            )
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

        const formattedData = data.map(item => ({
          businesscardid: item.businesscardid,
          phone: item.phone || '',
          mobile: item.mobile || '',
          email: item.email || '',
          address: item.address || '',
          organization: item.organization ? { organizationname: item.organization.organizationname } : null,
          region: item.region ? { regionname: item.region.regionname } : null,
          category: item.category ? { categoryname: item.category.categoryname } : null,
          representative: item.representative ? { representativename: item.representative.representativename } : null
        }));

        setBusinessCards(formattedData);
        setError(null);
      } catch (err) {
        console.error('Unexpected Error:', err);
        setError('予期せぬエラーが発生しました');
      }
    };

    fetchBusinessCards();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCards = businessCards.filter(card => {
    const searchLower = searchQuery.toLowerCase();
    const organizationName = card.organization?.organizationname?.toLowerCase() || '';
    const regionName = card.region?.regionname?.toLowerCase() || '';
    const categoryName = card.category?.categoryname?.toLowerCase() || '';
    const representativeName = card.representative?.representativename?.toLowerCase() || '';
    const phone = card.phone.toLowerCase();
    const mobile = card.mobile.toLowerCase();
    const email = card.email.toLowerCase();

    return (
      organizationName.includes(searchLower) ||
      regionName.includes(searchLower) ||
      categoryName.includes(searchLower) ||
      representativeName.includes(searchLower) ||
      phone.includes(searchLower) ||
      mobile.includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  return (
    <div className="p-4 min-h-screen">
      <Header />
      <ActionButtons />
      <div className="flex items-center justify-end mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <BusinessCardTable cards={filteredCards} />
    </div>
  );
} 