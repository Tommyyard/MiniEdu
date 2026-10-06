import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export type ActionResult = { ok: true; message: string } | { ok: false; message: string };
export const success = (message = 'Data berhasil disimpan.'): ActionResult => ({ ok: true, message });
export function failure(error: unknown): ActionResult {
  if (error instanceof ZodError) return { ok: false, message: error.issues[0]?.message ?? 'Data tidak valid.' };
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return { ok: false, message: 'Data dengan identitas tersebut sudah ada.' };
    if (error.code === 'P2025') return { ok: false, message: 'Data tidak ditemukan.' };
    if (error.code === 'P2003') return { ok: false, message: 'Data terkait tidak ditemukan atau masih digunakan.' };
  }
  console.error(error);
  return { ok: false, message: 'Terjadi kesalahan database. Silakan coba lagi.' };
}
export const value = (form: FormData, key: string) => String(form.get(key) ?? '');
