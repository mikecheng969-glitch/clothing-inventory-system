# 服装库存管理系统 MVP

基于 **Next.js App Router + TypeScript + Tailwind CSS + Prisma + SQLite** 的服装库存管理后台 MVP。

## 1. 功能范围（第一版）

- Dashboard 首页看板
- Products 商品管理
- Variants SKU 管理
- Warehouses 仓库管理
- Inbound 入库管理
- Outbound 出库管理
- Inventory 库存查询
- Stock Count 库存盘点
- Movements 库存流水
- Reports 报表
- Settings 系统设置

## 2. 技术栈

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite（本地开发）
- 预留 PostgreSQL 迁移能力（通过 `DB_PROVIDER` + `DATABASE_URL`）

## 3. 快速启动

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

浏览器访问：`http://localhost:3000`

## 4. 环境变量

`.env.example`

```env
DATABASE_URL="file:./dev.db"
```

如果要迁移到 PostgreSQL：

```env
DB_PROVIDER="postgresql"
DATABASE_URL="postgresql://user:password@localhost:5432/clothing_inventory?schema=public"
```

## 5. Prisma 数据模型设计（核心）

- `Product`：商品主档（款式级）
- `Variant`：SKU（颜色/尺码/款式组合）
- `Warehouse`：仓库
- `StorageLocation`：库位
- `InventoryStock`：当前库存快照（按 SKU + 仓库唯一）
- `StockMovement`：库存流水（IN/OUT/TRANSFER/ADJUSTMENT/DAMAGE/RETURN）
- `Category`：商品分类
- `User`：操作人（预留角色字段）

> 规则：库存变化以 `StockMovement` 为来源，`InventoryStock` 保存当前结果。

## 6. 项目结构

```text
.
├── app
│   ├── (admin)
│   │   ├── dashboard(page.tsx)
│   │   ├── products/
│   │   ├── variants/
│   │   ├── warehouses/
│   │   ├── inbound/
│   │   ├── outbound/
│   │   ├── inventory/
│   │   ├── stock-count/
│   │   ├── movements/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── components/sidebar.tsx
│   ├── globals.css
│   └── layout.tsx
├── lib
│   ├── prisma.ts
│   └── utils.ts
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── next.config.ts
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 7. 后续扩展建议

- 采购订单、销售订单模块
- 门店与组织架构
- 权限控制（RBAC）
- 扫码枪与条码打印
- Excel 导入导出
- 电商平台订单同步

## 8. MVP 首批可用功能（已实现）

- 商品管理：列表、搜索（名称/货号/分类）、新增、编辑、删除（存在 SKU 时禁止删除）。
- SKU 管理：列表、搜索（商品/SKU/条码/颜色/尺码）、新增、编辑、删除。
- 仓库管理：列表、新增、编辑、删除。
- Seed 分类默认包含：童装、女装、男装、配饰、民族服饰。
