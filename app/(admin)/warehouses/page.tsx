'use client';

import { useEffect, useState } from 'react';

type Row = {
  id: string;
  name: string;
  location?: string | null;
  manager?: string | null;
  createdAt: string;
};

type WarehouseForm = {
  name: string;
  location: string;
  manager: string;
};

const empty: WarehouseForm = {
  name: '',
  location: '',
  manager: '',
};

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<WarehouseForm>(empty);
  const [keyword, setKeyword] = useState('');
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const data = await fetch(
      `/api/warehouses?keyword=${encodeURIComponent(keyword)}`,
    ).then((r) => r.json());
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setError('');
    const r = await fetch(editingId ? `/api/warehouses/${editingId}` : '/api/warehouses', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!r.ok) {
      setError((await r.json()).message || '仓库保存失败，请稍后重试');
      return;
    }

    setForm(empty);
    setEditingId('');
    load();
  };

  const del = async (id: string) => {
    if (!confirm('确定删除仓库吗？')) return;
    const r = await fetch(`/api/warehouses/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      setError((await r.json()).message || '仓库删除失败，请稍后重试');
      return;
    }
    load();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h2 className="text-xl font-semibold">仓库管理</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {['name', 'location', 'manager'].map((k) => (
            <input
              key={k}
              className="rounded border p-2 text-sm"
              placeholder={
                k === 'name' ? '仓库名称*' : k === 'location' ? '仓库位置' : '负责人'
              }
              value={form[k as keyof WarehouseForm]}
              onChange={(e) =>
                setForm({ ...form, [k]: e.target.value } as WarehouseForm)
              }
            />
          ))}
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <button
          className="mt-3 rounded bg-brand-600 px-4 py-2 text-sm text-white"
          onClick={save}
        >
          {editingId ? '更新' : '新增'}
        </button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-3 flex gap-2">
          <input
            className="w-80 rounded border p-2 text-sm"
            placeholder="按仓库名称/位置/负责人搜索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="rounded border px-3" onClick={load}>
            搜索
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>仓库名称</th>
              <th>仓库位置</th>
              <th>负责人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td>{r.name}</td>
                <td>{r.location}</td>
                <td>{r.manager}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="mr-2 text-blue-600"
                    onClick={() => {
                      setEditingId(r.id);
                      setForm({
                        name: r.name,
                        location: r.location || '',
                        manager: r.manager || '',
                      });
                    }}
                  >
                    编辑
                  </button>
                  <button className="text-red-600" onClick={() => del(r.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
