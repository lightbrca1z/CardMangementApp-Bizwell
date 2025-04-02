import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mysql'; // ← これを自分のDB接続に合わせて読み替えて
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    kubun,
    kankei,
    tanto,
    tel,
    mobile,
    fax,
    email,
    area,
    address,
    memo,
    imageUrl,
  } = req.body;

  try {
    const sql = `
      INSERT INTO BusinessCards 
      (CategoryID, OrganizationID, RepresentativeID, Phone, Mobile, Fax, Email, RegionID, Address, Notes, ImageURL, CreatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      parseInt(kubun) || null,          // CategoryID
      parseInt(kankei) || null,         // OrganizationID
      parseInt(tanto) || null,          // RepresentativeID
      tel || null,                      // Phone
      mobile || null,                   // Mobile
      fax || null,                      // Fax
      email || null,                    // Email
      parseInt(area) || null,           // RegionID
      address || null,                  // Address
      memo || null,                     // Notes
      imageUrl || null,                 // ImageURL
      dayjs().format('YYYY-MM-DD HH:mm:ss.SSS') // CreatedAt
    ];

    await db.execute(sql, params);

    res.status(200).json({ message: '登録成功' });
  } catch (error) {
    console.error('DBエラー', error);
    res.status(500).json({ message: '登録失敗', error });
  }
}
