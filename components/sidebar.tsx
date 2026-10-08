'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@prisma/client';
import { LayoutDashboard, Users, GraduationCap, ClipboardCheck, BookOpen, Megaphone } from 'lucide-react';
import { Code, Pencil } from '@gravity-ui/icons';
const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/students', label: 'Siswa', icon: Users, roles: ['ADMIN', 'TEACHER'] },
  { href: '/students/edit', label: 'Edit Data Siswa', icon: Pencil, roles: ['TEACHER'] },
  { href: '/teachers', label: 'Guru', icon: GraduationCap, roles: ['ADMIN', 'TEACHER'] },
  { href: '/attendance', label: 'Absensi', icon: ClipboardCheck, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/grades', label: 'Nilai', icon: BookOpen, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/announcements', label: 'Pengumuman', icon: Megaphone, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/developer', label: 'Mode Developer', icon: Code, roles: ['ADMIN'] },
];
export function Sidebar({ role }: { role: UserRole }) {
  const path = usePathname();
  return <header className="portal-nav"><div className="page-container portal-nav-inner"><Link href="/" className="brand"><span className="brand-mark">M<span>·</span></span><span>MiniEdu<small>Ruang belajar bersama</small></span></Link><nav className="portal-links" aria-label="Navigasi utama">{links.filter(item => item.roles.includes(role)).map(({href,label,icon:Icon}) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined} className={`portal-nav-link ${path === href ? 'active' : ''}`}><Icon width={16} height={16}/>{label}</Link>)}</nav></div></header>;
}
