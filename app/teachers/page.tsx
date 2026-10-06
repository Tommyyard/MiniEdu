import { db } from '@/lib/db';
import { PageHeading } from '@/components/page-heading';
import { RecordManager } from '@/components/record-manager';
import { saveTeacher, deleteTeacher } from '@/actions/records';
import { requireRole } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function TeachersPage() {
  const user = await requireRole(['ADMIN', 'TEACHER']);
  const teachers = await db.teacher.findMany({ orderBy: { name: 'asc' } });
  return <><PageHeading title="Data Guru" description="Kelola guru dan mata pelajaran yang diampu."/><RecordManager kind="teacher" readOnly={user.role === 'TEACHER'} importUrl={user.role === 'ADMIN' ? '/api/import/teachers' : undefined} xlsxUrl="/api/export/teachers/xlsx" records={teachers.map(t => ({ id: t.id, nip: t.nip, name: t.name, subject: t.subject, phone: t.phone }))} columns={[{ key: 'nip', label: 'NIP' }, { key: 'name', label: 'Nama' }, { key: 'subject', label: 'Mata Pelajaran' }, { key: 'phone', label: 'Nomor Telepon' }]} fields={[{ key: 'nip', label: 'NIP', required: true }, { key: 'name', label: 'Nama', required: true }, { key: 'subject', label: 'Mata Pelajaran', required: true }, { key: 'phone', label: 'Nomor Telepon' }]} searchKeys={['nip', 'name', 'subject']} saveAction={saveTeacher} deleteAction={deleteTeacher} createLabel="Tambah Guru" exportUrl="/api/export/teachers" emptyText="Belum ada guru. Tambahkan guru pertama."/></>;
}
