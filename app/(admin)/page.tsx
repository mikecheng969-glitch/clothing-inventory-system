const stats = [{ title: 'SKU 总数', value: '128' },{ title: '库存总件数', value: '9,820' },{ title: '低库存 SKU', value: '12' },{ title: '今日出库', value: '236' }];
export default function DashboardPage() {
  return <div className="space-y-6"><header><h2 className="text-2xl font-semibold">Dashboard</h2><p className="text-sm text-slate-500">查看库存核心指标和预警信息。</p></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item)=><article key={item.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">{item.title}</p><p className="mt-2 text-2xl font-semibold">{item.value}</p></article>)}</section></div>;
}
