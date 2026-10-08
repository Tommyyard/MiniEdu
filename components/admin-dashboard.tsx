import Link from 'next/link';
import { Persons, GraduationCap, BookOpen, Calendar, Megaphone, ArrowRight } from '@gravity-ui/icons';

type Props = {
  name: string;
  counts: { students: number; teachers: number; classes: number; grades: number; attendance: number; announcements: number };
  announcements: { id: string; title: string; content: string; createdAt: Date }[];
};

const work = [
  { title: 'Data siswa', description: 'Kelola identitas dan penempatan kelas.', href: '/students', icon: Persons },
  { title: 'Data guru', description: 'Kelola pengajar dan mata pelajaran.', href: '/teachers', icon: GraduationCap },
  { title: 'Absensi', description: 'Catat kehadiran berdasarkan kelas dan tanggal.', href: '/attendance', icon: Calendar },
  { title: 'Nilai siswa', description: 'Catat dan periksa hasil belajar.', href: '/grades', icon: BookOpen },
];

export function AdminDashboard({ name, counts, announcements }: Props) {
  const metrics = [
    { label: 'Siswa', value: counts.students, unit: 'siswa terdaftar', href: '/students' },
    { label: 'Guru', value: counts.teachers, unit: 'pengajar terdaftar', href: '/teachers' },
    { label: 'Kelas', value: counts.classes, unit: 'kelas terdata', href: '/students' },
    { label: 'Nilai', value: counts.grades, unit: 'catatan hasil belajar', href: '/grades' },
    { label: 'Catatan hadir', value: counts.attendance, unit: 'seluruh periode', href: '/attendance' },
    { label: 'Pengumuman', value: counts.announcements, unit: 'informasi sekolah', href: '/announcements' },
  ];
  return <div className="admin-overview">
    <header className="admin-heading"><div><span className="admin-label">Administrasi sekolah</span><h1>Selamat datang, {name}.</h1><p>Kelola data akademik dan informasi sekolah dari satu ruang kerja.</p></div><Link href="/attendance" className="school-button school-button-primary">Catat absensi</Link></header>
    <section aria-labelledby="admin-summary-title" className="admin-summary"><div className="admin-section-heading"><h2 id="admin-summary-title">Ringkasan sekolah</h2><span>Jumlah data yang tercatat</span></div><div className="admin-metrics">{metrics.map(metric => <Link href={metric.href} className="admin-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value.toLocaleString('id-ID')}</strong><small>{metric.unit}</small></Link>)}</div></section>
    <div className="admin-content-grid">
      <section className="admin-workspace" aria-labelledby="admin-work-title"><div className="admin-section-heading"><div><h2 id="admin-work-title">Pengelolaan akademik</h2><p>Pilih layanan untuk mulai bekerja.</p></div></div><div className="admin-work-grid">{work.map(({ title, description, href, icon: Icon }) => <Link href={href} className="admin-work-link" key={href}><Icon width={24} height={24} aria-hidden="true"/><h3>{title}</h3><p>{description}</p><span>Buka {title.toLowerCase()} <ArrowRight width={15} height={15} aria-hidden="true"/></span></Link>)}</div><div className="admin-publish"><Megaphone width={24} height={24} aria-hidden="true"/><div><h3>Informasikan kepada warga sekolah</h3><p>Kelola pengumuman untuk siswa dan guru.</p></div><Link href="/announcements" className="school-button school-button-secondary">Kelola pengumuman</Link></div></section>
      <section className="admin-announcements" aria-labelledby="admin-news-title"><div className="admin-section-heading"><h2 id="admin-news-title">Pengumuman terbaru</h2><Link href="/announcements">Lihat semua</Link></div>{announcements.length ? <div className="admin-news-list">{announcements.map(item => <article className="admin-news-card" key={item.id}><time dateTime={item.createdAt.toISOString()}>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(item.createdAt)}</time><h3><Link href="/announcements">{item.title}</Link></h3><p>{item.content}</p><Link href="/announcements" className="admin-news-link">Buka pengumuman</Link></article>)}</div> : <div className="admin-news-empty"><Megaphone width={28} height={28} aria-hidden="true"/><h3>Belum ada pengumuman</h3><p>Pengumuman yang dibuat akan tampil di sini.</p><Link href="/announcements" className="school-button school-button-secondary">Kelola pengumuman</Link></div>}</section>
    </div>
  </div>;
}
