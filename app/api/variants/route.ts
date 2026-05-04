import { prisma } from '@/lib/prisma';

const jsonErr = (message: string, status = 400) =>
  Response.json({ message }, { status });

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('keyword')?.trim() || '';
  const where = q
    ? {
        OR: [
          { sku: { contains: q } },
          { barcode: { contains: q } },
          { color: { contains: q } },
          { size: { contains: q } },
          { product: { name: { contains: q } } },
        ],
      }
    : {};

  const rows = await prisma.variant.findMany({
    where,
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(rows);
}

export async function POST(req: Request) {
  try {
    const d = await req.json();
    if (!d.productId) return jsonErr('请选择商品');
    if (!d.sku?.trim()) return jsonErr('SKU 编码不能为空');

    const row = await prisma.variant.create({
      data: {
        productId: d.productId,
        sku: d.sku.trim(),
        barcode: d.barcode?.trim() || null,
        color: d.color?.trim() || '',
        size: d.size?.trim() || '',
        style: d.style?.trim() || null,
        costPrice: Number(d.costPrice || 0),
        salePrice: Number(d.salePrice || 0),
        lowStockLevel: Number(d.warningStock || 10),
        status: d.status?.trim() || 'ACTIVE',
      },
    });

    return Response.json(row);
  } catch (error: any) {
    return jsonErr(error?.message || 'SKU 新增失败，请检查输入数据', 500);
  }
}
