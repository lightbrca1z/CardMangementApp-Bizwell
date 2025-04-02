import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// ---------------------
// GET (一覧取得)
// ---------------------
export async function GET() {
  try {
    const contacts = await prisma.businessCard.findMany({
      include: {
        Category: true,
        Region: true,
        Organization: true,
        Organization2: true,
        Representative: true,
      },
    });
    return NextResponse.json(contacts);
  } catch (error: unknown) {
    console.error('取得エラー', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: '取得失敗', error: errorMessage }, { status: 500 });
  }
}

// ---------------------
// POST (登録)
// ---------------------
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // -----------------
    // 入力バリデーション
    // -----------------
    const requiredFields = ['kubun', 'kankei', 'tanto', 'area'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ message: `入力値不足: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // -----------------
    // BusinessCard 登録
    // -----------------
    await prisma.businessCard.create({
      data: {
        Category: {
          connectOrCreate: {
            where: { CategoryName: data.kubun },
            create: { CategoryName: data.kubun }
          }
        },
        Organization: {
          connectOrCreate: {
            where: { OrganizationName: data.kankei },
            create: { OrganizationName: data.kankei }
          }
        },
        // Organization2 も必ず空文字でもconnectOrCreate
        Organization2: {
          connectOrCreate: {
            where: { OrganizationName: data.kankei2 || '未設定' },
            create: { OrganizationName: data.kankei2 || '未設定' }
          }
        },
        Representative: {
          connectOrCreate: {
            where: { RepresentativeName: data.tanto },
            create: { RepresentativeName: data.tanto }
          }
        },
        Region: {
          connectOrCreate: {
            where: { RegionName: data.area },
            create: { RegionName: data.area }
          }
        },
        Phone: data.tel || '',
        Mobile: data.mobile || '',
        Fax: data.fax || '',
        Email: data.email || '',
        Address: data.address || '',
        Notes: data.memo || '',
        ImageURL: data.imageUrl || '',
      }
    });

    return NextResponse.json({ message: '登録成功' }, { status: 200 });

  } catch (error: unknown) {
    console.error("登録エラー", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: '登録失敗', error: errorMessage }, { status: 500 });
  }
}
