import { prisma } from '@/lib/prisma';
const jsonErr = (message: string, status = 400) => Response.json({ message }, { status });
export async function GET() {
  const rows = await prisma.warehouse.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json(rows);
}
export async function POST(req: Request) {
  const d = await req.json();
  if (!d.name?.trim()) return jsonErr('仓库名称不能为空');
  const row = await prisma.warehouse.create({ data: { name: d.name.trim(), code: `WH-${Date.now()}`, location: d.location?.trim() || null, manager: d.manager?.trim() || null } });
  return Response.json(row);
}
