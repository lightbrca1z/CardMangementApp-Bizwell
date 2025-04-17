'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import DeleteButton from "@/components/utils/DeleteButton";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';

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

interface CategoryTableProps {
  contacts: Contact[];
  onDelete: () => void;
}

export default function CategoryTable({ contacts, onDelete }: CategoryTableProps) {
  const [selectedCard, setSelectedCard] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (contact: Contact) => {
    setSelectedCard(contact);
    setIsEditModalOpen(true);
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
      onDelete();
    } catch (error) {
      console.error('削除エラー:', error);
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
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 px-3 py-1"
                    onClick={() => openImagePopup(contact.imageurl)}
                  >
                    <FaEye />
                    確認
                  </Button>
                  <Button
                    className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 px-3 py-1"
                    onClick={() => handleEdit(contact)}
                  >
                    <FaEdit />
                    編集
                  </Button>
                </div>
              </td>
              <td className="px-2 py-1">
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDelete(contact.businesscardid.toString())}
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
          {contacts.length === 0 && [...Array(4)].map((_, idx) => (
            <tr key={`empty-${idx}`} className="text-center border-t h-12">
              <td colSpan={9}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 