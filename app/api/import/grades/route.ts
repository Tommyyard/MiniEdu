import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { allowed } from '@/lib/auth';
import { gradeSchema } from '@/lib/validation';
import { importError, readSpreadsheet, gradeHeaders } from '@/lib/spreadsheet';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!await allowed(['ADMIN', 'TEACHER'])) return importError('Akses ditolak.', [], 403);
  const file = await readSpreadsheet(request, gradeHeaders);
  if (!file.ok) return importError(file.error);
  const nisList = file.rows.map(row => String(row.NIS ?? ''));
  const students = await db.student.findMany({ where: { nis: { in: nisList } }, include: { class: true } });
  const studentByNis = new Map(students.map(student => [student.nis, student]));
  const errors: string[] = []; const seen = new Set<string>();
  const data = file.rows.map((row, index) => {
    if (typeof row.NIS !== 'string') { errors.push(`Baris ${index + 2}: NIS harus bertipe teks agar digit tidak hilang.`); return null; }
    const student = studentByNis.get(row.NIS.trim());
    if (!student) { errors.push(`Baris ${index + 2}: NIS tidak ditemukan.`); return null; }
    if (student.name !== String(row.Nama).trim() || student.class.name !== String(row.Kelas).trim()) { errors.push(`Baris ${index + 2}: nama atau kelas tidak cocok dengan NIS.`); return null; }
    const parsed = gradeSchema.safeParse({ studentId: student.id, subject: row['Mata Pelajaran'], semester: row.Semester, score: row.Nilai });
    if (!parsed.success) { errors.push(`Baris ${index + 2}: ${parsed.error.issues.map(i => i.message).join(', ')}`); return null; }
    const key = `${student.id}|${parsed.data.subject}|${parsed.data.semester}`;
    if (seen.has(key)) { errors.push(`Baris ${index + 2}: nilai siswa, mata pelajaran, dan semester duplikat dalam file.`); return null; }
    seen.add(key); return parsed.data;
  });
  if (errors.length) return importError(`${errors.length} baris tidak valid. Tidak ada data yang disimpan.`, errors);
  try {
    await db.$transaction(async tx => {
      for (const row of data) {
        const value = row!;
        const existing = await tx.grade.findFirst({ where: { studentId: value.studentId, subject: value.subject, semester: value.semester }, orderBy: { createdAt: 'desc' } });
        if (existing) await tx.grade.update({ where: { id: existing.id }, data: { score: value.score } });
        else await tx.grade.create({ data: value });
      }
    }, { timeout: 30_000 });
    revalidatePath('/grades');
    return Response.json({ ok: true, message: `${data.length} nilai berhasil diimpor.` });
  } catch { return importError('Import gagal karena konflik data atau masalah database. Tidak ada data yang disimpan.'); }
}
