import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

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
    const data = await prisma.businessCard.create({
      data: {
        CategoryID: kubun ? parseInt(kubun) : null,
        OrganizationID: kankei ? parseInt(kankei) : null,
        RepresentativeID: tanto ? parseInt(tanto) : null,
        Phone: tel || null,
        Mobile: mobile || null,
        Fax: fax || null,
        Email: email || null,
        RegionID: area ? parseInt(area) : null,
        Address: address || null,
        Notes: memo || null,
        ImageURL: imageUrl || null,
      }
    });

    res.status(200).json({ message: '登録成功', data });
  } catch (error) {
    console.error('DBエラー', error);
    res.status(500).json({ message: '登録失敗', error });
  }
}