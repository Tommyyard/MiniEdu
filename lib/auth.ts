import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import type { UserRole } from '@prisma/client';
import { db } from '@/lib/db';

type SessionData = { userId?: string };
function sessionOptions() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith('replace-')) throw new Error('AUTH_SECRET harus diisi string acak minimal 32 karakter.');
  return { password: secret, cookieName: 'miniedu_session', cookieOptions: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' as const } };
}
export async function getSession() { return getIronSession<SessionData>(await cookies(), sessionOptions()); }
export const currentUser = cache(async () => {
  if (!process.env.AUTH_SECRET) return null;
  const session = await getSession();
  if (!session.userId) return null;
  return db.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, role: true, teacherId: true, studentId: true } });
});
export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect('/login');
  return user;
}
export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect('/');
  return user;
}
export async function allowed(roles: UserRole[]) {
  const user = await currentUser();
  return Boolean(user && roles.includes(user.role));
}
