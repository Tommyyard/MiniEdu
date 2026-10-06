import { db } from '@/lib/db';
import { allowed } from '@/lib/auth';
import { spreadsheetResponse, teacherHeaders } from '@/lib/spreadsheet';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  if (!await allowed(['ADMIN', 'TEACHER'])) return new Response('Akses ditolak.', { status: 403 });
  if (new URL(request.url).searchParams.has('template')) return spreadsheetResponse('template-guru.xlsx', 'Guru', teacherHeaders, []);
  const teachers = await db.teacher.findMany({ orderBy: { name: 'asc' } });
  return spreadsheetResponse('guru-miniedu.xlsx', 'Guru', teacherHeaders, teachers.map(t => [t.nip, t.name, t.subject, t.phone]));
}
