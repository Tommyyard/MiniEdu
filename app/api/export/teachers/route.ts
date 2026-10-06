import { db } from '@/lib/db';
import { csvResponse } from '@/lib/csv';
import { allowed } from '@/lib/auth';
export async function GET() {
  if (!await allowed(['ADMIN', 'TEACHER'])) return new Response('Akses ditolak.', { status: 403 });
  const teachers = await db.teacher.findMany({ orderBy: { name: 'asc' } });
  return csvResponse('guru-miniedu.csv', ['NIP', 'Nama', 'Mata Pelajaran', 'Nomor Telepon'], teachers.map(t => [t.nip, t.name, t.subject, t.phone]));
}
