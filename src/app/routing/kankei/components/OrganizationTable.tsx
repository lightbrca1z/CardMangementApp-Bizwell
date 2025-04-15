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
  businesscardid?: number;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
}

interface OrganizationTableProps {
  organizations: Organization[];
  onDelete: (organizationid: number) => void;
}

// OrganizationをBusinessCardに変換する関数
const convertToBusinessCard = (org: Organization): BusinessCard => {
  return {
    businesscardid: org.businesscardid || 0,
    phone: org.phone,
    mobile: org.mobile,
    email: org.email,
    imageurl: org.imageurl,
    organization: { organizationname: org.organizationname },
    region: null,
    category: null,
    representative: null
  };
};

export default function OrganizationTable({ organizations, onDelete }: OrganizationTableProps) {
  const [selectedCard, setSelectedCard] = useState<Organization | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (organization: Organization) => {
    setSelectedCard(organization);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedCard) {
      onDelete(selectedCard.organizationid);
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-collapse border-blue-300">
        <thead className="bg-blue-200">
          <tr>
            <th>関係機関名</th>
            <th>詳細・編集</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization) => (
            <tr key={organization.organizationid} className="text-center border-t">
              <td>{organization.organizationname}</td>
              <td>
                <div className="flex justify-center gap-2">
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 px-3 py-1"
                    onClick={() => openImagePopup(organization.imageurl)}
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
              <td className="px-2 py-1">
                <div className="flex justify-center">
                  <button
                    onClick={() => onDelete(organization.organizationid)}
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash className="mr-1" size={14} />
                    削除
                  </button>
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