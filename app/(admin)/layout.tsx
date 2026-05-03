import { Sidebar } from '@/app/components/sidebar';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen"><Sidebar /><main className="w-full p-6">{children}</main></div>;
}
