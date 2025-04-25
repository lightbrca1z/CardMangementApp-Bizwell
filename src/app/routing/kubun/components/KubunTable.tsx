'use client';

import React from "react";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";

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

interface KubunTableProps {
  kubuns: Kubun[];
  onDelete: () => void;
}

export default function KubunTable({ kubuns, onDelete }: KubunTableProps) {
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('kubun')
        .delete()
        .eq('kubunid', id);

      if (error) {
        throw error;
      }

      onDelete();
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2">区分</th>
            <th className="px-4 py-2">エリア</th>
            <th className="px-4 py-2">関係機関名</th>
            <th className="px-4 py-2">担当者</th>
            <th className="px-4 py-2">TEL</th>
            <th className="px-4 py-2">携帯</th>
            <th className="px-4 py-2">メール</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {kubuns.map((kubun) => (
            <tr key={kubun.kubunid} className="text-center border-t">
              <td className="px-4 py-2">{kubun.kubunname}</td>
              <td className="px-4 py-2">{kubun.region?.regionname || '-'}</td>
              <td className="px-4 py-2">{kubun.organization?.organizationname || '-'}</td>
              <td className="px-4 py-2">{kubun.representative?.representativename || '-'}</td>
              <td className="px-4 py-2">{kubun.phone || '-'}</td>
              <td className="px-4 py-2">{kubun.mobile || '-'}</td>
              <td className="px-4 py-2">{kubun.email || '-'}</td>
              <td className="px-4 py-2">
                <Button
                  onClick={() => handleDelete(kubun.kubunid)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}
          {kubuns.length === 0 && [...Array(4)].map((_, idx) => (
            <tr key={`empty-${idx}`} className="text-center border-t h-12">
              <td colSpan={8}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 