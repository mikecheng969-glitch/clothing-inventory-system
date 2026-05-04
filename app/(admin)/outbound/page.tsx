'use client';
import { useEffect, useState } from 'react';

type Variant = { id: string; sku: string; color: string; size: string; product: { name: string } };
type Warehouse = { id: string; name: string; code: string };

export default function Page() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [form, setForm] = useState({ variantId: '', warehouseId: '', quantity: '', note: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { Promise.all([fetch('/api/variants').then(r=>r.json()), fetch('/api/warehouses').then(r=>r.json())]).then(([v,w])=>{setVariants(v);setWarehouses(w);}); }, []);

  const submit = async () => {
    setMsg(''); setErr('');
    const r = await fetch('/api/outbound',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    if(!r.ok) return setErr((await r.json()).message || '出库失败');
    setMsg('出库成功');
  };

  return <div className="rounded-lg border bg-white p-4"><h2 className="text-xl font-semibold">出库管理</h2><div className="mt-3 grid gap-2 md:grid-cols-2">
    <select className="rounded border p-2 text-sm" value={form.variantId} onChange={(e)=>setForm({...form,variantId:e.target.value})}><option value="">选择SKU</option>{variants.map(v=><option key={v.id} value={v.id}>{v.product.name}/{v.sku}/{v.color}-{v.size}</option>)}</select>
    <select className="rounded border p-2 text-sm" value={form.warehouseId} onChange={(e)=>setForm({...form,warehouseId:e.target.value})}><option value="">选择仓库</option>{warehouses.map(w=><option key={w.id} value={w.id}>{w.name}({w.code})</option>)}</select>
    <input className="rounded border p-2 text-sm" type="number" min={1} placeholder="出库数量" value={form.quantity} onChange={(e)=>setForm({...form,quantity:e.target.value})} />
    <input className="rounded border p-2 text-sm" placeholder="备注" value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} />
  </div>{err && <p className="mt-2 text-sm text-red-500">{err}</p>}{msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}<button onClick={submit} className="mt-3 rounded bg-brand-600 px-4 py-2 text-sm text-white">提交出库</button></div>;
}
