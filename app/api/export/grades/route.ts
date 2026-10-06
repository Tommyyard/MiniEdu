import { db } from '@/lib/db';
import { csvResponse } from '@/lib/csv';
import { allowed } from '@/lib/auth';
export async function GET() {
  if (!await allowed(['ADMIN', 'TEACHER'])) return new Response('Akses ditolak.', { status: 403 });
  const grades = await db.grade.findMany({ include: { student: { include: { class: true } } }, orderBy: { createdAt: 'desc' } });
  return csvResponse('nilai-miniedu.csv', ['NIS', 'Nama', 'Kelas', 'Mata Pelajaran', 'Semester', 'Nilai'], grades.map(g => [g.student.nis, g.student.name, g.student.class.name, g.subject, g.semester, g.score]));
}
