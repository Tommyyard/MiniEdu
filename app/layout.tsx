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
  return <html lang="id" suppressHydrationWarning><body><ThemeProvider>{user ? <div className="min-h-screen"><a className="skip-link" href="#main-content">Langsung ke konten</a><Sidebar role={user.role}/><div className="portal-shell"><Topbar today={today} user={{ name: user.name, role: user.role }}/><main id="main-content" className="app-content">{children}</main></div></div> : <>{children}</>}</ThemeProvider></body></html>;
}
