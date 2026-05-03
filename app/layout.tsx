import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '服装库存管理系统 MVP', description: '基于 Next.js + Prisma 的服装库存管理系统' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
