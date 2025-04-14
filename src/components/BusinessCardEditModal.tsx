'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { FaTimes, FaUpload, FaSave, FaTimesCircle } from 'react-icons/fa';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BaseCard {
  businesscardid?: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  imageurl?: string | null;
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

      const { error: updateError } = await supabase
        .from('businesscard')
        .update({
          phone: formData.phone,
          mobile: formData.mobile,
          email: formData.email,
          imageurl: imageUrl,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">名刺情報の編集</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名刺画像
            </label>
            <div className="flex items-center space-x-4">
              {(previewUrl || signedUrl) && (
                <div className="relative">
                  <img
                    src={previewUrl || signedUrl || ''}
                    alt="名刺画像"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                  <FaUpload className="mr-2" size={16} />
                  画像を選択
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <FaTimesCircle className="mr-2" size={16} />
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
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