import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, // formidableを使うため
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadDir = path.join(process.cwd(), '/public/uploads');

  // フォルダがなければ作成
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'アップロード失敗' });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'ファイルが見つかりません' });
    }

    // 拡張子取得
    const ext = path.extname(file.originalFilename || '');
    // uuidでリネーム（重複防止）
    const newFileName = `${uuidv4()}${ext}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // アップロードされたファイルをリネーム（移動）
    fs.renameSync(file.filepath, newFilePath);

    // クライアント用パス
    const filePathForClient = `/uploads/${newFileName}`;

    return res.status(200).json({ imageUrl: filePathForClient });
  });
}
