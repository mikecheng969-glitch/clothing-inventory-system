import { PrismaClient, MovementType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { name: '系统管理员' },
    update: { role: 'admin' },
    create: { name: '系统管理员', role: 'admin' }
  });

  const category = await prisma.category.upsert({
    where: { name: '童装短袖' },
    update: {},
    create: { name: '童装短袖' }
  });

  const product = await prisma.product.upsert({
    where: { code: 'P-LZT-TS-001' },
    update: {},
    create: {
      code: 'P-LZT-TS-001',
      name: '黎族童装短袖',
      categoryId: category.id,
      description: 'MVP 初始商品'
    }
  });

  const mainWh = await prisma.warehouse.upsert({ where: { code: 'WH-MAIN' }, update: {}, create: { code: 'WH-MAIN', name: '主仓库' } });
  const storeWh = await prisma.warehouse.upsert({ where: { code: 'WH-STORE' }, update: {}, create: { code: 'WH-STORE', name: '门店仓' } });

  const variant = await prisma.variant.upsert({
    where: { sku: 'LZT-RD-120-GIRL' },
    update: {},
    create: {
      sku: 'LZT-RD-120-GIRL',
      barcode: '690000000001',
      color: '红色',
      size: '120',
      style: '女童款',
      costPrice: 35.0,
      salePrice: 79.0,
      productId: product.id
    }
  });

  await prisma.inventoryStock.upsert({
    where: { variantId_warehouseId: { variantId: variant.id, warehouseId: mainWh.id } },
    update: { quantity: 100 },
    create: { variantId: variant.id, warehouseId: mainWh.id, quantity: 100 }
  });

  await prisma.stockMovement.create({
    data: {
      movementType: MovementType.IN,
      quantity: 100,
      unitCost: 35,
      note: '初始化入库',
      variantId: variant.id,
      toWarehouseId: mainWh.id,
      operatorId: admin.id,
      bizRefType: 'SEED'
    }
  });

  await prisma.stockMovement.create({
    data: {
      movementType: MovementType.TRANSFER,
      quantity: 10,
      note: '样例调拨',
      variantId: variant.id,
      fromWarehouseId: mainWh.id,
      toWarehouseId: storeWh.id,
      operatorId: admin.id,
      bizRefType: 'SEED'
    }
  });
}

main().finally(async () => prisma.$disconnect());
