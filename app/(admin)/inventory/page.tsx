'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const load = async () => setRows(await fetch(`/api/inventory?keyword=${encodeURIComponent(keyword)}`).then(r=>r.json()));
  useEffect(()=>{load();},[]);

  return <div className="rounded-lg border bg-white p-4"><h2 className="text-xl font-semibold">库存查询</h2><div className="mt-3 flex gap-2"><input className="w-80 rounded border p-2 text-sm" value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="按商品名称/货号/SKU/条码/颜色/尺码/仓库搜索" /><button className="rounded border px-3" onClick={load}>搜索</button></div>
  <table className="mt-3 w-full text-sm"><thead><tr className="text-left"><th>商品名称</th><th>商品货号</th><th>SKU</th><th>条码</th><th>颜色</th><th>尺码</th><th>仓库</th><th>当前库存</th><th>锁定库存</th><th>可用库存</th><th>预警库存</th></tr></thead><tbody>{rows.map((r)=>{const warning=r.variant.lowStockLevel??0;const locked=0;const available=r.quantity-locked;const low=r.quantity<=warning;return <tr key={r.id} className={`border-t ${low?'bg-red-50':''}`}><td>{r.variant.product.name}</td><td>{r.variant.product.code}</td><td>{r.variant.sku}</td><td>{r.variant.barcode}</td><td>{r.variant.color}</td><td>{r.variant.size}</td><td>{r.warehouse.name}</td><td className={low?'font-semibold text-red-600':''}>{r.quantity}</td><td>{locked}</td><td>{available}</td><td>{warning}</td></tr>;})}</tbody></table></div>;
}
