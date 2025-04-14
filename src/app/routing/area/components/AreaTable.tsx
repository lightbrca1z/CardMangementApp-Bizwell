'use client';

import React from "react";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import DeleteButton from "@/components/utils/DeleteButton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Area {
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

interface AreaTableProps {
  areas: Area[];
  onDelete: () => void;
}

export default function AreaTable({ areas, onDelete }: AreaTableProps) {
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('businesscard')
        .delete()
        .eq('businesscardid', id);

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
      <table className="w-full table-auto border border-collapse border-blue-300">
        <thead className="bg-blue-200">
          <tr>
            <th className="px-4 py-2">区分</th>
            <th className="px-4 py-2">エリア</th>
            <th className="px-4 py-2">関係機関名</th>
            <th className="px-4 py-2">担当者</th>
            <th className="px-4 py-2">TEL</th>
            <th className="px-4 py-2">携帯</th>
            <th className="px-4 py-2">メール</th>
            <th className="px-4 py-2">詳細・編集</th>
            <th className="px-4 py-2">削除</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr key={area.businesscardid} className="text-center border-t">
              <td className="px-4 py-2">{area.category?.categoryname || '-'}</td>
              <td className="px-4 py-2">{area.region?.regionname || '-'}</td>
              <td className="px-4 py-2">{area.organization?.organizationname || '-'}</td>
              <td className="px-4 py-2">{area.representative?.representativename || '-'}</td>
              <td className="px-4 py-2">{area.phone || '-'}</td>
              <td className="px-4 py-2">{area.mobile || '-'}</td>
              <td className="px-4 py-2">{area.email || '-'}</td>
              <td className="px-4 py-2">
                <Button
                  className="bg-blue-500 text-white"
                  onClick={() => openImagePopup(area.imageurl)}
                >
                  確認・編集
                </Button>
              </td>
              <td className="px-4 py-2">
                <DeleteButton
                  businesscardid={area.businesscardid}
                  onDelete={() => handleDelete(area.businesscardid)}
                />
              </td>
            </tr>
          ))}
          {areas.length === 0 && [...Array(4)].map((_, idx) => (
            <tr key={`empty-${idx}`} className="text-center border-t h-12">
              <td colSpan={9}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 