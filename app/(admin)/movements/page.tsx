'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const load = async () => setRows(await fetch(`/api/movements?keyword=${encodeURIComponent(keyword)}&type=${type}`).then(r=>r.json()));
  useEffect(()=>{load();},[]);

  return <div className="rounded-lg border bg-white p-4"><h2 className="text-xl font-semibold">库存流水</h2><div className="mt-3 flex gap-2"><input className="w-72 rounded border p-2 text-sm" value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="按SKU/商品名称/仓库搜索"/><select className="rounded border p-2 text-sm" value={type} onChange={(e)=>setType(e.target.value)}><option value="">全部类型</option><option value="IN">IN</option><option value="OUT">OUT</option></select><button className="rounded border px-3" onClick={load}>搜索</button></div>
  <div className="overflow-x-auto"><table className="mt-3 min-w-full text-sm"><thead><tr className="text-left"><th>单据号</th><th>类型</th><th>商品名称</th><th>SKU</th><th>颜色</th><th>尺码</th><th>来源仓库</th><th>目标仓库</th><th>数量</th><th>变动前库存</th><th>变动后库存</th><th>原因</th><th>备注</th><th>操作人</th><th>创建时间</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id} className="border-t"><td>{r.bizRefId}</td><td>{r.movementType}</td><td>{r.variant.product.name}</td><td>{r.variant.sku}</td><td>{r.variant.color}</td><td>{r.variant.size}</td><td>{r.fromWarehouse?.name || '-'}</td><td>{r.toWarehouse?.name || '-'}</td><td>{r.quantity}</td><td>{r.beforeQuantity}</td><td>{r.afterQuantity}</td><td>{r.reason || '-'}</td><td>{r.note || '-'}</td><td>{r.operatorName || 'system'}</td><td>{new Date(r.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div></div>;
}
