import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Persons, Megaphone, ArrowRight } from '@gravity-ui/icons';

const services = [
  { title: 'Data sekolah', description: 'Identitas siswa, data guru, dan penempatan kelas dalam satu portal.', icon: Persons },
  { title: 'Kegiatan akademik', description: 'Pencatatan absensi dan nilai untuk mendukung keseharian belajar.', icon: BookOpen },
  { title: 'Pengumuman', description: 'Informasi sekolah yang dapat dibaca oleh seluruh pengguna portal.', icon: Megaphone },
];

export function PublicHome() {
  return <div className="school-home">
    <a className="skip-link" href="#school-main">Langsung ke konten</a>
    <header className="school-header">
      <div className="school-container school-header-inner">
        <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">M</span><span>MiniEdu<small>Ruang belajar bersama</small></span></Link>
        <nav aria-label="Navigasi halaman umum" className="school-nav">
          <a href="#tentang">Tentang</a>
          <a href="#layanan">Layanan akademik</a>
          <a href="#akses">Akses portal</a>
        </nav>
        <Link href="/login" className="school-button school-button-primary">Masuk</Link>
      </div>
    </header>
    <main id="school-main" className="school-container">
      <section id="tentang" className="school-hero" aria-labelledby="school-hero-title">
        <div className="school-hero-copy">
          <span className="school-label">Portal informasi sekolah</span>
          <h1 id="school-hero-title">Ruang bersama untuk kehidupan sekolah.</h1>
          <p>MiniEdu menghubungkan siswa, guru, dan administrasi sekolah. Data akademik dan informasi penting tersusun dalam satu tempat yang mudah diakses.</p>
          <div className="school-hero-actions">
            <Link href="/login" className="school-button school-button-primary">Masuk ke portal</Link>
            <a href="#layanan" className="school-button school-button-secondary">Lihat layanan</a>
          </div>
          <p className="school-account-note">Gunakan akun yang telah disiapkan oleh sekolah.</p>
        </div>
        <figure className="school-hero-photo">
          <Image src="/images/campus-hero.png" alt="Ilustrasi lingkungan sekolah dengan taman dan pepohonan" fill priority sizes="(max-width: 760px) 100vw, 45vw"/>
          <figcaption>Tempat belajar, tumbuh, dan terhubung.</figcaption>
        </figure>
      </section>

      <section id="layanan" className="school-services" aria-labelledby="school-services-title">
        <div className="school-section-heading"><div><span className="school-label">Layanan akademik</span><h2 id="school-services-title">Kebutuhan sekolah, lebih teratur.</h2></div><p>Informasi yang relevan untuk setiap peran, dari administrasi hingga hasil belajar.</p></div>
        <div className="school-service-list">{services.map(({ title, description, icon: Icon }) => <article key={title} className="school-service"><Icon width={24} height={24} aria-hidden="true"/><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
      </section>

      <section id="akses" className="school-access" aria-labelledby="school-access-title">
        <div className="school-access-intro"><span className="school-label">Warga sekolah</span><h2 id="school-access-title">Satu portal untuk setiap peran.</h2><p>Masuk dengan identitas akun sekolah untuk membuka layanan sesuai peran Anda.</p><Link href="/login" className="school-button school-button-primary">Buka portal</Link></div>
        <div className="school-role-list">
          <article><h3>Siswa</h3><p>Lihat nilai, riwayat kehadiran pribadi, dan pengumuman sekolah.</p><span>Masuk menggunakan NIS</span></article>
          <article><h3>Guru</h3><p>Catat absensi, kelola nilai, dan perbarui data siswa yang sudah terdaftar.</p><span>Masuk menggunakan NIP</span></article>
          <article><h3>Admin</h3><p>Kelola data siswa, guru, kegiatan akademik, dan pengumuman.</p><span>Masuk menggunakan username</span></article>
        </div>
      </section>

      <aside className="school-information" aria-labelledby="school-information-title"><div><span className="school-label">Informasi sekolah</span><h2 id="school-information-title">Ikuti kabar terbaru melalui portal.</h2><p>Pengumuman sekolah tersedia setelah Anda masuk ke akun.</p></div><Link href="/login" className="school-button school-button-secondary">Masuk untuk membaca <ArrowRight width={16} height={16} aria-hidden="true"/></Link></aside>
    </main>
    <footer className="school-footer"><div className="school-container school-footer-inner"><div><strong>MiniEdu</strong><p>Sistem informasi sekolah. Ruang belajar bersama.</p></div><nav aria-label="Navigasi footer"><a href="#tentang">Tentang</a><a href="#layanan">Layanan</a><Link href="/login">Masuk ke portal</Link></nav><small>© {new Date().getFullYear()} MiniEdu</small></div></footer>
  </div>;
}
