import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { ThemeProvider } from '@/components/theme-provider';
import { currentUser } from '@/lib/auth';
export const metadata: Metadata = { title: 'MiniEdu', description: 'Sistem informasi sekolah sederhana' };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();
  const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeZone: 'Asia/Jakarta' }).format(new Date());
  return <html lang="id" suppressHydrationWarning><body><ThemeProvider>{user ? <div className="min-h-screen md:flex"><Sidebar role={user.role}/><div className="min-w-0 flex-1"><Topbar today={today} user={{ name: user.name, role: user.role }}/><main className="mx-auto max-w-7xl p-5 md:p-10">{children}</main></div></div> : <main className="min-h-screen px-5 py-8">{children}</main>}</ThemeProvider></body></html>;
}
