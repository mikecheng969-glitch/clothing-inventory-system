import Link from 'next/link';
import { LayoutDashboard, Shirt, Package2, Warehouse, ArrowDownToLine, ArrowUpFromLine, Boxes, ClipboardCheck, ListOrdered, BarChart3, Settings } from 'lucide-react';
const menus = [
  { href: '/', label: '首页看板', icon: LayoutDashboard },
  { href: '/products', label: '商品管理', icon: Shirt },
  { href: '/variants', label: 'SKU管理', icon: Package2 },
  { href: '/warehouses', label: '仓库管理', icon: Warehouse },
  { href: '/inbound', label: '入库管理', icon: ArrowDownToLine },
  { href: '/outbound', label: '出库管理', icon: ArrowUpFromLine },
  { href: '/inventory', label: '库存查询', icon: Boxes },
  { href: '/stock-count', label: '库存盘点', icon: ClipboardCheck },
  { href: '/movements', label: '库存流水', icon: ListOrdered },
  { href: '/reports', label: '报表统计', icon: BarChart3 },
  { href: '/settings', label: '系统设置', icon: Settings }
];
export function Sidebar() {
  return <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block"><div className="mb-6 rounded-lg bg-brand-50 p-3"><p className="text-sm text-brand-700">服装库存管理系统</p><h1 className="text-lg font-semibold text-brand-700">Inventory MVP</h1></div><nav className="space-y-1">{menus.map((menu)=>{const Icon=menu.icon;return <Link key={menu.href} href={menu.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"><Icon className="h-4 w-4" />{menu.label}</Link>;})}</nav></aside>;
}
