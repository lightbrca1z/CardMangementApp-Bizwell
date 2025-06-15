'use client';

import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import BusinessCardEditModal, { BaseCard } from '@/components/BusinessCardEditModal';

interface Organization {
  businesscardid: string;
  organizationid: string;
  organizationname: string;
  phone?: string;
  mobile?: string;
  email?: string;
  imageurl?: string;
  category?: {
    categoryname: string;
  };
  region?: {
    regionname: string;
  };
  representative?: {
    representativename: string;
  };
}

interface OrganizationTableProps {
  organizations: Organization[];
  onDelete: (id: string) => void;
  onUpdate: (card: BaseCard) => void;
}

export default function OrganizationTable({ organizations, onDelete, onUpdate }: OrganizationTableProps) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (organization: Organization) => {
    setSelectedOrg(organization);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedOrg) {
      onDelete(selectedOrg.organizationid);
    }
    setIsEditModalOpen(false);
  };

  const convertToBaseCard = (org: Organization): BaseCard => ({
    businesscardid: org.businesscardid,
    phone: org.phone,
    mobile: org.mobile,
    email: org.email,
    imageurl: org.imageurl
  });

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
            {organizations.map((org) => (
              <tr key={org.businesscardid} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{org.category?.categoryname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{org.region?.regionname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{org.organizationname}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{org.representative?.representativename || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{org.phone || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{org.mobile || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{org.email || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openImagePopup(org.imageurl)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(org)}
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
                    onClick={() => onDelete(org.organizationid)}
                    className="text-red-600 hover:text-red-800"
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
        {organizations.map((org) => (
          <div key={org.businesscardid} className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{org.representative?.representativename || '-'}</h3>
                  <p className="text-sm text-gray-500">{org.organizationname}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openImagePopup(org.imageurl)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(org)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(org.organizationid)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">区分:</span>
                  <span className="ml-2 text-black font-medium">{org.category?.categoryname || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">エリア:</span>
                  <span className="ml-2 text-black font-medium">{org.region?.regionname || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">TEL:</span>
                  <span className="ml-2 text-black font-medium">{org.phone || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">携帯:</span>
                  <span className="ml-2 text-black font-medium">{org.mobile || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">メール:</span>
                  <span className="ml-2 text-black font-medium">{org.email || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && selectedOrg && (
        <BusinessCardEditModal
          card={convertToBaseCard(selectedOrg)}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
} 