'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import BusinessCardEditModal from '@/components/BusinessCardEditModal';

interface BusinessCard {
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

interface BusinessCardTableProps {
  businessCards: BusinessCard[];
  onDelete: () => void;
}

export default function BusinessCardTable({ businessCards, onDelete }: BusinessCardTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (card: BusinessCard) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    try {
      setIsDeleting(true);

      // 関連する画像を削除
      const { data: businessCard } = await supabase
        .from('businesscard')
        .select('imageurl')
        .eq('businesscardid', id)
        .single();

      if (businessCard?.imageurl) {
        const publicUrlPrefix = "https://zfvgwjtrdozgdxugkxtt.supabase.co/storage/v1/object/public/images/";
        const path = businessCard.imageurl.replace(publicUrlPrefix, "");
        await supabase.storage.from('images').remove([path]);
      }

      // 名刺データを削除
      const { error } = await supabase
        .from('businesscard')
        .delete()
        .eq('businesscardid', id);

      if (error) {
        throw error;
      }

      alert('削除が完了しました');
      onDelete();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
                  <div className="flex justify-center gap-2">
                    <Button
                      className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 px-3 py-1"
                      onClick={() => openImagePopup(card.imageurl)}
                    >
                      <FaEye />
                      確認
                    </Button>
                    <Button
                      className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 px-3 py-1"
                      onClick={() => handleEdit(card)}
                    >
                      <FaEdit />
                      編集
                    </Button>
                  </div>
                </td>
                <td className="px-2 py-1">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(card.businesscardid)}
                      disabled={isDeleting}
                      className="flex items-center px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      <FaTrash className="mr-1" size={14} />
                      {isDeleting ? '削除中...' : '削除'}
                    </button>
                  </div>
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
      {selectedCard && (
        <BusinessCardEditModal
          card={selectedCard}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={() => {
            setIsEditModalOpen(false);
            onDelete();
          }}
        />
      )}
    </>
  );
} 