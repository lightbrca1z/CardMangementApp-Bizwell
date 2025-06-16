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
    // 公開URLの場合はそのまま表示
    if (imageurl.startsWith('http') && imageurl.includes('/storage/v1/object/public/')) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.open(imageurl, '_blank');
      } else {
        const popup = window.open('', '_blank', 'width=600,height=800,scrollbars=yes,resizable=yes');
        if (popup) {
          popup.document.write(`
            <html>
              <head><title>名刺画像</title></head>
              <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;">
                <img src="${imageurl}" alt="名刺画像" style="max-width:100%;max-height:100%;" />
              </body>
            </html>
          `);
          popup.document.close();
        }
      }
      return;
    }

    // ストレージパスの場合のみ署名付きURLを生成
    let bucket = 'images';
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

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open(data.signedUrl, '_blank');
    } else {
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
    }
  } catch (error) {
    console.error('画像URLの処理中にエラーが発生しました:', error);
    alert('画像の表示に失敗しました');
  }
};