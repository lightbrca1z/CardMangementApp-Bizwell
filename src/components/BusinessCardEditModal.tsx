'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { FaTimes, FaUpload, FaSave, FaTimesCircle } from 'react-icons/fa';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface BaseCard {
  businesscardid?: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
  category?: { categoryname: string } | null;
  region?: { regionname: string } | null;
  organization?: { organizationname: string } | null;
  representative?: { representativename: string } | null;
}

interface BusinessCardEditModalProps {
  card: BaseCard;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BusinessCardEditModal({ card, isOpen, onClose, onUpdate }: BusinessCardEditModalProps) {
  const [formData, setFormData] = useState({
    phone: card.phone || '',
    mobile: card.mobile || '',
    email: card.email || '',
    category: card.category?.categoryname || '',
    region: card.region?.regionname || '',
    organization: card.organization?.organizationname || '',
    representative: card.representative?.representativename || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      phone: card.phone || '',
      mobile: card.mobile || '',
      email: card.email || '',
      category: card.category?.categoryname || '',
      region: card.region?.regionname || '',
      organization: card.organization?.organizationname || '',
      representative: card.representative?.representativename || '',
    });
    if (card.imageurl) {
      const publicUrlPrefix = "https://zfvgwjtrdozgdxugkxtt.supabase.co/storage/v1/object/public/images/";
      if (card.imageurl.startsWith(publicUrlPrefix)) {
        const path = card.imageurl.replace(publicUrlPrefix, "");
        supabase.storage.from('images').createSignedUrl(path, 60 * 60)
          .then(({ data, error }) => {
            if (!error && data?.signedUrl) {
              setSignedUrl(data.signedUrl);
            }
          });
      }
    }
  }, [card]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let imageUrl = card.imageurl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${card.businesscardid}-${Date.now()}.${fileExt}`;
        
        // ファイルサイズチェック（例：10MB以下）
        if (selectedFile.size > 10 * 1024 * 1024) {
          throw new Error('画像サイズが大きすぎます。10MB以下の画像を選択してください。');
        }

        // ファイルタイプチェック
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(selectedFile.type)) {
          throw new Error('対応していない画像形式です。JPEG、PNG、GIF形式の画像を選択してください。');
        }

        try {
          // 既存のファイルを削除
          if (card.imageurl) {
            const oldFileName = card.imageurl.split('/').pop();
            if (oldFileName) {
              const { error: removeError } = await supabase.storage
                .from('images')
                .remove([oldFileName]);
              
              if (removeError) {
                console.warn('古い画像の削除に失敗:', removeError);
              }
            }
          }

          // 画像のアップロード
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, selectedFile, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error('画像アップロードエラー詳細:', {
              error: uploadError,
              fileName,
              fileSize: selectedFile.size,
              fileType: selectedFile.type,
              timestamp: new Date().toISOString()
            });
            
            if (uploadError.message?.includes('row-level security')) {
              throw new Error('ストレージへのアクセス権限がありません。管理者に連絡してください。');
            }
            
            throw new Error('画像のアップロードに失敗しました。管理者に連絡してください。');
          }

          if (!uploadData?.path) {
            throw new Error('アップロードした画像のパスを取得できませんでした。');
          }

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(uploadData.path);

          if (!publicUrl) {
            throw new Error('アップロードした画像のURLを取得できませんでした。');
          }

          imageUrl = publicUrl;
        } catch (error) {
          console.error('画像アップロード処理エラー:', error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('画像のアップロード中に予期せぬエラーが発生しました。');
        }
      }

      // マスターデータの更新または作成
      const upsertMaster = async (table: string, nameField: string, value: string) => {
        if (!value.trim()) return null;

        const { data: existingData, error: searchError } = await supabase
          .from(table)
          .select('*')
          .eq(nameField, value.trim())
          .single();

        if (searchError && searchError.code !== 'PGRST116') {
          throw searchError;
        }

        if (existingData) {
          return existingData[`${table}id`];
        }

        const { data: newData, error: insertError } = await supabase
          .from(table)
          .insert([{ [nameField]: value.trim() }])
          .select()
          .single();

        if (insertError) throw insertError;
        return newData[`${table}id`];
      };

      // 各マスターデータのIDを取得
      const [categoryId, regionId, organizationId, representativeId] = await Promise.all([
        upsertMaster('category', 'categoryname', formData.category),
        upsertMaster('region', 'regionname', formData.region),
        upsertMaster('organization', 'organizationname', formData.organization),
        upsertMaster('representative', 'representativename', formData.representative)
      ]);

      const { error: updateError } = await supabase
        .from('businesscard')
        .update({
          phone: formData.phone,
          mobile: formData.mobile,
          email: formData.email,
          imageurl: imageUrl,
          categoryid: categoryId,
          regionid: regionId,
          organizationid: organizationId,
          representativeid: representativeId,
        })
        .eq('businesscardid', card.businesscardid);

      if (updateError) {
        console.error('データ更新エラー詳細:', {
          error: updateError,
          cardId: card.businesscardid,
          updateData: {
            phone: formData.phone,
            mobile: formData.mobile,
            email: formData.email,
            imageurl: imageUrl,
            categoryid: categoryId,
            regionid: regionId,
            organizationid: organizationId,
            representativeid: representativeId,
          }
        });
        
        let errorMessage = 'データの更新に失敗しました。';
        if (updateError.message) {
          errorMessage += ` ${updateError.message}`;
        }
        if (updateError.code) {
          errorMessage += ` (エラーコード: ${updateError.code})`;
        }
        throw new Error(errorMessage);
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('更新エラー詳細:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('予期せぬエラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl my-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">名刺情報の編集</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報セクション */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b">基本情報</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  区分
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  エリア
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  関係機関名
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  担当者
                </label>
                <input
                  type="text"
                  value={formData.representative}
                  onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 連絡先情報セクション */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b">連絡先情報</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  携帯電話
                </label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 名刺画像セクション */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">名刺画像</h3>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {(previewUrl || signedUrl) && (
                  <div className="relative">
                    <img
                      src={previewUrl || signedUrl || ''}
                      alt="名刺画像"
                      className="w-48 h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
                  <FaUpload className="mr-2" size={16} />
                  画像を選択
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  対応形式: JPEG, PNG, GIF（最大10MB）
                </p>
              </div>
            </div>
          </div>

          {/* ボタンセクション */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaTimesCircle className="mr-2" size={16} />
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaSave className="mr-2" size={16} />
              {isLoading ? '更新中...' : '更新'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 