'use client';

import { useState, useEffect } from 'react';
import { useLogout } from '@/lib/logout';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface FormData {
  category: string;
  organization: string;
  representative: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  region: string;
  address: string;
  notes: string;
}

export default function RoutingFormPage() {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    organization: '',
    representative: '',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    region: '',
    address: '',
    notes: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useLogout();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    try {
      // ① 必須チェック
      const requiredFields = ['category', 'organization', 'representative', 'phone', 'email', 'region'];
      const missingFields = requiredFields.filter(key => !formData[key as keyof FormData]);
      if (missingFields.length > 0) {
        alert('必須項目が未入力です');
        setIsSubmitting(false);
        return;
      }
  
      // ② organizationid を取得
      const { data: organizationData, error: organizationError } = await supabase
        .from('organization')
        .select('organizationid')
        .eq('organizationname', formData.organization)
        .maybeSingle();
  
      if (organizationError || !organizationData) {
        throw new Error('入力された関係機関が存在しません');
      }
  
      // ③ 他の外部キーも同様に取得する（例: category, region, representative）
      const { data: categoryData } = await supabase.from('category').select('categoryid').eq('categoryname', formData.category).maybeSingle();
      const { data: regionData } = await supabase.from('region').select('regionid').eq('regionname', formData.region).maybeSingle();
      const { data: representativeData } = await supabase.from('representative').select('representativeid').eq('representativename', formData.representative).maybeSingle();
  
      if (!categoryData || !regionData || !representativeData) {
        throw new Error('区分、エリア、担当者のいずれかが存在しません');
      }
  
      // ④ 画像アップロード処理
      let public_url: string | null = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, selectedFile);
        if (uploadError) throw new Error(uploadError.message);
  
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        if (!publicUrlData?.publicUrl) throw new Error('画像URL取得失敗');
        public_url = publicUrlData.publicUrl;
      }
  
      // ⑤ businesscard 登録
      const { error: insertError } = await supabase.from('businesscard').insert([{
        categoryid: categoryData.categoryid,
        organizationid: organizationData.organizationid,
        representativeid: representativeData.representativeid,
        regionid: regionData.regionid,
        phone: formData.phone,
        mobile: formData.mobile,
        fax: formData.fax,
        email: formData.email,
        address: formData.address,
        notes: formData.notes,
        imageurl: public_url,
      }]);
  
      if (insertError) throw new Error(insertError.message);
  
      alert('登録が完了しました');
      setFormData({
        category: '',
        organization: '',
        representative: '',
        phone: '',
        mobile: '',
        fax: '',
        email: '',
        region: '',
        address: '',
        notes: '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
  
    } catch (err: any) {
      console.error('登録エラー', err);
      alert(err.message || 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-green-100 p-6 sm:p-12 font-sans">
      <header className="w-full flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto mb-8">
        <div className="text-3xl font-bold text-purple-600">IT就労 ビズウェル</div>
        <nav className="flex space-x-4 text-pink-700 text-sm sm:text-base">
          <Link href="/">TOP</Link>
          <Link href="/routing/tanto">担当者一覧</Link>
          <Link href="/routing/kankei">関係機関一覧</Link>
          <Link href="/routing/kubun">区分一覧</Link>
          <Link href="/routing/area">エリア一覧</Link>
          <Link href="#" onClick={(e) => { e.preventDefault(); logout() }}>ログアウト</Link>
        </nav>
      </header>

      <main className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        <div className="bg-purple-900 text-white p-6 rounded-2xl w-full lg:w-2/3 shadow-lg">
          <h2 className="bg-purple-400 text-center text-xl font-bold py-2 rounded-t-2xl mb-4">入力フォーム</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm flex flex-col items-start w-full">
            {[
              { label: '区分入力', field: 'category' },
              { label: '関係機関名', field: 'organization' },
              { label: '担当者名', field: 'representative' },
              { label: 'エリア', field: 'region' }
            ].map(({ label, field }) => (
              <div key={field} className="flex flex-col space-y-1 w-full">
                <label className="text-sm">{label} <span className="text-red-500">※は必須項目です</span></label>
                <input
                  type="text"
                  className="bg-white text-black p-2 rounded border-2 border-purple-500 w-full"
                  placeholder={`${label}を入力`}
                  value={formData[field as keyof FormData]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required
                />
              </div>
            ))}

            {[ 
              { label: 'TEL', field: 'phone', required: true },
              { label: '携帯', field: 'mobile', required: false },
              { label: 'FAX', field: 'fax', required: false },
              { label: 'メール', field: 'email', required: true },
              { label: '住所', field: 'address', required: false },
              { label: '備考', field: 'notes', required: false },
            ].map(({ label, field, required }) => (
              <div key={field} className="flex flex-col space-y-1 w-full">
                <label>{label}{required && <span className="text-red-500">※は必須項目です</span>}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  className="bg-white text-black p-2 rounded border-2 border-purple-500 w-full"
                  placeholder={label}
                  required={required}
                  value={formData[field as keyof FormData]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
              </div>
            ))}

            <button type="submit" disabled={isSubmitting}
              className="bg-yellow-200 text-purple-700 text-xl px-10 py-3 rounded-full shadow-md hover:bg-yellow-300 transition w-full">
              {isSubmitting ? '登録中...' : '登録'}
            </button>
          </form>
        </div>

        <div className="bg-purple-200 p-6 rounded-2xl w-full lg:w-1/3 shadow-lg relative">
          <h2 className="bg-purple-400 text-center text-xl font-bold py-2 rounded-t-2xl mb-4">画像登録</h2>
          <p className="text-center mb-4">名刺の画像から登録</p>
          <div className="border-2 border-purple-400 bg-white text-center py-10 rounded relative cursor-pointer mb-4">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <span className="text-black pointer-events-none">ファイルを選択してください</span>
          </div>
          {previewUrl && (
            <div className="text-center text-sm text-purple-900 break-words space-y-2">
              <p>選択中の画像:</p>
              <img src={previewUrl} alt="プレビュー" className="mx-auto max-h-40 rounded shadow" />
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="underline break-words">{previewUrl}</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}