import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

// -------------------
// Supabase 初期化
// -------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // API route内なので service_role でOK
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

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
  } = req.body

  try {
    // -----------------------------
    // バリデーション
    // -----------------------------
    const requiredFields = ['kubun', 'kankei', 'tanto', 'area']
    const missingFields = requiredFields.filter(field => !req.body[field])

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `入力値不足: ${missingFields.join(', ')}` })
    }

    // -----------------------------
    // businessCard 登録
    // -----------------------------
    const { data, error } = await supabase
      .from('businessCard')
      .insert([{
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
      }])
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({ message: '登録成功', data })

  } catch (error) {
    console.error('DBエラー', error)
    return res.status(500).json({ message: '登録失敗', error: `${error}` })
  }
}
