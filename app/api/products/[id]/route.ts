import { prisma } from '@/lib/prisma';

const jsonErr = (message: string, status = 400) =>
  Response.json({ message }, { status });

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    if (!data.name?.trim()) return jsonErr('商品名称不能为空');
    if (!data.code?.trim()) return jsonErr('商品货号不能为空');

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name.trim(),
        code: data.code.trim(),
        categoryId: data.categoryId || null,
        brand: data.brand?.trim() || null,
        season: data.season?.trim() || null,
        gender: data.gender?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        description: data.description?.trim() || null,
        status: data.status?.trim() || 'ACTIVE',
      },
    });

    return Response.json(updated);
  } catch (error: any) {
    return jsonErr(error?.message || '商品更新失败，请稍后重试', 500);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const count = await prisma.variant.count({ where: { productId: params.id } });
    if (count > 0) return jsonErr('该商品存在关联 SKU，不可删除', 409);

    await prisma.product.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (error: any) {
    return jsonErr(error?.message || '商品删除失败，请稍后重试', 500);
  }
}
