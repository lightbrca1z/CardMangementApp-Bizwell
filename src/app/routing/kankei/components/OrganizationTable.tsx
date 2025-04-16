'use client';

import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import BusinessCardEditModal, { BusinessCard } from '@/components/BusinessCardEditModal';

interface Organization {
  organizationid: number;
  organizationname: string;
  businesscardid: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
}

interface OrganizationTableProps {
  organizations: Organization[];
  onDelete: (organizationid: number) => void;
}

const convertToBusinessCard = (org: Organization): BusinessCard => {
  if (!org.businesscardid) {
    throw new Error('businesscardid is required');
  }

  return {
    businesscardid: org.businesscardid,
    phone: org.phone || null,
    mobile: org.mobile || null,
    email: org.email || null,
    imageurl: org.imageurl || null,
    organization: { organizationname: org.organizationname },
    region: { regionname: '' },
    category: { categoryname: '' },
    representative: { representativename: '' }
  };
};

export default function OrganizationTable({ organizations, onDelete }: OrganizationTableProps) {
  const [selectedCard, setSelectedCard] = useState<Organization | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (organization: Organization) => {
    try {
      setSelectedCard(organization);
      setIsEditModalOpen(true);
      setError(null);
    } catch (err) {
      setError('編集モードの開始に失敗しました');
      console.error('Edit mode error:', err);
    }
  };

  const handleUpdate = () => {
    try {
      if (selectedCard) {
        onDelete(selectedCard.organizationid);
      }
      setIsEditModalOpen(false);
      setError(null);
    } catch (err) {
      setError('更新に失敗しました');
      console.error('Update error:', err);
    }
  };

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <table className="w-full table-auto border border-collapse border-blue-300">
        <thead className="bg-blue-200">
          <tr>
            <th className="p-2">関係機関名</th>
            <th className="p-2">詳細・編集</th>
            <th className="p-2">削除</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization) => (
            <tr key={organization.organizationid} className="text-center border-t">
              <td className="p-2">{organization.organizationname}</td>
              <td className="p-2">
                <div className="flex justify-center gap-2">
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 px-3 py-1"
                    onClick={() => openImagePopup(organization.imageurl)}
                    disabled={!organization.imageurl}
                  >
                    <FaEye />
                    確認
                  </Button>
                  <Button
                    className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 px-3 py-1"
                    onClick={() => handleEdit(organization)}
                  >
                    <FaEdit />
                    編集
                  </Button>
                </div>
              </td>
              <td className="p-2">
                <div className="flex justify-center">
                  <Button
                    onClick={() => onDelete(organization.organizationid)}
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash className="mr-1" size={14} />
                    削除
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCard && (
        <BusinessCardEditModal
          card={convertToBusinessCard(selectedCard)}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
} 