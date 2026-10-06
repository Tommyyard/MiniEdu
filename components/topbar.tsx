'use client';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@prisma/client';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
const titles: Record<string, string> = { '/': 'Dashboard', '/students': 'Siswa', '/teachers': 'Guru', '/attendance': 'Absensi', '/grades': 'Nilai', '/announcements': 'Pengumuman' };
export function Topbar({ today, user }: { today: string; user: { name: string; role: UserRole } }) {
  const pathname = usePathname();
  return <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-6 py-4 md:px-10"><div><div className="text-sm font-semibold">{titles[pathname] ?? 'MiniEdu'}</div><div className="text-xs text-muted-foreground">{today}</div></div><div className="flex items-center gap-2"><span className="hidden text-right text-xs text-muted-foreground sm:block"><strong className="block text-foreground">{user.name}</strong>{user.role}</span><ThemeToggle/><form action={logout}><Button type="submit" variant="secondary" size="sm">Keluar</Button></form></div></header>;
}
