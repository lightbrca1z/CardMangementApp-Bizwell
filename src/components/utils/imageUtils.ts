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
    // URLからパスを抽出
    let path = imageurl;
    const urlObj = new URL(imageurl);
    const pathParts = urlObj.pathname.split('/');
    const storageIndex = pathParts.indexOf('storage');
    if (storageIndex !== -1 && pathParts[storageIndex + 1] === 'v1' && pathParts[storageIndex + 2] === 'object') {
      // SupabaseのストレージURLの場合
      path = pathParts.slice(storageIndex + 5).join('/');
    }

    const { data, error } = await supabase.storage.from('images').createSignedUrl(path, 60 * 60);
    if (error || !data?.signedUrl) {
      alert('署名付きURLの取得に失敗しました');
      return;
    }

    const popup = window.open('', '_blank', 'width=600,height=800,scrollbars=yes,resizable=yes');
    if (popup) {
      popup.document.write(`
        <html>
          <head><title>名刺画像</title></head>
          <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;">
            <img src="${data.signedUrl}" alt="名刺画像" style="max-width:100%;max-height:100%;" />
          </body>
        </html>
      `);
      popup.document.close();
    }
  } catch (error) {
    console.error('画像URLの処理中にエラーが発生しました:', error);
    alert('画像の表示に失敗しました');
  }
}; 