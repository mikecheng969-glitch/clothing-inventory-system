import { prisma } from '@/lib/prisma';
const jsonErr = (message: string, status = 400) => Response.json({ message }, { status });
export async function GET(req: Request) {
  const keyword = new URL(req.url).searchParams.get('keyword')?.trim() || '';
  const where = keyword ? { OR: [{ name: { contains: keyword } }, { code: { contains: keyword } }, { category: { name: { contains: keyword } } }] } : {};
  const products = await prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: 'desc' } });
  return Response.json(products);
}
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.name?.trim()) return jsonErr('商品名称不能为空');
  if (!data.productCode?.trim()) return jsonErr('商品货号不能为空');
  const created = await prisma.product.create({ data: { name: data.name.trim(), code: data.productCode.trim(), categoryId: data.categoryId || null, brand: data.brand?.trim() || null, season: data.season?.trim() || null, gender: data.gender?.trim() || null, imageUrl: data.imageUrl?.trim() || null, description: data.description?.trim() || null, status: data.status?.trim() || 'ACTIVE' } });
  return Response.json(created);
}
