'use client';

import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import FormFields from './FormFields';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from '@/components/Header';
import { supabase, checkAuth } from '@/lib/supabaseClient';

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

interface MasterData {
  id: string;
  name: string;
}

interface ValidationError {
  field: keyof FormData;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

const validateForm = (data: FormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // 必須項目のチェック
  const requiredFields: (keyof FormData)[] = ['category', 'organization', 'representative', 'region'];
  requiredFields.forEach(field => {
    if (!data[field]?.trim()) {
      errors.push({
        field,
        message: `${getFieldLabel(field)}は必須です`
      });
    }
  });

  // メールアドレスの形式チェック
  if (data.email && !isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: '有効なメールアドレスを入力してください'
    });
  }

  // 電話番号の形式チェック
  if (data.phone && !isValidPhoneNumber(data.phone)) {
    errors.push({
      field: 'phone',
      message: '有効な電話番号を入力してください（例: 03-1234-5678）'
    });
  }

  // 携帯電話の形式チェック
  if (data.mobile && !isValidPhoneNumber(data.mobile)) {
    errors.push({
      field: 'mobile',
      message: '有効な携帯電話番号を入力してください（例: 090-1234-5678）'
    });
  }

  // FAX番号の形式チェック
  if (data.fax && !isValidPhoneNumber(data.fax)) {
    errors.push({
      field: 'fax',
      message: '有効なFAX番号を入力してください（例: 03-1234-5678）'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const getFieldLabel = (field: keyof FormData): string => {
  const labels: Record<keyof FormData, string> = {
    category: '区分',
    organization: '関係機関名',
    representative: '担当者',
    phone: '電話番号',
    mobile: '携帯電話',
    fax: 'FAX',
    email: 'メールアドレス',
    region: 'エリア',
    address: '住所',
    notes: '備考'
  };
  return labels[field];
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const isValidPhoneNumber = (phone: string): boolean => {
  // 日本国内の電話番号形式（例: 03-1234-5678, 090-1234-5678）
  const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$/;
  return phoneRegex.test(phone.trim());
};

export default function FormContainer() {
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

  const [categories, setCategories] = useState<MasterData[]>([]);
  const [organizations, setOrganizations] = useState<MasterData[]>([]);
  const [representatives, setRepresentatives] = useState<MasterData[]>([]);
  const [regions, setRegions] = useState<MasterData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [categoriesRes, organizationsRes, representativesRes, regionsRes] = await Promise.all([
        supabase.from('category').select('*'),
        supabase.from('organization').select('*'),
        supabase.from('representative').select('*'),
        supabase.from('region').select('*'),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (organizationsRes.error) throw organizationsRes.error;
      if (representativesRes.error) throw representativesRes.error;
      if (regionsRes.error) throw regionsRes.error;

      setCategories(categoriesRes.data?.map(item => ({ id: String(item.categoryid), name: item.categoryname })) || []);
      setOrganizations(organizationsRes.data?.map(item => ({ id: String(item.organizationid), name: item.organizationname })) || []);
      setRepresentatives(representativesRes.data?.map(item => ({ id: String(item.representativeid), name: item.representativename })) || []);
      setRegions(regionsRes.data?.map(item => ({ id: String(item.regionid), name: item.regionname })) || []);
    } catch (error) {
      console.error('データ取得エラー:', error);
      setError('データの取得に失敗しました');
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 認証チェック
      await checkAuth();

      // バリデーション実行
      const validationResult = validateForm(formData);
      if (!validationResult.isValid) {
        const errorMessage = validationResult.errors
          .map(error => `${getFieldLabel(error.field)}: ${error.message}`)
          .join('\n');
        setError(errorMessage);
        setIsSubmitting(false);
        alert('入力チェックのエラーが表示されました！');
        return;
      }

      const requiredFields = ['category', 'organization', 'representative', 'region'];
      const missingFields = requiredFields.filter(key => !formData[key as keyof FormData]);
      if (missingFields.length > 0) {
        alert('必須項目が未選択です');
        setIsSubmitting(false);
        return;
      }

      const upsertMaster = async (table: string, nameField: string, value: string) => {
        const trimmedValue = value.trim();
        const { data: existingData, error: searchError } = await supabase
          .from(table)
          .select('*')
          .eq(nameField, trimmedValue)
          .single();

        if (searchError && searchError.code !== 'PGRST116') {
          throw searchError;
        }

        if (existingData) {
          return existingData[`${table}id`];
        }

        const { data: newData, error: insertError } = await supabase
          .from(table)
          .insert([{ [nameField]: trimmedValue }])
          .select()
          .single();

        if (insertError) throw insertError;
        return newData[`${table}id`];
      };

      const categoryId = await upsertMaster('category', 'categoryname', formData.category);
      const organizationId = await upsertMaster('organization', 'organizationname', formData.organization);
      const representativeId = await upsertMaster('representative', 'representativename', formData.representative);
      const regionId = await upsertMaster('region', 'regionname', formData.region);

      let public_url: string | null = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, selectedFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        public_url = publicUrlData?.publicUrl || null;
      }

      const businesscardData = {
        categoryid: categoryId,
        organizationid: organizationId,
        representativeid: representativeId,
        regionid: regionId,
        phone: formData.phone.trim(),
        mobile: formData.mobile.trim(),
        fax: formData.fax.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        imageurl: public_url,
      };

      // メールアドレスで既存のデータを確認する処理を削除し、必ず新規登録
      const result = await supabase
        .from('businesscard')
        .insert([businesscardData])
        .select();

      if (result.error) throw result.error;

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

    } catch (error) {
      console.error('エラー:', error);
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row gap-4 max-w-6xl mx-auto px-4 py-4 bg-white">
      {/* 画像アップロードコンポーネント - モバイルでは上に表示 */}
      <div className="bg-white text-gray-800 p-4 rounded-2xl w-full lg:w-1/3 shadow-lg order-1 lg:order-2 border border-gray-200">
        <h2 className="bg-gray-100 text-center text-xl font-bold py-2 rounded-t-2xl mb-2 border-b border-gray-200">画像アップロード</h2>
        <div className="space-y-2">
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="プレビュー" className="max-w-full h-auto rounded" />
            </div>
          )}
        </div>
      </div>

      {/* 入力フォーム - モバイルでは下に表示 */}
      <div className="bg-white text-gray-800 p-4 rounded-2xl w-full lg:w-2/3 shadow-lg order-2 lg:order-1 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="bg-gray-100 text-center text-xl font-bold py-2 rounded-t-2xl border-b border-gray-200">入力フォーム</h2>
          <Link href="/routing/kubunkankeitantou-shinkitouroku">
            <Button className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-lg text-sm">区分・関係機関・担当者管理</Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2 text-sm flex flex-col items-start w-full">
          {error && (
            <div className="w-full p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 mb-2">
              <h3 className="font-bold mb-1">以下の項目を確認してください：</h3>
              <ul className="list-disc list-inside space-y-0.5">
                {error.split('\n').map((errorMessage, index) => (
                  <li key={index} className="text-sm">
                    {errorMessage}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <FormFields
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            organizations={organizations}
            representatives={representatives}
            regions={regions}
          />
          <div className="w-full flex justify-end space-x-2 mt-2">
            <Button type="submit" className="bg-green-500 text-white hover:bg-green-600 px-3 py-1" disabled={isSubmitting}>
              {isSubmitting ? '登録中...' : '登録'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
