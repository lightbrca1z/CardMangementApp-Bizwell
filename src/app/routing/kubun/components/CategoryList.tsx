'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CategoryTable from './CategoryTable';
import SearchFieldSelect from '@/components/SearchFieldSelect';
import SearchBarWithButton from '@/components/SearchBarWithButton';
import ActionButtons from '@/components/ActionButtons';
import Header from '@/components/Header';

interface Contact {
  businesscardid: number;
  category: {
    categoryid: number;
    categoryname: string;
  } | null;
  region: {
    regionid: number;
    regionname: string;
  } | null;
  organization: {
    organizationid: number;
    organizationname: string;
  } | null;
  representative: {
    representativeid: number;
    representativename: string;
  } | null;
  phone: string;
  mobile: string;
  email: string;
  imageurl?: string | null;
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
          categoryid,
          regionid,
          organizationid,
          representativeid,
          phone,
          mobile,
          email,
          imageurl,
          category:categoryid (
            categoryid,
            categoryname
          ),
          region:regionid (
            regionid,
            regionname
          ),
          organization:organizationid (
            organizationid,
            organizationname
          ),
          representative:representativeid (
            representativeid,
            representativename
          )
        `)
        .order('businesscardid', { ascending: true });

      if (error) throw error;

      const typedData = (data || []).map(item => ({
        businesscardid: item.businesscardid,
        category: item.category ? {
          categoryid: item.category.categoryid,
          categoryname: item.category.categoryname
        } : null,
        region: item.region ? {
          regionid: item.region.regionid,
          regionname: item.region.regionname
        } : null,
        organization: item.organization ? {
          organizationid: item.organization.organizationid,
          organizationname: item.organization.organizationname
        } : null,
        representative: item.representative ? {
          representativeid: item.representative.representativeid,
          representativename: item.representative.representativename
        } : null,
        phone: item.phone || '',
        mobile: item.mobile || '',
        email: item.email || '',
        imageurl: item.imageurl
      }));

      setContacts(typedData);
      setFilteredContacts(typedData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
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
      <CategoryTable contacts={filteredContacts} onDelete={handleDelete} />
    </div>
  );
} 