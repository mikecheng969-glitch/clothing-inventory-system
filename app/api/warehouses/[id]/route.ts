export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

const jsonErr = (message: string, status = 400) =>
  Response.json({ message }, { status });

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const d = await req.json();
    if (!d.name?.trim()) return jsonErr('仓库名称不能为空');

    const row = await prisma.warehouse.update({
      where: { id: params.id },
      data: {
        name: d.name.trim(),
        location: d.location?.trim() || null,
        manager: d.manager?.trim() || null,
      },
    });

    return Response.json(row);
  } catch (error: any) {
    return jsonErr(error?.message || '仓库更新失败，请稍后重试', 500);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.warehouse.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (error: any) {
    return jsonErr(error?.message || '仓库删除失败，请稍后重试', 500);
  }
}
