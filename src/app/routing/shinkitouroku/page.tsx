'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLogout } from '@/lib/logout';
import Link from 'next/link';

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // 入力値変更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 画像変更
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // プレビュー用URL生成
    }
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = '';

    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append('file', imageFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formDataImage,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        imageUrl = data.imageUrl; // アップロード後の画像URL
      } else {
        alert('画像アップロードに失敗しました');
        return;
      }
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, imageUrl }),
    });

    if (res.ok) {
      alert('登録に成功しました');
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
      setImageFile(null);
      setImagePreviewUrl(null);
    } else {
      const data = await res.json();
      alert('登録に失敗しました');
    }
  };

  const { logout } = useLogout();

  return (
    <div className="min-h-screen bg-green-100 p-6 sm:p-12 font-sans">

      {/* ヘッダー */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
        <div className="text-3xl font-bold text-purple-600">IT就労 ビズウェル</div>
        <nav className="flex space-x-4 text-pink-700 text-sm sm:text-base">
          <Link href="/">ホーム</Link>
          <Link href="/routing/tanto">担当者一覧</Link>
          <Link href="/routing/kankei">関係機関一覧</Link>
          <Link href="/routing/kubun">区分一覧</Link>
          <Link href="/routing/area">エリア一覧</Link>
          <Link href="#" onClick={(e) => { e.preventDefault(); logout() }}>ログアウト</Link>
          <Link href="/routing/shinkitouroku">新規登録</Link>
        </nav>
      </header>

      {/* 新規登録 & 検索 */}
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

      {/* メイン */}
      <main className="mt-10 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">

        {/* フォーム */}
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

        {/* 画像エリア */}
        <div className="bg-purple-200 p-6 rounded-xl w-full lg:w-1/3 relative">
          <h2 className="bg-purple-400 text-center text-xl font-bold py-2 rounded-t-xl mb-4">画像登録</h2>
          <p className="text-center mb-4">名刺の画像から登録</p>
          <div className="border border-gray-400 bg-white text-center py-10 rounded relative cursor-pointer mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title=""
            />
            <span className="text-black pointer-events-none">ファイルを選択してください</span>
          </div>

          {/* 選択された画像のURL表示とプレビュー */}
          {imagePreviewUrl && (
            <div className="text-center text-sm text-purple-900 break-all space-y-2">
              <p>選択中の画像:</p>
              <a href={imagePreviewUrl} target="_blank" rel="noopener noreferrer" className="underline break-words">
                {imagePreviewUrl}
              </a>
              <img src={imagePreviewUrl} alt="プレビュー" className="mx-auto max-h-40 rounded shadow" />
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
