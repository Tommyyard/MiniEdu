import { db } from '@/lib/db';
import { PageHeading } from '@/components/page-heading';
import { RecordManager } from '@/components/record-manager';
import { saveStudent, deleteStudent } from '@/actions/records';
import { requireRole } from '@/lib/auth';

export async function StudentDirectory({ editOnly = false }: { editOnly?: boolean }) {
  const user = await requireRole(['ADMIN', 'TEACHER']);
  const [students, classes] = await Promise.all([db.student.findMany({ include: { class: true }, orderBy: { name: 'asc' } }), db.class.findMany({ orderBy: { name: 'asc' } })]);
  const options = classes.map(c => ({ value: c.id, label: c.name }));
  const canEdit = user.role === 'ADMIN' || editOnly;
  return <><PageHeading title={editOnly ? 'Edit Data Siswa' : 'Data Siswa'} description={editOnly ? 'Perbarui identitas dan penempatan kelas siswa.' : 'Lihat identitas siswa dan penempatan kelas.'}/><RecordManager kind="student" readOnly={!canEdit} allowCreate={user.role === 'ADMIN'} allowDelete={user.role === 'ADMIN'} records={students.map(s => ({ id: s.id, nis: s.nis, name: s.name, gender: s.gender, genderLabel: s.gender === 'L' ? 'Laki-laki' : 'Perempuan', classId: s.classId, className: s.class.name }))} columns={[{ key: 'nis', label: 'NIS' }, { key: 'name', label: 'Nama' }, { key: 'className', label: 'Kelas' }, { key: 'genderLabel', label: 'Jenis Kelamin' }]} fields={[{ key: 'nis', label: 'NIS', required: true }, { key: 'name', label: 'Nama', required: true }, { key: 'gender', label: 'Jenis Kelamin', type: 'select', required: true, options: [{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }] }, { key: 'classId', label: 'Kelas', type: 'select', required: true, options }]} searchKeys={['name', 'nis']} filter={{ key: 'classId', label: 'Kelas', options }} saveAction={saveStudent} deleteAction={deleteStudent} createLabel="Tambah Siswa" emptyText="Belum ada siswa."/></>;
}
