import { prisma } from '@/lib/prisma';
const jsonErr = (message: string, status = 400) => Response.json({ message }, { status });
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const d = await req.json();
  if (!d.productId) return jsonErr('请选择商品');
  if (!d.skuCode?.trim()) return jsonErr('SKU 编码不能为空');
  const row = await prisma.variant.update({ where: { id: params.id }, data: { productId: d.productId, sku: d.skuCode.trim(), barcode: d.barcode?.trim() || null, color: d.color?.trim() || '', size: d.size?.trim() || '', style: d.style?.trim() || null, costPrice: Number(d.costPrice || 0), salePrice: Number(d.salePrice || 0), lowStockLevel: Number(d.warningStock || 10), status: d.status?.trim() || 'ACTIVE' } });
  return Response.json(row);
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.variant.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
