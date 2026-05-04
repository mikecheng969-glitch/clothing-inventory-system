export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

const jsonErr = (message: string, status = 400) => Response.json({ message }, { status });

const buildOrderNo = async (tx: any) => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const begin = new Date(now);
  begin.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const count = await tx.stockMovement.count({ where: { movementType: 'OUT', createdAt: { gte: begin, lte: end } } });
  return `CK${date}${String(count + 1).padStart(4, '0')}`;
};

export async function POST(req: Request) {
  try {
    const d = await req.json();
    const variantId = d.variantId?.trim();
    const warehouseId = d.warehouseId?.trim();
    const quantity = Number(d.quantity);
    const note = d.note?.trim() || null;

    if (!variantId) return jsonErr('请选择 SKU');
    if (!warehouseId) return jsonErr('请选择出库仓库');
    if (!Number.isInteger(quantity) || quantity <= 0) return jsonErr('出库数量必须大于 0');

    const result = await prisma.$transaction(async (tx: any) => {
      const updateResult = await tx.inventoryStock.updateMany({
        where: { variantId, warehouseId, quantity: { gte: quantity } },
        data: { quantity: { decrement: quantity } },
      });

      if (updateResult.count === 0) {
        const stock = await tx.inventoryStock.findUnique({ where: { variantId_warehouseId: { variantId, warehouseId } } });
        const current = stock?.quantity ?? 0;
        throw new Error(`库存不足，当前仅剩 ${current}`);
      }

      const stock = await tx.inventoryStock.findUnique({ where: { variantId_warehouseId: { variantId, warehouseId } } });
      const afterQuantity = stock?.quantity ?? 0;
      const beforeQuantity = afterQuantity + quantity;

      const orderNo = await buildOrderNo(tx);
      const movement = await tx.stockMovement.create({
        data: {
          movementType: 'OUT',
          quantity,
          note,
          variantId,
          fromWarehouseId: warehouseId,
          bizRefType: 'OUTBOUND',
          bizRefId: orderNo,
          reason: '出库',
          operatorName: 'admin',
          beforeQuantity,
          afterQuantity,
        },
      });

      return { movement, orderNo, beforeQuantity, afterQuantity };
    });

    return Response.json(result);
  } catch (error: any) {
    const message = error?.message || '出库失败，请稍后重试';
    return jsonErr(message, message.includes('库存不足') ? 400 : 500);
  }
}
