'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import DeleteButton from "@/components/utils/DeleteButton";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import BusinessCardEditModal from '@/components/BusinessCardEditModal';

interface Contact {
  businesscardid?: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
  organization?: { organizationname: string } | null;
  region?: { regionname: string } | null;
  category?: { categoryname: string } | null;
  representative?: { representativename: string } | null;
}

interface CategoryTableProps {
  contacts: Contact[];
  onDelete: (id: number) => void;
  onUpdate: (updatedCard: Contact) => void;
}

export default function CategoryTable({ contacts, onDelete, onUpdate }: CategoryTableProps) {
  const [selectedCard, setSelectedCard] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (contact: Contact) => {
    setSelectedCard(contact);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedCard: Contact) => {
    onUpdate(updatedCard);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('businesscard')
        .delete()
        .eq('businesscardid', id);
      if (error) throw error;
      onDelete(parseInt(id));
    } catch (error) {
      console.error('削除エラー:', error);
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
            {contacts.map((contact) => (
              <tr key={contact.businesscardid} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{contact.category?.categoryname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{contact.region?.regionname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{contact.organization?.organizationname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{contact.representative?.representativename || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{contact.phone || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{contact.mobile || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{contact.email || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openImagePopup(contact.imageurl)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(contact)}
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
                    onClick={() => handleDelete(contact.businesscardid || '')}
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
        {contacts.map((contact) => (
          <div key={contact.businesscardid} className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{contact.representative?.representativename || '-'}</h3>
                  <p className="text-sm text-gray-500">{contact.organization?.organizationname || '-'}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openImagePopup(contact.imageurl)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contact.businesscardid || '')}
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
                  <span className="ml-2">{contact.category?.categoryname || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">エリア:</span>
                  <span className="ml-2">{contact.region?.regionname || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">TEL:</span>
                  <span className="ml-2">{contact.phone || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">携帯:</span>
                  <span className="ml-2">{contact.mobile || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">メール:</span>
                  <span className="ml-2">{contact.email || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && selectedCard && (
        <BusinessCardEditModal
          isOpen={isEditModalOpen}
          card={selectedCard}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
} 