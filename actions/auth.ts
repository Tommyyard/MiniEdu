'use server';
import { compare } from 'bcryptjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import type { ActionResult } from '@/lib/action-result';
export async function login(form: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({ identifier: String(form.get('identifier') ?? ''), password: String(form.get('password') ?? '') });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Input tidak valid.' };
  try {
    const user = await db.user.findUnique({
      where: { identifier: parsed.data.identifier },
      include: { teacher: { select: { nip: true } }, student: { select: { nis: true } } },
    });
    const matchesRole = user?.role === 'ADMIN'
      || (user?.role === 'TEACHER' && user.teacher?.nip === parsed.data.identifier)
      || (user?.role === 'STUDENT' && user.student?.nis === parsed.data.identifier);
    if (!matchesRole || !user || !await compare(parsed.data.password, user.passwordHash)) return { ok: false, message: 'Username/NIP/NIS atau password salah.' };
    const session = await getSession();
    session.userId = user.id;
    await session.save();
    return { ok: true, message: 'Login berhasil.' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Login belum tersedia. Periksa koneksi database dan konfigurasi auth.' };
  }
}
export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}
