import { db } from '@/lib/db';
import { allowed } from '@/lib/auth';
import { spreadsheetResponse, gradeHeaders } from '@/lib/spreadsheet';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  if (!await allowed(['ADMIN', 'TEACHER'])) return new Response('Akses ditolak.', { status: 403 });
  if (new URL(request.url).searchParams.has('template')) return spreadsheetResponse('template-nilai.xlsx', 'Nilai', gradeHeaders, []);
  const grades = await db.grade.findMany({ include: { student: { include: { class: true } } }, orderBy: { createdAt: 'desc' } });
  return spreadsheetResponse('nilai-miniedu.xlsx', 'Nilai', gradeHeaders, grades.map(g => [g.student.nis, g.student.name, g.student.class.name, g.subject, g.semester, g.score]));
}
