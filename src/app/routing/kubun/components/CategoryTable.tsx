'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { openImagePopup } from "@/components/utils/imageUtils";
import DeleteButton from "@/components/utils/DeleteButton";

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
          {contacts.map((contact) => (
            <tr key={contact.businesscardid} className="text-center border-t">
              <td className="px-4 py-2">{contact.category?.categoryname || '-'}</td>
              <td className="px-4 py-2">{contact.region?.regionname || '-'}</td>
              <td className="px-4 py-2">{contact.organization?.organizationname || '-'}</td>
              <td className="px-4 py-2">{contact.representative?.representativename || '-'}</td>
              <td className="px-4 py-2">{contact.phone || '-'}</td>
              <td className="px-4 py-2">{contact.mobile || '-'}</td>
              <td className="px-4 py-2">{contact.email || '-'}</td>
              <td className="px-4 py-2">
                <Button
                  className="bg-blue-500 text-white"
                  onClick={() => openImagePopup(contact.imageurl)}
                >
                  確認・編集
                </Button>
              </td>
              <td className="px-4 py-2">
                <DeleteButton
                  businesscardid={contact.businesscardid}
                  onDelete={onDelete}
                />
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