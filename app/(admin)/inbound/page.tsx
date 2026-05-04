'use client';

import { useEffect, useState } from 'react';

type Variant = { id: string; sku: string; color: string; size: string; product: { name: string; code: string } };
type Warehouse = { id: string; name: string; code: string };
type InventoryRow = { id: string; quantity: number; warehouse: Warehouse; variant: Variant };

export default function Page() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stocks, setStocks] = useState<InventoryRow[]>([]);
  const [form, setForm] = useState({ variantId: '', warehouseId: '', quantity: '', note: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [v, w, s] = await Promise.all([
      fetch('/api/variants').then((r) => r.json()),
      fetch('/api/warehouses').then((r) => r.json()),
      fetch('/api/inventory').then((r) => r.json()),
    ]);
    setVariants(v);
    setWarehouses(w);
    setStocks(s);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    setMessage(''); setError('');
    const r = await fetch('/api/inbound', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!r.ok) return setError((await r.json()).message || '入库失败');
    setMessage('入库成功');
    setForm({ ...form, quantity: '', note: '' });
    load();
  };

  return <div className="space-y-4"><div className="rounded-lg border bg-white p-4"><h2 className="text-xl font-semibold">入库管理</h2>
    <div className="mt-3 grid gap-2 md:grid-cols-2">
      <select className="rounded border p-2 text-sm" value={form.variantId} onChange={(e) => setForm({ ...form, variantId: e.target.value })}><option value="">选择SKU</option>{variants.map((v)=><option key={v.id} value={v.id}>{v.product.name} / {v.sku} / {v.color}-{v.size}</option>)}</select>
      <select className="rounded border p-2 text-sm" value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}><option value="">选择仓库</option>{warehouses.map((w)=><option key={w.id} value={w.id}>{w.name}({w.code})</option>)}</select>
      <input className="rounded border p-2 text-sm" placeholder="入库数量" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
      <input className="rounded border p-2 text-sm" placeholder="备注" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
    </div>{error && <p className="mt-2 text-sm text-red-500">{error}</p>}{message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    <button onClick={submit} className="mt-3 rounded bg-brand-600 px-4 py-2 text-sm text-white">提交入库</button></div>
    <div className="rounded-lg border bg-white p-4"><h3 className="font-semibold">最新库存</h3><table className="mt-2 w-full text-sm"><thead><tr className="text-left"><th>商品</th><th>SKU</th><th>仓库</th><th>库存</th></tr></thead><tbody>{stocks.map((s)=><tr key={s.id} className="border-t"><td>{s.variant.product.name}</td><td>{s.variant.sku}</td><td>{s.warehouse.name}</td><td>{s.quantity}</td></tr>)}</tbody></table></div></div>;
}
