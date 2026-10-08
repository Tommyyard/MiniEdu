import Link from 'next/link';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { PublicHome } from '@/components/public-home';
import { AdminDashboard } from '@/components/admin-dashboard';
import './home-redesign.css';

export const dynamic = 'force-dynamic';
async function PortalHome({ name, role, studentId }: { name: string; role: 'ADMIN' | 'TEACHER' | 'STUDENT'; studentId: string | null }) {
  const isStudent = role === 'STUDENT';
  const recent = await db.announcement.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  const [studentCount, teacherCount, classCount, gradeCount, attendanceCount, announcementCount] = await Promise.all([
    isStudent ? Promise.resolve(0) : db.student.count(),
    isStudent ? Promise.resolve(0) : db.teacher.count(),
    isStudent ? Promise.resolve(0) : db.class.count(),
    db.grade.count({ where: isStudent ? { studentId: studentId ?? '__none__' } : {} }),
    db.attendance.count({ where: isStudent ? { studentId: studentId ?? '__none__', status: 'PRESENT' } : { status: 'PRESENT' } }),
    db.announcement.count(),
  ]);
  const firstName = name.trim().split(' ')[0] || name;
  const adminView = role === 'ADMIN' ? <AdminDashboard name={firstName} counts={{ students: studentCount, teachers: teacherCount, classes: classCount, grades: gradeCount, attendance: attendanceCount, announcements: announcementCount }} announcements={recent}/> : null;
  if (adminView) return adminView;
  const metrics = isStudent ? [
    { label: 'Catatan nilai', value: gradeCount, href: '/grades' },
    { label: 'Hari hadir', value: attendanceCount, href: '/attendance' },
    { label: 'Pengumuman', value: announcementCount, href: '/announcements' },
  ] : [
    { label: 'Siswa', value: studentCount, href: '/students' },
    { label: 'Guru', value: teacherCount, href: '/teachers' },
    { label: 'Kelas', value: classCount, href: '/students' },
  ];
  const shortcuts = isStudent ? [
    { label: 'Lihat nilai', href: '/grades', detail: 'Hasil belajar saya' },
    { label: 'Lihat absensi', href: '/attendance', detail: 'Riwayat kehadiran' },
    { label: 'Baca pengumuman', href: '/announcements', detail: 'Kabar sekolah' },
  ] : role === 'TEACHER' ? [
    { label: 'Catat absensi', href: '/attendance', detail: 'Kehadiran per kelas' },
    { label: 'Kelola nilai', href: '/grades', detail: 'Hasil belajar siswa' },
    { label: 'Edit data siswa', href: '/students/edit', detail: 'Identitas dan kelas' },
  ] : [
    { label: 'Kelola siswa', href: '/students', detail: 'Data dan kelas' },
    { label: 'Catat absensi', href: '/attendance', detail: 'Kehadiran per kelas' },
    { label: 'Kelola nilai', href: '/grades', detail: 'Hasil belajar siswa' },
    { label: 'Kelola guru', href: '/teachers', detail: 'Data pengajar' },
  ];
  return <div className="dashboard">
    <header className="dashboard-intro"><div><p className="dashboard-kicker">Beranda {role === 'ADMIN' ? 'admin' : role === 'TEACHER' ? 'guru' : 'siswa'}</p><h1>Selamat datang, {firstName}.</h1><p>{isStudent ? 'Pantau hasil belajar, kehadiran, dan kabar sekolah.' : 'Ringkasan sekolah dan pekerjaan yang sering Anda lakukan.'}</p></div><Link href={isStudent ? '/announcements' : '/attendance'} className="dashboard-primary-link">{isStudent ? 'Baca pengumuman' : 'Buka absensi'}</Link></header>
    <section aria-labelledby="summary-title" className="dashboard-summary"><div className="dashboard-section-head"><h2 id="summary-title">Ringkasan</h2><span>Data sekolah terkini</span></div><div className="dashboard-metrics">{metrics.map(metric => <Link href={metric.href} className="dashboard-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value.toLocaleString('id-ID')}</strong><span className="metric-open">Lihat data</span></Link>)}</div></section>
    <div className="dashboard-columns"><section aria-labelledby="quick-title" className="dashboard-work"><div className="dashboard-section-head"><h2 id="quick-title">Akses cepat</h2><span>Pilih pekerjaan Anda</span></div><div className="dashboard-shortcuts">{shortcuts.map(shortcut => <Link href={shortcut.href} key={shortcut.href} className="dashboard-shortcut"><span><strong>{shortcut.label}</strong><small>{shortcut.detail}</small></span><span aria-hidden="true">↗</span></Link>)}</div></section><section aria-labelledby="news-title" className="dashboard-news"><div className="dashboard-section-head"><h2 id="news-title">Pengumuman terbaru</h2><Link href="/announcements">Lihat semua</Link></div>{recent.length ? <div>{recent.map(item => <Link href="/announcements" className="dashboard-news-row" key={item.id}><strong>{item.title}</strong><time dateTime={item.createdAt.toISOString()}>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(item.createdAt)}</time></Link>)}</div> : <p className="dashboard-empty">Belum ada pengumuman. Kabar sekolah akan tampil di sini.</p>}</section></div>
  </div>;
}

export default async function HomePage() {
  const user = await currentUser();
  if (!user) return <PublicHome/>;
  return <PortalHome name={user.name} role={user.role} studentId={user.studentId}/>;
}
