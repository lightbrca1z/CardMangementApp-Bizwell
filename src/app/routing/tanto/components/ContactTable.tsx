'use client';

import React from "react";
import { Button } from "@/components/ui/button";
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

interface ContactTableProps {
  contacts: Contact[];
}

export default function ContactTable({ contacts }: ContactTableProps) {
  const openImagePopup = async (imageurl: string | null | undefined) => {
    if (!imageurl) {
      alert('画像が登録されていません');
      return;
    }

    const publicUrlPrefix = "https://zfvgwjtrdozgdxugkxtt.supabase.co/storage/v1/object/public/images/";
    if (!imageurl.startsWith(publicUrlPrefix)) {
      alert('imageurlの形式が不正です');
      return;
    }

    const path = imageurl.replace(publicUrlPrefix, "");
    const { data, error } = await supabase.storage.from('images').createSignedUrl(path, 60 * 60);
    if (error || !data?.signedUrl) {
      alert('署名付きURLの取得に失敗しました');
      return;
    }

    const popup = window.open('', '_blank', 'width=600,height=800,scrollbars=yes,resizable=yes');
    if (popup) {
      popup.document.write(`
        <html>
          <head><title>名刺画像</title></head>
          <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;">
            <img src="${data.signedUrl}" alt="名刺画像" style="max-width:100%;max-height:100%;" />
          </body>
        </html>
      `);
      popup.document.close();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-collapse border-blue-300">
        <thead className="bg-blue-200">
          <tr>
            <th>担当者名</th>
            <th>エリア名</th>
            <th>関係機関名</th>
            <th>区分名</th>
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
              <td>{contact.representative?.representativename || '-'}</td>
              <td>{contact.region?.regionname || '-'}</td>
              <td>{contact.organization?.organizationname || '-'}</td>
              <td>{contact.category?.categoryname || '-'}</td>
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
              <td>
                <Button className="bg-red-500 text-white">削除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 