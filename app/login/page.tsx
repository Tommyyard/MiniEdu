import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
export const dynamic = 'force-dynamic';
export default async function LoginPage() {
  if (await currentUser()) redirect('/');
  return <div className="mx-auto mt-16 max-w-md"><Card><CardHeader><h1 className="text-2xl font-bold">Masuk ke MiniEdu</h1><p className="mt-1 text-sm text-muted-foreground">Gunakan akun sekolah yang telah disiapkan.</p></CardHeader><CardContent><LoginForm/></CardContent></Card></div>;
}
