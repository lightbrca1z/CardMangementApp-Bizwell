'use client';

import React from "react";
import { Button } from "@/components/ui/button";

interface BusinessCard {
  businesscardid: number;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  organization: { organizationname: string } | null;
  region: { regionname: string } | null;
  category: { categoryname: string } | null;
  representative: { representativename: string } | null;
}

interface BusinessCardTableProps {
  cards: BusinessCard[];
}

export default function BusinessCardTable({ cards }: BusinessCardTableProps) {
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
          {cards.map((item) => (
            <tr key={item.businesscardid} className="text-center border-t">
              <td>{item.category?.categoryname || "-"}</td>
              <td>{item.region?.regionname || "-"}</td>
              <td>{item.organization?.organizationname || "-"}</td>
              <td>{item.representative?.representativename || "-"}</td>
              <td>{item.phone || "-"}</td>
              <td>{item.mobile || "-"}</td>
              <td>{item.email || "-"}</td>
              <td>
                <Button className="bg-blue-500 text-white">確認・編集</Button>
              </td>
              <td>
                <Button className="bg-red-500 text-white">削除</Button>
              </td>
            </tr>
          ))}
          {cards.length === 0 && [...Array(4)].map((_, idx) => (
            <tr key={`empty-${idx}`} className="text-center border-t h-12">
              <td colSpan={9}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 