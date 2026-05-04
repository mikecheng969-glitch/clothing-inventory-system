export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json(categories);
}
