import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const openImagePopup = async (imageurl: string | null | undefined) => {
  if (!imageurl) {
    alert('画像が登録されていません');
    return;
  }

  try {
    // すでに公開URLの場合はそのまま開く
    if (imageurl.startsWith('http') && imageurl.includes('/storage/v1/object/public/')) {
      window.open(imageurl, '_blank');
      return;
    }

    // ストレージパスから署名付きURLを生成
    const bucket = 'images';
    let path = imageurl;
    if (imageurl.startsWith('images/')) {
      path = imageurl.replace(/^images\//, '');
    }

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
    if (error || !data?.signedUrl) {
      console.error('Supabase storage error:', error);
      alert('署名付きURLの取得に失敗しました');
      return;
    }

    // 署名付きURLを新しいタブで開く
    window.open(data.signedUrl, '_blank');
  } catch (error) {
    console.error('画像URLの処理中にエラーが発生しました:', error);
    alert('画像の表示に失敗しました');
  }
};
