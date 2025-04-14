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

interface BusinessCard {
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

interface BusinessCardTableProps {
  businessCards: BusinessCard[];
  onDelete: () => void;
}

export default function BusinessCardTable({ businessCards, onDelete }: BusinessCardTableProps) {
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
            <th>区分</th>
            <th>エリア</th>
            <th>関係機関名</th>
            <th>担当者</th>
            <th>TEL</th>
            <th>携帯</th>
            <th>メール</th>
            <th>詳細・編集</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {businessCards.map((card) => (
            <tr key={card.businesscardid} className="text-center border-t">
              <td>{card.category?.categoryname || '-'}</td>
              <td>{card.region?.regionname || '-'}</td>
              <td>{card.organization?.organizationname || '-'}</td>
              <td>{card.representative?.representativename || '-'}</td>
              <td>{card.phone || '-'}</td>
              <td>{card.mobile || '-'}</td>
              <td>{card.email || '-'}</td>
              <td>
                <Button
                  className="bg-blue-500 text-white"
                  onClick={() => openImagePopup(card.imageurl)}
                >
                  確認・編集
                </Button>
              </td>
              <td className="px-4 py-2">
                <DeleteButton
                  businesscardid={card.businesscardid}
                  onDelete={() => handleDelete(card.businesscardid)}
                />
              </td>
            </tr>
          ))}
          {businessCards.length === 0 && [...Array(4)].map((_, idx) => (
            <tr key={`empty-${idx}`} className="text-center border-t h-12">
              <td colSpan={9}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 