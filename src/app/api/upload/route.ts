import { NextResponse } from 'next/server';
import { mkdir, writeFile, stat } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// POST: 画像アップロード
export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ message: 'ファイルが見つかりません' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // ① アップロード先のディレクトリが無ければ作成
        try {
            await stat(uploadDir);
        } catch {
            await mkdir(uploadDir, { recursive: true });
        }

        // ② 衝突しないファイル名を作成
        const ext = path.extname(file.name);
        const fileName = crypto.randomUUID() + ext;

        const filePath = path.join(uploadDir, fileName);

        // ③ ファイルを書き込む
        await writeFile(filePath, buffer);

        // ④ 完了
        return NextResponse.json({ imageUrl: `/uploads/${fileName}` });

    } catch (err) {
        console.error('アップロードエラー', err);
        return NextResponse.json({ message: 'アップロード失敗' }, { status: 500 });
    }
}
