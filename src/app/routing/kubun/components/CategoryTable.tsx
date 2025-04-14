'use client';

import React from "react";
import { Button } from "@/components/ui/button";

interface BusinessCard {
  id: number;
  Category?: { CategoryName: string };
  Region?: { RegionName: string };
  Organization?: { OrganizationName: string };
  Representative?: { RepresentativeName: string };
  Phone: string;
  Mobile: string;
  Email: string;
}

interface CategoryTableProps {
  data: BusinessCard[];
}

export default function CategoryTable({ data }: CategoryTableProps) {
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
          {data.map((item) => (
            <tr key={item.id} className="text-center border-t">
              <td>{item.Category?.CategoryName || '-'}</td>
              <td>{item.Region?.RegionName || '-'}</td>
              <td>{item.Organization?.OrganizationName || '-'}</td>
              <td>{item.Representative?.RepresentativeName || '-'}</td>
              <td>{item.Phone || '-'}</td>
              <td>{item.Mobile || '-'}</td>
              <td>{item.Email || '-'}</td>
              <td>
                <Button type="button" className="bg-blue-500 text-white">確認・編集</Button>
              </td>
              <td>
                <Button type="button" className="bg-red-500 text-white">削除</Button>
              </td>
            </tr>
          ))}
          {data.length === 0 && [...Array(4)].map((_, idx) => (
            <tr key={`empty-${idx}`} className="text-center border-t h-12">
              <td colSpan={9}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 