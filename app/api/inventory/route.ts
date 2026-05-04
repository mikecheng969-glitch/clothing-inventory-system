export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('keyword')?.trim() || '';

  const rows = await prisma.inventoryStock.findMany({
    where: q
      ? {
          OR: [
            { variant: { sku: { contains: q } } },
            { variant: { barcode: { contains: q } } },
            { variant: { color: { contains: q } } },
            { variant: { size: { contains: q } } },
            { warehouse: { name: { contains: q } } },
            { warehouse: { code: { contains: q } } },
            { variant: { product: { name: { contains: q } } } },
            { variant: { product: { code: { contains: q } } } },
          ],
        }
      : undefined,
    include: { variant: { include: { product: true } }, warehouse: true },
    orderBy: [{ variant: { product: { name: 'asc' } } }, { updatedAt: 'desc' }],
  });

  return Response.json(rows);
}
