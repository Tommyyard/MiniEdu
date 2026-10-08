'use client';
import { useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowDownToLine, ArrowUpFromLine, Magnifier, Pencil, Plus, TrashBin } from '@gravity-ui/icons';
import { announcementSchema, gradeSchema, studentSchema, teacherSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { ActionResult } from '@/lib/action-result';

type RecordItem = { id: string; [key: string]: string | number };
type Field = { key: string; label: string; type?: 'text' | 'number' | 'select' | 'textarea'; required?: boolean; options?: { value: string; label: string }[] };
type Column = { key: string; label: string };
type Filter = { key: string; label: string; options: { value: string; label: string }[] };
type Props = { kind: 'student' | 'teacher' | 'grade' | 'announcement'; records: RecordItem[]; fields: Field[]; columns: Column[]; searchKeys?: string[]; filter?: Filter; secondFilter?: Filter; saveAction: (form: FormData) => Promise<ActionResult>; deleteAction: (id: string) => Promise<ActionResult>; createLabel: string; exportUrl?: string; xlsxUrl?: string; importUrl?: string; readOnly?: boolean; allowCreate?: boolean; allowDelete?: boolean; emptyText?: string };
const schemas = { student: studentSchema, teacher: teacherSchema, grade: gradeSchema, announcement: announcementSchema };
export function RecordManager({ kind, records, fields, columns, searchKeys = [], filter, secondFilter, saveAction, deleteAction, createLabel, exportUrl, xlsxUrl, importUrl, readOnly = false, allowCreate = true, allowDelete = true, emptyText = 'Belum ada data.' }: Props) {
  const router = useRouter(); const uploadRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(''); const [filterValue, setFilterValue] = useState(''); const [secondFilterValue, setSecondFilterValue] = useState('');
  const [editing, setEditing] = useState<RecordItem | null>(null); const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<ActionResult | null>(null); const [importErrors, setImportErrors] = useState<string[]>([]); const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<Record<string, string>>();
  const shown = useMemo(() => records.filter(row => (!filter || !filterValue || row[filter.key] === filterValue) && (!secondFilter || !secondFilterValue || row[secondFilter.key] === secondFilterValue) && (!query || searchKeys.some(key => String(row[key] ?? '').toLowerCase().includes(query.toLowerCase())))), [records, filter, filterValue, secondFilter, secondFilterValue, query, searchKeys]);
  function showForm(row: RecordItem | null) { setEditing(row); setFeedback(null); reset(Object.fromEntries(fields.map(field => [field.key, String(row?.[field.key] ?? '')]))); setOpen(true); }
  function submit(values: Record<string, string>) {
    const parsed = schemas[kind].safeParse(values);
    if (!parsed.success) { for (const issue of parsed.error.issues) setError(String(issue.path[0]), { message: issue.message }); return; }
    const form = new FormData(); form.set('id', editing?.id ?? '');
    for (const field of fields) form.set(field.key, values[field.key] ?? '');
    startTransition(async () => { const result = await saveAction(form); setFeedback(result); if (result.ok) { setOpen(false); setEditing(null); router.refresh(); } });
  }
  function remove(row: RecordItem) {
    if (!window.confirm(`Hapus ${row.name ?? row.title ?? 'data ini'}? Tindakan ini tidak dapat dibatalkan.`)) return;
    startTransition(async () => { const result = await deleteAction(row.id); setFeedback(result); if (result.ok) router.refresh(); });
  }
  async function importFile(file: File) {
    if (!importUrl) return;
    setFeedback(null); setImportErrors([]);
    const data = new FormData(); data.set('file', file);
    try {
      const response = await fetch(importUrl, { method: 'POST', body: data });
      const result = await response.json() as { ok: boolean; message: string; errors?: string[] };
      setFeedback({ ok: result.ok, message: result.message });
      setImportErrors(result.errors ?? []);
      if (result.ok) router.refresh();
    } catch { setFeedback({ ok: false, message: 'Import gagal. Periksa koneksi lalu coba lagi.' }); }
    if (uploadRef.current) uploadRef.current.value = '';
  }
  return <>
    <div className="record-toolbar"><div className="record-filters"><div className="relative search-field"><Magnifier className="absolute left-3 top-3 text-muted-foreground" width={18} height={18} aria-hidden="true"/><Input className="pl-10" placeholder="Cari data..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Cari data"/></div>{filter && <select className="field" value={filterValue} onChange={e => setFilterValue(e.target.value)} aria-label={filter.label}><option value="">Semua {filter.label}</option>{filter.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>}{secondFilter && <select className="field" value={secondFilterValue} onChange={e => setSecondFilterValue(e.target.value)} aria-label={secondFilter.label}><option value="">Semua {secondFilter.label}</option>{secondFilter.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>}</div><div className="record-actions">{!readOnly && allowCreate && <Button onClick={() => showForm(null)}><Plus width={16} height={16} aria-hidden="true"/>{createLabel}</Button>}{xlsxUrl && <Button asChild variant="secondary"><a href={xlsxUrl}><ArrowDownToLine width={16} height={16} aria-hidden="true"/>Export XLSX</a></Button>}{importUrl && !readOnly && <><input ref={uploadRef} className="hidden" type="file" accept=".xlsx,.xls" aria-label="Pilih file XLSX" onChange={e => { const file = e.target.files?.[0]; if (file) void importFile(file); }}/><Button variant="secondary" onClick={() => uploadRef.current?.click()}><ArrowUpFromLine width={16} height={16} aria-hidden="true"/>Import XLSX</Button>{xlsxUrl && <Button asChild variant="ghost"><a href={`${xlsxUrl}?template=1`}>Template XLSX</a></Button>}</>}{exportUrl && <Button asChild variant="secondary"><a href={exportUrl}>Export CSV</a></Button>}</div></div>
    <p className="record-count" role="status">Menampilkan {shown.length.toLocaleString('id-ID')} dari {records.length.toLocaleString('id-ID')} data</p>
    {feedback && <div role="status" className={`mb-4 rounded-xl px-4 py-3 text-sm ${feedback.ok ? 'feedback-success' : 'feedback-error'}`}>{feedback.message}</div>}
    {importErrors.length > 0 && <div role="alert" className="mb-4 max-h-44 overflow-auto rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300"><p className="font-semibold">Baris yang perlu diperbaiki:</p><ul className="mt-2 list-inside list-disc">{importErrors.map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
    <div className="panel table-wrap record-table">{shown.length ? <table><thead><tr>{columns.map(c => <th scope="col" key={c.key}>{c.label}</th>)}{!readOnly && <th scope="col" className="cell-actions">Aksi</th>}</tr></thead><tbody>{shown.map(row => <tr key={row.id}>{columns.map(c => <td key={c.key}>{c.key === 'content' ? <span className="cell-content" title={String(row[c.key] ?? '')}>{row[c.key]}</span> : row[c.key]}</td>)}{!readOnly && <td><div className="flex gap-2"><Button variant="ghost" size="icon" title="Edit" aria-label={`Edit ${row.name ?? row.title}`} onClick={() => showForm(row)}><Pencil width={16} height={16}/></Button>{allowDelete && <Button variant="ghost" size="icon" title="Hapus" aria-label={`Hapus ${row.name ?? row.title}`} onClick={() => remove(row)} disabled={pending}><TrashBin width={16} height={16}/></Button>}</div></td>}</tr>)}</tbody></table> : <div className="record-empty"><strong>{query || filterValue || secondFilterValue ? 'Tidak ada hasil' : 'Data belum tersedia'}</strong>{query || filterValue || secondFilterValue ? 'Coba ubah kata kunci atau filter.' : emptyText}</div>}</div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogTitle>{editing ? `Edit ${kind === 'student' ? 'Siswa' : kind === 'teacher' ? 'Guru' : kind === 'grade' ? 'Nilai' : 'Pengumuman'}` : createLabel}</DialogTitle><form noValidate onSubmit={handleSubmit(submit)} className="space-y-4">{fields.map(field => <div key={field.key}><label className="field-label" htmlFor={field.key}>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>{field.type === 'select' ? <select id={field.key} className="field" aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} {...register(field.key)}><option value="">Pilih {field.label}</option>{field.options?.map(o => <option value={o.value} key={o.value}>{o.label}</option>)}</select> : field.type === 'textarea' ? <textarea id={field.key} rows={5} className="field" aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} {...register(field.key)}/> : <Input id={field.key} type={field.type ?? 'text'} min={field.key === 'score' ? 0 : undefined} max={field.key === 'score' ? 100 : undefined} aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} {...register(field.key)}/>} {errors[field.key] && <p id={`${field.key}-error`} className="mt-1 text-xs text-destructive">{errors[field.key]?.message}</p>}</div>)}{feedback && !feedback.ok && <p role="alert" className="feedback-error rounded-lg p-3 text-sm">{feedback.message}</p>}<div className="flex justify-end gap-2 pt-2"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button><Button type="submit" disabled={pending}>{pending ? 'Menyimpan...' : 'Simpan'}</Button></div></form></DialogContent></Dialog>
  </>;
}
