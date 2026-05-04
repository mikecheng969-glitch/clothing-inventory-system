export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyword = url.searchParams.get('keyword')?.trim() || '';
  const type = url.searchParams.get('type')?.trim() || '';

  const rows = await prisma.stockMovement.findMany({
    where: {
      ...(type ? { movementType: type as any } : {}),
      ...(keyword
        ? {
            OR: [
              { bizRefId: { contains: keyword } },
              { variant: { sku: { contains: keyword } } },
              { variant: { product: { name: { contains: keyword } } } },
              { fromWarehouse: { name: { contains: keyword } } },
              { toWarehouse: { name: { contains: keyword } } },
            ],
          }
        : {}),
    },
    include: {
      variant: { include: { product: true } },
      fromWarehouse: true,
      toWarehouse: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(rows);
}
