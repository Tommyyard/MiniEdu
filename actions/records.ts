'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { announcementSchema, gradeSchema, studentSchema, teacherSchema } from '@/lib/validation';
import { failure, success, value, type ActionResult } from '@/lib/action-result';
import { allowed } from '@/lib/auth';
const forbidden = (): ActionResult => ({ ok: false, message: 'Anda tidak memiliki izin untuk tindakan ini.' });

export async function saveStudent(form: FormData): Promise<ActionResult> {
  if (!await allowed(['ADMIN', 'TEACHER'])) return forbidden();
  try {
    const id = value(form, 'id');
    if (!id && !await allowed(['ADMIN'])) return forbidden();
    const data = studentSchema.parse({ nis: value(form, 'nis'), name: value(form, 'name'), gender: value(form, 'gender'), classId: value(form, 'classId') });
    if (!await db.class.findUnique({ where: { id: data.classId } })) return { ok: false, message: 'Kelas tidak ditemukan.' };
    if (id) await db.$transaction(async tx => {
      await tx.student.update({ where: { id }, data });
      await tx.user.updateMany({ where: { studentId: id, role: 'STUDENT' }, data: { identifier: data.nis } });
    }); else await db.student.create({ data });
    revalidatePath('/students'); revalidatePath('/'); return success();
  } catch (error) { return failure(error); }
}
export async function deleteStudent(id: string): Promise<ActionResult> {
  if (!await allowed(['ADMIN'])) return forbidden();
  try { await db.$transaction([db.user.deleteMany({ where: { studentId: id } }), db.student.delete({ where: { id } })]); revalidatePath('/students'); revalidatePath('/grades'); revalidatePath('/attendance'); revalidatePath('/'); return success('Siswa berhasil dihapus.'); }
  catch (error) { return failure(error); }
}
export async function saveTeacher(form: FormData): Promise<ActionResult> {
  if (!await allowed(['ADMIN'])) return forbidden();
  try {
    const id = value(form, 'id');
    const data = teacherSchema.parse({ nip: value(form, 'nip'), name: value(form, 'name'), subject: value(form, 'subject'), phone: value(form, 'phone') });
    if (id) await db.$transaction(async tx => {
      await tx.teacher.update({ where: { id }, data });
      await tx.user.updateMany({ where: { teacherId: id, role: 'TEACHER' }, data: { identifier: data.nip } });
    }); else await db.teacher.create({ data });
    revalidatePath('/teachers'); revalidatePath('/'); return success();
  } catch (error) { return failure(error); }
}
export async function deleteTeacher(id: string): Promise<ActionResult> {
  if (!await allowed(['ADMIN'])) return forbidden();
  try { await db.$transaction([db.user.deleteMany({ where: { teacherId: id } }), db.teacher.delete({ where: { id } })]); revalidatePath('/teachers'); revalidatePath('/'); return success('Guru berhasil dihapus.'); }
  catch (error) { return failure(error); }
}
export async function saveGrade(form: FormData): Promise<ActionResult> {
  if (!await allowed(['ADMIN', 'TEACHER'])) return forbidden();
  try {
    const id = value(form, 'id');
    const data = gradeSchema.parse({ studentId: value(form, 'studentId'), subject: value(form, 'subject'), semester: value(form, 'semester'), score: value(form, 'score') });
    if (!await db.student.findUnique({ where: { id: data.studentId } })) return { ok: false, message: 'Siswa tidak ditemukan.' };
    if (id) await db.grade.update({ where: { id }, data }); else await db.grade.create({ data });
    revalidatePath('/grades'); return success();
  } catch (error) { return failure(error); }
}
export async function deleteGrade(id: string): Promise<ActionResult> {
  if (!await allowed(['ADMIN', 'TEACHER'])) return forbidden();
  try { await db.grade.delete({ where: { id } }); revalidatePath('/grades'); return success('Nilai berhasil dihapus.'); }
  catch (error) { return failure(error); }
}
export async function saveAnnouncement(form: FormData): Promise<ActionResult> {
  if (!await allowed(['ADMIN'])) return forbidden();
  try {
    const id = value(form, 'id');
    const data = announcementSchema.parse({ title: value(form, 'title'), content: value(form, 'content') });
    if (id) await db.announcement.update({ where: { id }, data }); else await db.announcement.create({ data });
    revalidatePath('/announcements'); revalidatePath('/'); return success();
  } catch (error) { return failure(error); }
}
export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  if (!await allowed(['ADMIN'])) return forbidden();
  try { await db.announcement.delete({ where: { id } }); revalidatePath('/announcements'); revalidatePath('/'); return success('Pengumuman berhasil dihapus.'); }
  catch (error) { return failure(error); }
}
