'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import BusinessCardEditModal from '@/components/BusinessCardEditModal';
import { supabase } from '@/lib/supabaseClient';

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

interface CategoryTableProps {
  contacts: Contact[];
  onDelete: () => void;
}

export default function CategoryTable({ contacts, onDelete }: CategoryTableProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!contacts || contacts.length === 0) {
    return <div className="text-center text-gray-500 py-4">区分が登録されていません</div>;
  }

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (businesscardid: number) => {
    if (!confirm('本当に削除しますか？')) return;

    setIsDeleting(true);
    try {
      // 画像の削除
      const { data: contact } = await supabase
        .from('businesscard')
        .select('imageurl')
        .eq('businesscardid', businesscardid)
        .single();

      if (contact?.imageurl) {
        const imagePath = contact.imageurl.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('businesscard-images')
            .remove([imagePath]);
        }
      }

      // データの削除
      const { error } = await supabase
        .from('businesscard')
        .delete()
        .eq('businesscardid', businesscardid);

      if (error) throw error;

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
          {contacts.map((contact) => (
            <tr key={contact.businesscardid} className="text-center border-t">
              <td>{contact.category?.categoryname || '-'}</td>
              <td>{contact.region?.regionname || '-'}</td>
              <td>{contact.organization?.organizationname || '-'}</td>
              <td>{contact.representative?.representativename || '-'}</td>
              <td>{contact.phone || '-'}</td>
              <td>{contact.mobile || '-'}</td>
              <td>{contact.email || '-'}</td>
              <td>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => openImagePopup(contact.imageurl)}
                    className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 px-3 py-1"
                  >
                    <FaEye />
                    確認
                  </button>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 px-3 py-1"
                  >
                    <FaEdit />
                    編集
                  </button>
                </div>
              </td>
              <td className="px-2 py-1">
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDelete(contact.businesscardid)}
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
        </tbody>
      </table>

      {isEditModalOpen && selectedContact && (
        <BusinessCardEditModal
          card={selectedContact}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedContact(null);
          }}
          onUpdate={() => {
            setIsEditModalOpen(false);
            setSelectedContact(null);
            onDelete();
          }}
        />
      )}
    </div>
  );
} 