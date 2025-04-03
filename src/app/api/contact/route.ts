import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role Key を使う (connectOrCreate 相当で必要)
)

// ---------------------
// GET (一覧取得)
// ---------------------
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('businessCard')
      .select(`
        *,
        Category(*),
        Region(*),
        Organization(*),
        Organization2(*),
        Representative(*)
      `)

    if (error) throw error

    return NextResponse.json(data)

  } catch (error) {
    console.error('取得エラー', error)
    return NextResponse.json({ message: '取得失敗', error: `${error}` }, { status: 500 })
  }
}

// ---------------------
// POST (登録)
// ---------------------
export async function POST(req: Request) {
  try {
    const data = await req.json()

    // -----------------
    // 入力バリデーション
    // -----------------
    const requiredFields = ['kubun', 'kankei', 'tanto', 'area']
    const missingFields = requiredFields.filter(field => !data[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ message: `入力値不足: ${missingFields.join(', ')}` }, { status: 400 })
    }

    // -----------------
    // 各マスター登録 or 取得 (upsert 相当)
    // -----------------
    const upsert = async (table: string, key: string, value: string) => {
      const { data: record, error } = await supabase
        .from(table)
        .upsert([{ [key]: value }], { onConflict: key })
        .select()
        .single()

      if (error) throw error
      return record.id
    }

    const categoryId = await upsert('Category', 'CategoryName', data.kubun)
    const organizationId = await upsert('Organization', 'OrganizationName', data.kankei)
    const organization2Id = await upsert('Organization2', 'OrganizationName', data.kankei2 || '未設定')
    const representativeId = await upsert('Representative', 'RepresentativeName', data.tanto)
    const regionId = await upsert('Region', 'RegionName', data.area)

    // -----------------
    // businessCard 登録
    // -----------------
    const { data: result, error: insertError } = await supabase
      .from('businessCard')
      .insert([{
        CategoryId: categoryId,
        OrganizationId: organizationId,
        Organization2Id: organization2Id,
        RepresentativeId: representativeId,
        RegionId: regionId,
        Phone: data.tel || '',
        Mobile: data.mobile || '',
        Fax: data.fax || '',
        Email: data.email || '',
        Address: data.address || '',
        Notes: data.memo || '',
        ImageURL: data.imageUrl || ''
      }])
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ message: '登録成功', data: result }, { status: 200 })

  } catch (error) {
    console.error("登録エラー", error)
    return NextResponse.json({ message: '登録失敗', error: `${error}` }, { status: 500 })
  }
}
