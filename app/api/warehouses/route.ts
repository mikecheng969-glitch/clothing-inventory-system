import { prisma } from '@/lib/prisma';

const jsonErr = (message: string, status = 400) =>
  Response.json({ message }, { status });

export async function GET(req: Request) {
  const keyword = new URL(req.url).searchParams.get('keyword')?.trim() || '';
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { location: { contains: keyword } },
          { manager: { contains: keyword } },
        ],
      }
    : {};

  const rows = await prisma.warehouse.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(rows);
}

export async function POST(req: Request) {
  try {
    const d = await req.json();
    if (!d.name?.trim()) return jsonErr('仓库名称不能为空');

    const row = await prisma.warehouse.create({
      data: {
        name: d.name.trim(),
        code: `WH-${Date.now()}`,
        location: d.location?.trim() || null,
        manager: d.manager?.trim() || null,
      },
    });

    return Response.json(row);
  } catch (error: any) {
    return jsonErr(error?.message || '仓库新增失败，请检查输入数据', 500);
  }
}
