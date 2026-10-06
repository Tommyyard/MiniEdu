'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { attendanceSchema } from '@/lib/validation';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { allowed } from '@/lib/auth';

export async function saveAttendance(classId: string, date: string, entries: { studentId: string; status: string }[]): Promise<ActionResult> {
  if (!await allowed(['ADMIN', 'TEACHER'])) return { ok: false, message: 'Anda tidak memiliki izin untuk mengubah absensi.' };
  try {
    if (!classId || !await db.class.findUnique({ where: { id: classId } })) return { ok: false, message: 'Kelas tidak ditemukan.' };
    if (!entries.length) return { ok: false, message: 'Kelas ini belum memiliki siswa.' };
    const parsed = entries.map(entry => attendanceSchema.parse({ ...entry, date }));
    if (new Set(parsed.map(entry => entry.studentId)).size !== parsed.length) return { ok: false, message: 'Siswa tercatat lebih dari sekali.' };
    const [count, classCount] = await Promise.all([
      db.student.count({ where: { id: { in: parsed.map(entry => entry.studentId) }, classId } }),
      db.student.count({ where: { classId } }),
    ]);
    if (count !== parsed.length || count !== classCount) return { ok: false, message: 'Daftar siswa tidak sesuai dengan kelas. Muat ulang halaman.' };
    const day = new Date(`${date}T00:00:00.000Z`);
    await db.$transaction(parsed.map(entry => db.attendance.upsert({
      where: { studentId_date: { studentId: entry.studentId, date: day } },
      create: { studentId: entry.studentId, date: day, status: entry.status },
      update: { status: entry.status },
    })));
    revalidatePath('/attendance'); revalidatePath('/'); return success('Absensi berhasil disimpan.');
  } catch (error) { return failure(error); }
}
