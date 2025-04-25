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

  const publicUrlPrefix = "https://zfvgwjtrdozgdxugkxtt.supabase.co/storage/v1/object/public/images/";
  if (!imageurl.startsWith(publicUrlPrefix)) {
    alert('imageurlの形式が不正です');
    return;
  }

  const path = imageurl.replace(publicUrlPrefix, "");
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
}; 