export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

const jsonErr = (message: string, status = 400) => Response.json({ message }, { status });

const buildOrderNo = async (prefix: 'RK' | 'CK', tx: Omit<typeof prisma, '$connect'>) => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const begin = new Date(now);
  begin.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const count = await tx.stockMovement.count({
    where: { movementType: prefix === 'RK' ? 'IN' : 'OUT', createdAt: { gte: begin, lte: end } },
  });
  return `${prefix}${date}${String(count + 1).padStart(4, '0')}`;
};

export async function POST(req: Request) {
  try {
    const d = await req.json();
    const variantId = d.variantId?.trim();
    const warehouseId = d.warehouseId?.trim();
    const quantity = Number(d.quantity);
    const note = d.note?.trim() || null;

    if (!variantId) return jsonErr('请选择 SKU');
    if (!warehouseId) return jsonErr('请选择入库仓库');
    if (!Number.isInteger(quantity) || quantity <= 0) return jsonErr('入库数量必须大于 0');

    const result = await prisma.$transaction(async (tx: any) => {
      const stock = await tx.inventoryStock.findUnique({ where: { variantId_warehouseId: { variantId, warehouseId } } });
      const beforeQuantity = stock?.quantity ?? 0;
      const afterQuantity = beforeQuantity + quantity;

      await tx.inventoryStock.upsert({
        where: { variantId_warehouseId: { variantId, warehouseId } },
        update: { quantity: afterQuantity },
        create: { variantId, warehouseId, quantity },
      });

      const orderNo = await buildOrderNo('RK', tx as any);
      const movement = await tx.stockMovement.create({
        data: {
          movementType: 'IN',
          quantity,
          note,
          variantId,
          toWarehouseId: warehouseId,
          bizRefType: 'INBOUND',
          bizRefId: orderNo,
          reason: '入库',
          operatorName: 'admin',
          beforeQuantity,
          afterQuantity,
        },
      });

      return { movement, orderNo, beforeQuantity, afterQuantity };
    });

    return Response.json(result);
  } catch (error: any) {
    return jsonErr(error?.message || '入库失败，请稍后重试', 500);
  }
}
