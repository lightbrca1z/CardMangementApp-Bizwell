'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import CategoryTable from './CategoryTable';
import SearchBarWithButton from '@/components/SearchBarWithButton';
import ActionButtons from '@/components/ActionButtons';
import Header from '@/components/Header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Contact {
  businesscardid: string;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  imageurl: string | null;
  organization: {
    organizationid: string;
    organizationname: string;
  } | null;
  region: {
    regionid: string;
    regionname: string;
  } | null;
  category: {
    categoryid: string;
    categoryname: string;
  } | null;
  representative: {
    representativeid: string;
    representativename: string;
  } | null;
}

interface Category {
  categoryid: number;
  categoryname: string;
}

const searchFields = [
  { value: 'category', label: '区分' },
  { value: 'region', label: 'エリア' },
  { value: 'organization', label: '関係機関名' },
  { value: 'representative', label: '担当者' },
  { value: 'phone', label: 'TEL' },
  { value: 'mobile', label: '携帯' },
  { value: 'email', label: 'メール' }
];

export default function CategoryList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('organizationname');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchContacts();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('categoryid, categoryname')
        .order('categoryname');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('businesscard')
        .select(`
          businesscardid,
          phone,
          mobile,
          email,
          imageurl,
          organization:organizationid (
            organizationid,
            organizationname
          ),
          region:regionid (
            regionid,
            regionname
          ),
          category:categoryid (
            categoryid,
            categoryname
          ),
          representative:representativeid (
            representativeid,
            representativename
          )
        `);

      if (selectedCategory) {
        query = query.eq('categoryid', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedData = (data || []).map(item => {
        const org = Array.isArray(item.organization) ? item.organization[0] : item.organization;
        const reg = Array.isArray(item.region) ? item.region[0] : item.region;
        const cat = Array.isArray(item.category) ? item.category[0] : item.category;
        const rep = Array.isArray(item.representative) ? item.representative[0] : item.representative;

        return {
          businesscardid: item.businesscardid,
          phone: item.phone,
          mobile: item.mobile,
          email: item.email,
          imageurl: item.imageurl,
          organization: org ? {
            organizationid: org.organizationid,
            organizationname: org.organizationname
          } : null,
          region: reg ? {
            regionid: reg.regionid,
            regionname: reg.regionname
          } : null,
          category: cat ? {
            categoryid: cat.categoryid,
            categoryname: cat.categoryname
          } : null,
          representative: rep ? {
            representativeid: rep.representativeid,
            representativename: rep.representativename
          } : null
        };
      });

      setContacts(transformedData);
      setFilteredContacts(transformedData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchClick = () => {
    fetchContacts();
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    fetchContacts();
  }, [selectedCategory, searchQuery, searchField]);

  const handleDelete = () => {
    fetchContacts();
  };

  return (
    <div className="p-4 bg-green-100 min-h-screen">
      <Header />
      <div className="flex items-center justify-between mb-4">
        <ActionButtons />
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 border rounded"
          >
            <option value="">すべての区分</option>
            {categories.map((category) => (
              <option key={category.categoryid} value={category.categoryid}>
                {category.categoryname}
              </option>
            ))}
          </select>
          <SearchBarWithButton
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchClick={handleSearchClick}
          />
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <CategoryTable contacts={filteredContacts} onDelete={handleDelete} />
    </div>
  );
} 