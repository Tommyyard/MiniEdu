import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { allowed } from '@/lib/auth';
import { teacherSchema } from '@/lib/validation';
import { importError, readSpreadsheet, teacherHeaders } from '@/lib/spreadsheet';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!await allowed(['ADMIN'])) return importError('Akses ditolak.', [], 403);
  const file = await readSpreadsheet(request, teacherHeaders);
  if (!file.ok) return importError(file.error);
  const errors: string[] = []; const seen = new Set<string>();
  const data = file.rows.map((row, index) => {
    if (typeof row.NIP !== 'string') { errors.push(`Baris ${index + 2}: NIP harus bertipe teks agar digit tidak hilang.`); return null; }
    const parsed = teacherSchema.safeParse({ nip: row.NIP, name: row.Nama, subject: row['Mata Pelajaran'], phone: row['Nomor Telepon'] });
    if (!parsed.success) { errors.push(`Baris ${index + 2}: ${parsed.error.issues.map(i => i.message).join(', ')}`); return null; }
    if (seen.has(parsed.data.nip)) { errors.push(`Baris ${index + 2}: NIP duplikat dalam file.`); return null; }
    seen.add(parsed.data.nip); return parsed.data;
  });
  if (errors.length) return importError(`${errors.length} baris tidak valid. Tidak ada data yang disimpan.`, errors);
  try {
    await db.$transaction(data.map(row => db.teacher.upsert({ where: { nip: row!.nip }, update: row!, create: row! })));
    revalidatePath('/teachers'); revalidatePath('/');
    return Response.json({ ok: true, message: `${data.length} data guru berhasil diimpor.` });
  } catch { return importError('Import gagal karena konflik data atau masalah database. Tidak ada data yang disimpan.'); }
}
