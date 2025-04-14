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

interface ContactTableProps {
  contacts: Contact[];
  onDelete: () => void;
}

export default function ContactTable({ contacts, onDelete }: ContactTableProps) {
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
        </tbody>
      </table>
    </div>
  );
} 