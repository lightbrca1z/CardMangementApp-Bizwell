import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

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
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          CategoryID: parseInt(kubun) || null,
          OrganizationID: parseInt(kankei) || null,
          RepresentativeID: parseInt(tanto) || null,
          Phone: tel || null,
          Mobile: mobile || null,
          Fax: fax || null,
          Email: email || null,
          RegionID: parseInt(area) || null,
          Address: address || null,
          Notes: memo || null,
          ImageURL: imageUrl || null,
          CreatedAt: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    res.status(200).json({ message: '登録成功', data });
  } catch (error) {
    console.error('DBエラー', error);
    res.status(500).json({ message: '登録失敗', error });
  }
}