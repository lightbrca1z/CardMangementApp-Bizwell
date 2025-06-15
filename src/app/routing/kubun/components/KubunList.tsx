'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import KubunTable from "./KubunTable";
import SearchFieldSelect from "@/components/SearchFieldSelect";
import SearchBarWithButton from "@/components/SearchBarWithButton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Kubun {
  kubunid: number;
  kubunname: string;
  region: { regionname: string } | null;
  organization: { organizationname: string } | null;
  representative: { representativename: string } | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
}

const searchFields = [
  { value: 'kubunname', label: '区分' },
  { value: 'regionname', label: 'エリア' },
  { value: 'organizationname', label: '関係機関名' },
  { value: 'representativename', label: '担当者' },
  { value: 'phone', label: 'TEL' },
  { value: 'mobile', label: '携帯' },
  { value: 'email', label: 'メール' }
];

export default function KubunList() {
  const [kubuns, setKubuns] = useState<Kubun[]>([]);
  const [searchField, setSearchField] = useState(searchFields[0].value);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredKubuns, setFilteredKubuns] = useState<Kubun[]>([]);

  useEffect(() => {
    fetchKubuns();
  }, []);

  const fetchKubuns = async () => {
    try {
      const { data, error } = await supabase
        .from('kubun')
        .select(`
          kubunid,
          kubunname,
          region:regionid(regionname),
          organization:organizationid(organizationname),
          representative:representativeid(representativename),
          phone,
          mobile,
          email
        `)
        .order('kubunid', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedData: Kubun[] = data.map(item => ({
          ...item,
          region: item.region?.[0] || null,
          organization: item.organization?.[0] || null,
          representative: item.representative?.[0] || null
        }));
        setKubuns(formattedData);
        setFilteredKubuns(formattedData);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredKubuns(kubuns);
      return;
    }

    const filtered = kubuns.filter((kubun) => {
      const value = searchField === 'regionname' ? kubun.region?.regionname :
                   searchField === 'organizationname' ? kubun.organization?.organizationname :
                   searchField === 'representativename' ? kubun.representative?.representativename :
                   kubun[searchField as keyof Kubun];

      return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    setFilteredKubuns(filtered);
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="mb-4 flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <SearchFieldSelect
            fields={searchFields}
            value={searchField}
            onChange={setSearchField}
          />
          <SearchBarWithButton
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchClick={handleSearch}
          />
        </div>
      </div>
      <KubunTable kubuns={filteredKubuns} onDelete={fetchKubuns} />
    </div>
  );
} 