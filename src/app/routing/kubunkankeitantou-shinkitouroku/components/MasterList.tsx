'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import MasterTable from './MasterTable';
import ActionButtons from './ActionButtons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MasterData {
  id: number;
  name: string;
}

type MasterType = 'category' | 'organization' | 'representative' | 'region';

export default function MasterList() {
  const [masterType, setMasterType] = useState<MasterType>('category');
  const [masterData, setMasterData] = useState<MasterData[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMasterData();
  }, [masterType]);

  const fetchMasterData = async () => {
    try {
      const { data, error } = await supabase
        .from(masterType)
        .select('*');

      if (error) throw error;

      const sortedData = data?.sort((a, b) => 
        a[`${masterType}name`].localeCompare(b[`${masterType}name`], 'ja')
      ) || [];

      setMasterData(sortedData.map(item => ({
        id: item[`${masterType}id`],
        name: item[`${masterType}name`]
      })));
    } catch (error) {
      console.error('データ取得エラー:', error);
      setError('データの取得に失敗しました');
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) {
      setError('名前を入力してください');
      return;
    }

    // 重複チェック
    const isDuplicate = masterData.some(item => 
      item.name.toLowerCase() === newName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError('この名前は既に登録されています');
      return;
    }

    try {
      const { error } = await supabase
        .from(masterType)
        .insert([{ [`${masterType}name`]: newName.trim() }]);

      if (error) {
        if (error.code === '23505') { // PostgreSQLの一意制約違反エラーコード
          setError('この名前は既に登録されています');
          return;
        }
        console.error('登録エラー詳細:', error);
        throw error;
      }

      setNewName('');
      setError(null);
      fetchMasterData();
    } catch (error) {
      console.error('登録エラー:', error);
      setError('登録に失敗しました');
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">マスターデータ管理</h1>
        <Link href="/routing/shinkitouroku">
          <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
            <FaArrowLeft />
            新規登録画面へ
          </Button>
        </Link>
      </div>

      <ActionButtons masterType={masterType} setMasterType={setMasterType} />

      <div className="mt-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="新しい名前を入力"
            className="flex-1 p-2 border rounded"
          />
          <Button 
            onClick={handleAdd} 
            className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
          >
            <FaPlus />
            追加
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <MasterTable
          masterType={masterType}
          masterData={masterData}
          onUpdate={fetchMasterData}
        />
      </div>
    </main>
  );
} 