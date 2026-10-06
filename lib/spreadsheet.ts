import * as XLSX from 'xlsx';

export const teacherHeaders = ['NIP', 'Nama', 'Mata Pelajaran', 'Nomor Telepon'] as const;
export const gradeHeaders = ['NIS', 'Nama', 'Kelas', 'Mata Pelajaran', 'Semester', 'Nilai'] as const;
export function spreadsheetResponse(filename: string, sheetName: string, headers: readonly string[], rows: (string | number)[][]): Response {
  const sheet = XLSX.utils.aoa_to_sheet([[...headers], ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  const bytes = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="${filename}"`, 'Cache-Control': 'no-store' } });
}
export async function readSpreadsheet(request: Request, headers: readonly string[]): Promise<{ ok: true; rows: Record<string, unknown>[] } | { ok: false; error: string }> {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'Pilih file XLSX.' };
  if (!/\.xlsx?$/i.test(file.name)) return { ok: false, error: 'File harus berformat .xlsx atau .xls.' };
  if (file.size > 2_000_000) return { ok: false, error: 'Ukuran file maksimal 2 MB.' };
  try {
    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) return { ok: false, error: 'Sheet pertama kosong.' };
    const headerRow = (XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0 }) as unknown[][])[0] ?? [];
    if (headers.some(header => !headerRow.includes(header))) return { ok: false, error: `Kolom wajib: ${headers.join(', ')}.` };
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: true });
    if (!rows.length) return { ok: false, error: 'File tidak berisi data.' };
    if (rows.length > 500) return { ok: false, error: 'Maksimal 500 baris per import.' };
    return { ok: true, rows };
  } catch { return { ok: false, error: 'File spreadsheet tidak dapat dibaca.' }; }
}
export const importError = (message: string, errors: string[] = [], status = 400) => Response.json({ ok: false, message, errors }, { status });
