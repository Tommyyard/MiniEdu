'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@prisma/client';
import { LayoutDashboard, Users, GraduationCap, ClipboardCheck, BookOpen, Megaphone, School } from 'lucide-react';
const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/students', label: 'Siswa', icon: Users, roles: ['ADMIN', 'TEACHER'] },
  { href: '/teachers', label: 'Guru', icon: GraduationCap, roles: ['ADMIN', 'TEACHER'] },
  { href: '/attendance', label: 'Absensi', icon: ClipboardCheck, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/grades', label: 'Nilai', icon: BookOpen, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/announcements', label: 'Pengumuman', icon: Megaphone, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
];
export function Sidebar({ role }: { role: UserRole }) {
  const path = usePathname();
  return <aside className="w-full shrink-0 border-b border-border bg-card md:min-h-screen md:w-60 md:border-b-0 md:border-r">
    <div className="flex items-center gap-3 px-5 py-6"><span className="rounded-xl bg-primary p-2 text-primary-foreground"><School size={22}/></span><div><div className="text-lg font-bold tracking-tight">MiniEdu</div><div className="text-xs text-muted-foreground">School Management</div></div></div>
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1" aria-label="Navigasi utama">{links.filter(item => item.roles.includes(role)).map(({href,label,icon:Icon}) => <Link key={href} href={href} className={`flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${path === href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon size={18}/>{label}</Link>)}</nav>
  </aside>;
}
