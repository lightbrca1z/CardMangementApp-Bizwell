'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import BusinessCardEditModal from '@/components/BusinessCardEditModal';
import { supabase } from '@/lib/supabaseClient';
import { Area } from '../types';

interface AreaTableProps {
  areas: Area[];
  onDelete: () => void;
}

export default function AreaTable({ areas, onDelete }: AreaTableProps) {
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
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
    <div className="overflow-x-auto">
      {/* デスクトップ表示用テーブル */}
      <div className="hidden md:block">
        <table className="w-full table-auto border border-collapse border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">区分</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">エリア</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">関係機関名</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">担当者</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">TEL</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">携帯</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">メール</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">詳細・編集</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">削除</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {areas.map((area) => (
              <tr key={area.businesscardid} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{area.category?.categoryname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{area.region?.regionname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{area.organization?.organizationname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{area.representative?.representativename || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{area.phone || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{area.mobile || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{area.email || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openImagePopup(area.imageurl)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(area)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(area.businesscardid)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* モバイル表示用カード */}
      <div className="md:hidden space-y-4 p-4">
        {areas.map((area) => (
          <div key={area.businesscardid} className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{area.representative?.representativename || '-'}</h3>
                  <p className="text-sm text-gray-500">{area.organization?.organizationname || '-'}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openImagePopup(area.imageurl)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(area)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(area.businesscardid)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">区分:</span>
                  <span className="ml-2 text-black font-medium">{area.category?.categoryname || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">エリア:</span>
                  <span className="ml-2 text-black font-medium">{area.region?.regionname || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">TEL:</span>
                  <span className="ml-2 text-black font-medium">{area.phone || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">携帯:</span>
                  <span className="ml-2 text-black font-medium">{area.mobile || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">メール:</span>
                  <span className="ml-2 text-black font-medium">{area.email || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedArea && (
        <BusinessCardEditModal
          card={selectedArea}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={() => {
            setIsEditModalOpen(false);
            onDelete();
          }}
        />
      )}
    </div>
  );
} 