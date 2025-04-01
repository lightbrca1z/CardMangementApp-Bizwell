// app/api/contact/route.ts
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
        Representative: true,
      },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('取得エラー', error);
    return NextResponse.json({ message: '取得失敗', error: String(error) }, { status: 500 });
  }
}

// ---------------------
// POST (登録)
// ---------------------
export async function POST(req: Request) {
  const data = await req.json();

  if (!data.kubun || !data.kankei || !data.tanto || !data.area) {
    return NextResponse.json({ message: '入力値不足' }, { status: 400 });
  }

  try {
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
      }
    });

    return NextResponse.json({ message: '登録成功' }, { status: 200 });
  } catch (error) {
    console.error("登録エラー", error);
    return NextResponse.json({ message: '登録失敗', error: String(error) }, { status: 500 });
  }
}
