import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
export const dynamic = 'force-dynamic';
export default async function LoginPage() {
  if (await currentUser()) redirect('/');
  return <div className="login-page"><header className="page-container login-header"><Link href="/" className="brand"><span className="brand-mark">M<span>·</span></span><span>MiniEdu<small>Ruang belajar bersama</small></span></Link><Link href="/" className="text-link">← Kembali ke beranda</Link></header><main className="login-layout page-container"><div className="login-photo"><Image src="/images/campus-hero.png" alt="Lingkungan sekolah MiniEdu" fill priority sizes="(max-width: 768px) 100vw, 50vw"/><div><span className="eyebrow light-eyebrow">SELAMAT DATANG KEMBALI</span><h2>Tempat setiap langkah belajar dimulai.</h2></div></div><Card className="login-card"><CardHeader><span className="eyebrow">PORTAL MINIEDU</span><h1 className="mt-3 text-4xl font-bold tracking-tight">Masuk ke akun Anda.</h1><p className="mt-2 text-sm text-muted-foreground">Gunakan akun sekolah yang telah disiapkan.</p></CardHeader><CardContent><LoginForm/></CardContent></Card></main></div>;
}
