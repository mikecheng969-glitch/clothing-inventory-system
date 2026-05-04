import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({ where: { name: '系统管理员' }, update: { role: 'admin' }, create: { name: '系统管理员', role: 'admin' } });

  const categoryNames = ['童装', '女装', '男装', '配饰', '民族服饰'];
  const categories = await Promise.all(categoryNames.map((name) => prisma.category.upsert({ where: { name }, update: {}, create: { name } })));

  const product = await prisma.product.upsert({
    where: { code: 'P-LZT-TS-001' },
    update: { categoryId: categories[0].id, brand: '黎锦工坊', season: '夏季', gender: '女童', status: 'ACTIVE' },
    create: { code: 'P-LZT-TS-001', name: '黎族童装短袖', categoryId: categories[0].id, description: 'MVP 初始商品', brand: '黎锦工坊', season: '夏季', gender: '女童', status: 'ACTIVE' }
  });

  const mainWh = await prisma.warehouse.upsert({ where: { code: 'WH-MAIN' }, update: { manager: '王主管' }, create: { code: 'WH-MAIN', name: '主仓库', manager: '王主管' } });
  const storeWh = await prisma.warehouse.upsert({ where: { code: 'WH-STORE' }, update: { manager: '李店长' }, create: { code: 'WH-STORE', name: '门店仓', manager: '李店长' } });

  const variant = await prisma.variant.upsert({
    where: { sku: 'LZT-RD-120-GIRL' },
    update: { status: 'ACTIVE', lowStockLevel: 10 },
    create: { sku: 'LZT-RD-120-GIRL', barcode: '690000000001', color: '红色', size: '120', style: '女童款', costPrice: 35.0, salePrice: 79.0, productId: product.id, status: 'ACTIVE', lowStockLevel: 10 }
  });

  await prisma.inventoryStock.upsert({ where: { variantId_warehouseId: { variantId: variant.id, warehouseId: mainWh.id } }, update: { quantity: 100 }, create: { variantId: variant.id, warehouseId: mainWh.id, quantity: 100 } });

  await prisma.stockMovement.create({ data: { movementType: "IN" as any, quantity: 100, unitCost: 35, note: '初始化入库', variantId: variant.id, toWarehouseId: mainWh.id, operatorId: admin.id, bizRefType: 'SEED' } });
  await prisma.stockMovement.create({ data: { movementType: "TRANSFER" as any, quantity: 10, note: '样例调拨', variantId: variant.id, fromWarehouseId: mainWh.id, toWarehouseId: storeWh.id, operatorId: admin.id, bizRefType: 'SEED' } });
}

main().finally(async () => prisma.$disconnect());
