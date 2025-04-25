'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MasterData {
  id: number;
  name: string;
}

type MasterType = 'category' | 'organization' | 'representative' | 'region';

interface MasterTableProps {
  masterType: MasterType;
  masterData: MasterData[];
  onUpdate: () => Promise<void>;
}

export default function MasterTable({ masterType, masterData, onUpdate }: MasterTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleEdit = (item: MasterData) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;

    try {
      const { error } = await supabase
        .from(masterType)
        .update({ [`${masterType}name`]: editName.trim() })
        .eq(`${masterType}id`, id);

      if (error) throw error;

      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('更新エラー:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const { error } = await supabase
        .from(masterType)
        .delete()
        .eq(`${masterType}id`, id);

      if (error) throw error;

      onUpdate();
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              名前
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {masterData.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span className="text-sm text-gray-900">{item.name}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {editingId === item.id ? (
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleUpdate(item.id)}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      保存
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white hover:bg-gray-600"
                    >
                      キャンセル
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      削除
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 