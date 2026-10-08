import Link from 'next/link';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { PageHeading } from '@/components/page-heading';

export const dynamic = 'force-dynamic';
export default async function DeveloperPage() {
  await requireRole(['ADMIN']);
  const [students, teachers, classes, grades, announcements] = await Promise.all([db.student.count(), db.teacher.count(), db.class.count(), db.grade.count(), db.announcement.count()]);
  const metrics = [
    { label: 'Siswa', value: students, href: '/students' },
    { label: 'Guru', value: teachers, href: '/teachers' },
    { label: 'Kelas', value: classes, href: '/students' },
    { label: 'Nilai', value: grades, href: '/grades' },
    { label: 'Pengumuman', value: announcements, href: '/announcements' },
  ];
  return <div className="developer-page"><PageHeading title="Mode Developer" description="Ikhtisar data dan pintasan pengelolaan sistem sekolah."/><div className="developer-grid">{metrics.map(metric => <Link className="panel developer-metric" href={metric.href} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><span>Buka data</span></Link>)}</div><section className="panel developer-links"><h2>Kelola data sekolah</h2><p>Gunakan pintasan berikut untuk memeriksa dan memperbarui data.</p><div><Link href="/students">Data siswa</Link><Link href="/teachers">Data guru</Link><Link href="/attendance">Absensi</Link><Link href="/grades">Nilai</Link><Link href="/announcements">Pengumuman</Link></div></section></div>;
}
