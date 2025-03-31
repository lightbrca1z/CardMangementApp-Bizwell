'use client';

import Image from 'next/image';
import { useState } from 'react';
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { supabase } from '@/lib/supabaseClient';

interface FormData {
  kubun: string;
  kankei: string;
  tanto: string;
  tel: string;
  mobile: string;
  fax: string;
  email: string;
  area: string;
  address: string;
  memo: string;
}

export default function RoutingFormPage() {
  const [formData, setFormData] = useState<FormData>({
    kubun: '',
    kankei: '',
    tanto: '',
    tel: '',
    mobile: '',
    fax: '',
    email: '',
    area: '',
    address: '',
    memo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // SupabaseにINSERT
    const { error } = await supabase.from('contacts').insert([formData]);

    if (error) {
      console.error('Insert Error', error);
      alert('登録に失敗しました');
    } else {
      alert('登録に成功しました');
      // フォームの初期化
      setFormData({
        kubun: '',
        kankei: '',
        tanto: '',
        tel: '',
        mobile: '',
        fax: '',
        email: '',
        area: '',
        address: '',
        memo: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-6 sm:p-12 font-sans">
      {/* ヘッダー */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
        <div className="text-3xl font-bold text-purple-600">IT就労 ビズウェル</div>
        <nav className="flex space-x-4 text-pink-700 text-sm sm:text-base mt-4 sm:mt-0">
        <a href="/">ホーム</a>
        <a href="/routing/tanto">担当者一覧</a>
        <a href="/routing/kankei">関係機関一覧</a>
        <a href="/routing/kubun">区分一覧</a>
        <a href="/routing/area">エリア一覧</a>
        <a href="/routing/login">ログイン</a>
        <a href="/routing/shinkitouroku">新規登録</a>
        </nav>
      </header>

      {/* 新規登録ボタンと検索 */}
      <div className="mt-6 flex items-center justify-start max-w-6xl mx-auto space-x-4">
        <button className="bg-yellow-200 text-gray-800 px-6 py-2 rounded-full shadow-md text-lg">
          新規登録
        </button>
        <input
          type="text"
          placeholder="検索"
          className="border rounded-full px-4 py-2 focus:outline-none"
        />
      </div>

      {/* メイン：フォームと画像登録 */}
      <main className="mt-10 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* 入力フォーム */}
        <div className="bg-purple-900 text-white p-6 rounded-xl w-full lg:w-2/3">
          <h2 className="bg-purple-400 text-center text-xl font-bold py-2 rounded-t-xl mb-4">入力フォーム</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {[
              ['kubun', '区分入力', true],
              ['kankei', '関係機関名', true],
              ['tanto', '担当者名', true],
              ['tel', 'TEL', true],
              ['mobile', '携帯', false],
              ['fax', 'FAX', false],
              ['email', 'メール', true],
              ['area', 'エリア', true],
              ['address', '住所', false],
              ['memo', '備考', false],
            ].map(([name, label, required], index) => (
              <div key={index} className="flex flex-col">
                <label className="text-white">
                  {label}
                  {required && (
                    <span className="text-red-500 text-xs ml-1">※は必須項目です</span>
                  )}
                </label>
                <input
                  type="text"
                  name={name}
                  value={formData[name as keyof FormData]}
                  onChange={handleInputChange}
                  className="bg-white text-black p-2 rounded"
                  required={required}
                />
              </div>
            ))}
            <button type="submit" className="bg-yellow-200 text-purple-700 text-xl px-10 py-3 rounded-full shadow-md hover:bg-yellow-300 transition w-full mt-4">
              登録
            </button>
          </form>
        </div>

        {/* 画像登録エリア */}
        <div className="bg-purple-200 p-6 rounded-xl w-full lg:w-1/3 relative">
          <h2 className="bg-purple-400 text-center text-xl font-bold py-2 rounded-t-xl mb-4">画像登録</h2>
          <p className="text-center mb-4">名刺の画像から登録</p>
          <div className="border border-gray-400 bg-white text-center py-10 rounded">
            <span className="text-black">ファイルを選択</span>
          </div>

          {/* ロボット画像（右上） */}
          <div className="absolute -top-8 right-4">
            <Image
              src="/robot.png"
              alt="ロボット"
              width={60}
              height={60}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
