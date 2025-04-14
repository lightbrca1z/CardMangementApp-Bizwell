'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import ContactTable from './ContactTable';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';
import Header from '@/components/Header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Contact {
  businesscardid: number;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
  organization: { organizationname: string } | null;
  region: { regionname: string } | null;
  category: { categoryname: string } | null;
  representative: { representativename: string } | null;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
          `);

        if (error) throw error;
        if (!data) throw new Error('データが取得できませんでした');

        const formattedData = data.map(item => ({
          businesscardid: item.businesscardid,
          phone: item.phone || '',
          mobile: item.mobile || '',
          email: item.email || '',
          imageurl: item.imageurl || '',
          organization: item.organization ? { organizationname: item.organization.organizationname } : null,
          region: item.region ? { regionname: item.region.regionname } : null,
          category: item.category ? { categoryname: item.category.categoryname } : null,
          representative: item.representative ? { representativename: item.representative.representativename } : null
        }));

        setContacts(formattedData);
      } catch (err) {
        console.error("データ取得エラー", err);
        alert('データの取得に失敗しました');
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    const representativeName = contact.representative?.representativename?.toLowerCase() || '';
    const regionName = contact.region?.regionname?.toLowerCase() || '';
    const organizationName = contact.organization?.organizationname?.toLowerCase() || '';
    const categoryName = contact.category?.categoryname?.toLowerCase() || '';
    const phone = contact.phone?.toLowerCase() || '';
    const mobile = contact.mobile?.toLowerCase() || '';
    const email = contact.email?.toLowerCase() || '';

    return (
      representativeName.includes(searchLower) ||
      regionName.includes(searchLower) ||
      organizationName.includes(searchLower) ||
      categoryName.includes(searchLower) ||
      phone.includes(searchLower) ||
      mobile.includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  return (
    <div className="p-4 min-h-screen">
      <Header />
      <ActionButtons />
      <div className="flex justify-end mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      <ContactTable contacts={filteredContacts} />
    </div>
  );
} 