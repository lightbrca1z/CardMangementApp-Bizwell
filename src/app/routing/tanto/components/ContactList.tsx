'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import ContactTable from './ContactTable';
import ActionButtons from '@/components/ActionButtons';
import Header from '@/components/Header';
import SearchFieldSelect from '@/components/SearchFieldSelect';
import SearchBarWithButton from '@/components/SearchBarWithButton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Contact {
  businesscardid: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
  organization: { organizationname: string } | null;
  region: { regionname: string } | null;
  category: { categoryname: string } | null;
  representative: { representativename: string } | null;
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

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('businesscard')
        .select(`
          businesscardid,
          phone,
          mobile,
          email,
          imageurl,
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
        `)
        .order('businesscardid', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        const typedData = data.map((item: any) => ({
          businesscardid: item.businesscardid,
          phone: item.phone,
          mobile: item.mobile,
          email: item.email,
          imageurl: item.imageurl,
          organization: item.organization ? { organizationname: item.organization.organizationname } : null,
          region: item.region ? { regionname: item.region.regionname } : null,
          category: item.category ? { categoryname: item.category.categoryname } : null,
          representative: item.representative ? { representativename: item.representative.representativename } : null
        })) as Contact[];
        setContacts(typedData);
        setFilteredContacts(typedData);
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
    const filtered = contacts.filter((contact) => {
      if (searchField === "all") {
        return (
          (contact.representative?.representativename || '').toLowerCase().includes(searchLower) ||
          (contact.region?.regionname || '').toLowerCase().includes(searchLower) ||
          (contact.organization?.organizationname || '').toLowerCase().includes(searchLower) ||
          (contact.category?.categoryname || '').toLowerCase().includes(searchLower) ||
          (contact.phone || '').toLowerCase().includes(searchLower) ||
          (contact.mobile || '').toLowerCase().includes(searchLower) ||
          (contact.email || '').toLowerCase().includes(searchLower)
        );
      } else {
        switch (searchField) {
          case "category":
            return (contact.category?.categoryname || '').toLowerCase().includes(searchLower);
          case "region":
            return (contact.region?.regionname || '').toLowerCase().includes(searchLower);
          case "organization":
            return (contact.organization?.organizationname || '').toLowerCase().includes(searchLower);
          case "representative":
            return (contact.representative?.representativename || '').toLowerCase().includes(searchLower);
          case "phone":
            return (contact.phone || '').toLowerCase().includes(searchLower);
          case "mobile":
            return (contact.mobile || '').toLowerCase().includes(searchLower);
          case "email":
            return (contact.email || '').toLowerCase().includes(searchLower);
          default:
            return true;
        }
      }
    });
    setFilteredContacts(filtered);
  };

  const handleDelete = () => {
    fetchContacts();
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
      <ContactTable contacts={filteredContacts} onDelete={handleDelete} />
    </div>
  );
} 